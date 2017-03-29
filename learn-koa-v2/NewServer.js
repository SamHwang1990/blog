/**
 * Created by samhwang1990@gmail.com on 17/3/26.
 */

'use strict';

const Koa = require('koa');
const assert = require('assert');

class NewServer {
  constructor() {

    let app = this.app = new Koa;

    app.use(async function xResponseTime(context, next) {
      let startHrTime = process.hrtime();
      await next();
      let intervalHrTime = process.hrtime(startHrTime);

      console.log(`request span ${intervalHrTime[0]} seconds and ${intervalHrTime[1]} nanoseconds`);
    });
  }
  listen() {
    this.app.listen(3000, () => {
      console.log(`server listened at 3000`);
    });
  }
  use (middleware) {
    this.app.use(middleware);
  }
}

module.exports = NewServer;