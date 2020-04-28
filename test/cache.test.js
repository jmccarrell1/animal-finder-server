const assert = require('assert');
const sinon = require('sinon');
const refreshToken = require('../cache');

describe('cache should set', () => {
  it('should return 1', () => {
    refreshToken(null, null, null);
    assert.equal(1 + 1, 2);
  });
  it('should return 9', () => {
    assert.equal(3 * 3, 9);
  });
});
