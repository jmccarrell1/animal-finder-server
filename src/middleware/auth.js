const axios = require('axios');
const cache = require('../components/cache');

async function verifyToken(req, res) {
  let response = await cache.get('token');

  if (response) {
    return;
  }

  if (response === undefined) {
    response = await axios.post(
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
      cache.set('token', response.data.access_token);

      if (response.data.access_token) {
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + response.data.access_token;
        return response.data.access_token;
      }
    }
  }
}

async function refreshToken(req, res, next) {
  await verifyToken(req, res, process.env.AUTH_TOKEN_TIMEOUT_MINUTES);
  next();
}

module.exports = refreshToken;
