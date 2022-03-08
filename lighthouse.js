const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

module.exports = async function (siteUrl, outputDir) {
  const reportName = siteUrl.replace(/https?:\/\//, '').concat('_').concat(new Date().toDateString());
  return Promise.all([
    // desktop
    runLighthouse(
      siteUrl,
      require('lighthouse/lighthouse-core/config/lr-desktop-config.js'),
      `${outputDir}/${reportName}_desktop.report.html`
    ),
    // mobile
    runLighthouse(
      siteUrl,
      require('lighthouse/lighthouse-core/config/lr-mobile-config.js'),
      `${outputDir}/${reportName}_mobile.report.html`
    )
  ])
}

// Source: https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically
async function runLighthouse(siteUrl, config, outputFile) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { logLevel: 'info', output: 'html', port: chrome.port };
  const runnerResult = await lighthouse(siteUrl, options, config);
  fs.writeFileSync(outputFile, runnerResult.report);
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
  await chrome.kill();
}
