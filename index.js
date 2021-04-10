const tmi = require('tmi.js');
const puppeteer = require('puppeteer');

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: [ 'brandtamos' ]
});

client.connect();

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://okayco.de');
  
    await browser.close();
  })();

client.on('message', (channel, tags, message, self) => {
  console.log(`${tags['display-name']}: ${message}`);
});