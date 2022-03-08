const schedule = require('node-schedule');
const audit = require('./lighthouse');

const cronExpr = '0 8 * * *'; // 8:00 AM, Daily
const siteUrl = 'https://city.sk-ii.com';
const outputDir = '.';

console.log('Job scheduled', cronExpr);
console.log('Output directory', outputDir);
console.log('Site URL', siteUrl);

const job = schedule.scheduleJob(cronExpr, async function () {
  console.log('Job running at', currentTime());
  await audit(siteUrl, outputDir);
});
if (!job) {
  throw new Error('Invalid cron expression: ' + cronExpr);
}

job.on('success', () => {
  console.log('Job completed at', currentTime());
}).on('error', (err) => {
  console.error('Job failed at', currentTime(), err);
});

console.log('Server started.');

function currentTime() {
  return new Date().toLocaleString();
}
