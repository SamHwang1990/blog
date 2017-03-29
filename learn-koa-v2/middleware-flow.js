/**
 * Created by samhwang1990@gmail.com on 17/3/26.
 */

'use strict';

const NewServer = require('./NewServer');

const app = new NewServer();

app.use(async (context, next) => {
  let start = process.hrtime();
  console.log('middleware1 start');

  await next();

  let span = process.hrtime(start);
  console.log(`middleware1 end, and span ${span[0]} seconds and ${span[1]} nanoseconds.`);
});

app.use(async (context, next) => {
  let start = process.hrtime();
  console.log('middleware2 start');

  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  await next();

  let span = process.hrtime(start);
  console.log(`middleware2 end, and span ${span[0]} seconds and ${span[1]} nanoseconds.`);
});

app.use((context, next) => {
  console.log(`middleware3 is a common function which mean not a async function`);

  // when use a common function in koa@v2 middleware flow,
  // you shall always trigger next() and return the promise from next(),
  // so, the downstream middleware can start in serial
  return next();
});

app.use(async (context, next) => {
  let start = process.hrtime();
  console.log('middleware4 start');

  await next();

  let span = process.hrtime(start);
  console.log(`middleware4 end, and span ${span[0]} seconds and ${span[1]} nanoseconds.`);
});

app.listen();