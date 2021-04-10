const tmi = require('tmi.js');
const puppeteer = require('puppeteer');
const cellMapping = require('./cellMapper');

let browser = null;
let page = null;

const xOffset = 20;
const yOffset = 95;
const cellHeight = 48;
const cellWidth = 62;

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
    //musicCanvasElement = await page.$("#instrument-canvas");
    await page.addScriptTag({content: `${addLabels}`});
    await page.evaluate(addLabels);
  })();

client.on('message', (channel, tags, message, self) => {
  console.log(`${tags['display-name']}: ${message}`);
  if(message.toLowerCase().startsWith('!note')){
    const args = message.split(' ');
    const xParam = cellMapping.get(args[1].toUpperCase());
    const yParam = parseInt(args[2]) - 1;
    clickPage(xParam, yParam);
  }
});

async function clickPage(x, y){
  await page.mouse.click(xOffset + (x * cellWidth), yOffset + (y *cellHeight));
}

function addLabels(){
  xOffset1 = 21;
  yOffset1 = 95;
  cellHeight1 = 46;
  cellWidth1 = 61;

  div = document.createElement("div");
  div.style.width = "700px";
  div.style.height = "100px";
  div.style.color = "red";
  div.style.position = "absolute";
  div.style.left = "100px";
  div.style.top = "30px";
  div.style.zIndex = -1;
  div.style.fontWeight = "600";
  div.innerHTML = "Command: !note [column letter] [row number] ex: !note A 1";
  document.body.appendChild(div);

  for(let i = 0; i < 33; i++){
    cellColumns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF"];
    div = document.createElement("div");
    div.style.width = cellWidth1 +"px";
    div.style.height = "100px";
    div.style.color = "red";
    div.style.position = "absolute";
    div.style.left = xOffset1 + (i*cellWidth1) + "px";
    div.style.top = "60px";
    div.style.fontWeight = "600";
    div.style.zIndex = -1;
    div.innerHTML = cellColumns[i];
    document.body.appendChild(div);
  }

  for(let i = 0; i<16; i++){
    cellRows = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

    div = document.createElement("div");
    div.style.width = 5 +"px";
    div.style.height = cellHeight1 + "px";
    div.style.color = "red";
    div.style.position = "absolute";
    div.style.left = "5px";
    div.style.top = yOffset1 + i*cellHeight1 + "px";
    div.style.fontWeight = "600";
    div.innerHTML = cellRows[i];
    document.body.appendChild(div);
  }
}
