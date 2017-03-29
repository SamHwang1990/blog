/**
 * Created by samhwang1990@gmail.com on 17/3/26.
 */

'use strict';

const assert = require('assert');
const NewServer = require('./NewServer');

const app = new NewServer;

app.use(async function catchDownStreamError(context, next) {
  try {
    await next();
  } catch(e) {
    assert.equal(
        e,
        'async rejected by throw',
        `上游中间件使用try-catch 捕捉下游async 函数中间件调用时throw 的错误`);
  }
});

app.use(async function throwError() {
  throw 'async rejected by throw';
});

app.use(async function catchDownStreamError(context, next) {
  try {
    await next();
  } catch(e) {
    assert.equal(
        e,
        'async rejected by rejected await',
        `上游中间件使用try-catch 捕捉下游async 函数中间件await 到的rejected promise`);
  }
});

app.use(async function throwError() {
  await Promise.reject('async rejected by rejected await');
});

app.use(async function catchDownStreamError(context, next) {
  try {
    await next();
  } catch(e) {
    assert.equal(
        e,
        'common function rejected by throw',
        `上游中间件使用try-catch 捕捉下游普通函数中间件调用时throw 的错误`);
  }
});

app.use(function throwError() {
  throw 'common function rejected by throw';
});

app.listen();