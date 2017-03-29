/**
 * Created by samhwang1990@gmail.com on 17/3/20.
 */

'use strict';

const Koa = require('koa');
const send = require('koa-send');

const app = new Koa;

app.use(async function xResponseTime(ctx, next) {
  let start = new Date();
  await next();
  let end = new Date();
  let during = end.getTime() - start.getTime();
  console.log(`Handle request ${ctx.href} with requestvar ${JSON.stringify(ctx.request.body)} during ${Math.round(100 * during/1000)/100}s`);
});

// simple static server
// /vendor => /node_modules
app.use(async (ctx, next) => {
  let method = ctx.method;

  if (method !== 'HEAD' && method !== 'GET') return await next();

  let isVendor = (/\/vendor\/(.*)/).exec(ctx.path);

  if (isVendor != null) {
    return await send(ctx, isVendor[1], { root: 'node_modules' });
  }

  return await next();
});

// simple static server
// /assets => /assets
app.use(async (ctx, next) => {
  let method = ctx.method;

  if (method !== 'HEAD' && method !== 'GET') return await next();

  let isAssets = (/\/assets\/(.*)/).exec(ctx.path);

  if (isAssets != null) {
    return await send(ctx, isAssets[1], { root: 'assets' });
  }

  return await next();
});

// html static server
// /public
app.use(async (ctx, next) => {
  let method = ctx.method;

  if (method !== 'GET') return await next();

  let path = ctx.request.path;
  let matchResult = (/\/public\/(.*?\.html)/).exec(path);
  if (matchResult != null) {
    return await send(ctx, matchResult[1], {root: 'public'});
  }
  return await next();
});

app.listen(3001, () => {
  console.log(`server is listening at ${3001}`);
});