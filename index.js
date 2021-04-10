const tmi = require('tmi.js');
const puppeteer = require('puppeteer');

let browser = null;
let page = null;
let instrumentCanvasElement = null;

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: [ 'brandtamos' ]
});

client.connect();

(async () => {
    browser = await puppeteer.launch(
      { 
        headless: false,
        args: [`--window-size=1980,1080`]
      });
    page = await browser.newPage();
    await page.setViewport({ width: 1950, height: 950});
    await page.goto('https://musiclab.chromeexperiments.com/Song-Maker',{waitUntil: 'networkidle0'});
    musicCanvasElement = await page.$("#instrument-canvas");
  })();

client.on('message', (channel, tags, message, self) => {
  console.log(`${tags['display-name']}: ${message}`);
  if(message.toLowerCase().startsWith('!note')){
    const args = message.split(' ');
    const x = parseInt(args[1]);
    const y = parseInt(args[2]);
    clickPage(x, y);
  }
});

async function clickPage(x, y){
  await page.mouse.click(x,y);
}
