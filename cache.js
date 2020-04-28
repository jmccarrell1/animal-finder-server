const cache = require('node-cache');

class Cache {
  constructor(stdTTL, checkperiod, useClones) {
    this.cache = new cache(stdTTL, checkperiod, useClones);
  }

  get(key, callback, ttl) {
    const value = this.cache.get(key);
    if (value) {
      return Promise.resolve(value);
    }

    return callback()
      .then((result) => {
        this.cache.set(key, result);
        if (ttl) {
          this.cache.ttl(key, ttl);
        }
        return result;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  del(keys) {
    this.cache.del(keys);
  }

  has(key) {
    return this.cache.has(key);
  }

  flush() {
    this.cache.flushAll();
  }
}

module.exports = new Cache(
  process.env.CACHE_TTL,
  process.env.CACHE_CHECK_PERIOD,
  process.env.CACHE_CLONES
);
