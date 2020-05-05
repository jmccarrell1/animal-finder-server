//const assert = require('assert');
const { assert, expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const cache = require('../src/components/cache');
//const refreshToken = require('../cache');
const refreshToken = require('../src/middleware/auth');

//
//  should use cache.get
//  should use axios.post
//  should use axios.defaults.headers.common
//  should return response.data
//  should use next()

describe('Auth Middleware', () => {
  describe('request handler creation', () => {
    it('should return a function', () => {
      assert.isFunction(refreshToken);
    });

    it('should accept three arguments', () => {
      expect(refreshToken.length).to.equal(3);
    });
  });

  describe('request handler calling', () => {
    it('should return existing cache item and call next() once', async () => {
      cache.set('token', 'token_val');

      let nextSpy = sinon.spy();

      await refreshToken({}, {}, nextSpy);

      expect(nextSpy.calledOnce).to.be.true;
      expect(cache.get('token')).to.equal('token_val');
    });
  });

  describe('request handler calling', () => {
    it('should return new cache item and call next() once', async () => {
      cache.set('token', 'token_val');

      let nextSpy = sinon.spy();
      sinon.stub(cache, 'get').returns('new_token_val');
      sinon
        .stub(axios, 'post')
        .returns({ data: { access_token: 'new_token_val' } });

      await refreshToken({}, {}, nextSpy);

      expect(nextSpy.calledOnce).to.be.true;
      expect(cache.get('token')).to.equal('new_token_val');
    });
  });
});
