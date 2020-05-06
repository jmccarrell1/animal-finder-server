require('dotenv').config();
const axios = require('axios');
const Animal = require('./models/animal');
const queryBuilder = require('../routes/query-builder');
const logger = require('../components/logger');

const refresh = async () => {
  var args = process.argv.slice(2);

  const params = {
    type: args[0],
    age: args[1],
    status: args[2],
    location: args[3],
    meta: { page: args[4] },
  };

  try {
    const url = queryBuilder.buildAnimal(params);
    await authenticate();
    await processPages(url);
  } catch (error) {
    logger.error(`post exception: ${error} body: ${params}`);
  }
};

refresh();

async function processPages(url) {
  const searchParams = new URLSearchParams(url.searchParams);
  const startPage = searchParams.get('page');

  let page = startPage;

  let response = {};

  while (page > 0) {
    console.info(`current page: ${page}`);

    response = await axios.get(url.href, url);

    if (response) {
      // insert into db

      for (const iterator of response.data.animals) {
        Animal.findOneAndUpdate(
          { id: iterator.id },
          iterator,
          {
            omitUndefined: true,
            returnOriginal: false,
            upsert: true,
          },
          function (error, item) {
            logger.info(item);
          }
        );
      }

      page = getNextPage(response.data);
      url.searchParams.set('page', page);
    } else {
      page = 0;
    }
  }
}

function getNextPage(data) {
  const nextPage = data.pagination.current_page + 1;
  const totalPages = data.pagination.total_pages;

  if (nextPage <= totalPages) {
    return nextPage;
  }

  return 0;
}

async function authenticate() {
  const response = await axios.post(
    process.env.AUTH_TOKEN_URL,
    {
      grant_type: process.env.AUTH_GRANT_TYPE,
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_CLIENT_SECRET,
    },
    {
      headers: { 'content-type': 'application/json' },
    }
  );

  if (response) {
    if (response.data.access_token) {
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + response.data.access_token;
    }
  }
}
