const axios = require('axios');
const cache = require('../cache');

const verifyToken = (req, res) => {
  return cache.get('token', function () {
    return axios
      .post(
        process.env.AUTH_TOKEN_URL,
        {
          grant_type: process.env.AUTH_GRANT_TYPE,
          client_id: process.env.AUTH_CLIENT_ID,
          client_secret: process.env.AUTH_CLIENT_SECRET,
        },
        {
          headers: { 'content-type': 'application/json' },
        }
      )
      .then((response) => {
        if (response.data.access_token) {
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + response.data.access_token;
        }
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  });
};

module.exports = (req, res, next) => {
  verifyToken(req, res, process.env.AUTH_TOKEN_TIMEOUT_MINUTES).then(() => {
    next();
  });
};
