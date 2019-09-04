'use strict';

const { RTMClient, WebClient } = require('@slack/client');
require('dotenv').config();
const token = process.env.TOKEN;
const webClient = new WebClient(token);
const rtmClient = new RTMClient(token);
const request = require('requestretry');
const { CronJob } = require('cron');
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('bototo');
  res.end();
}).listen(process.env.PORT, '0.0.0.0', () => console.log(`Server running at ${process.env.PORT}`));

const replyToMsg = (ch, msg) => {
  webClient.chat.postMessage({
    channel: ch,
    text: msg,
    username: 'TommyBot',
    icon_emoji: ':angry_trump:'
  });
};

new CronJob('* */3 * * * *', ()=>{
  request({
    url: process.env.URL,
  }).then(res => {
    console.log(res.body);
  });
}, null, true, 'Asia/Bangkok');

new CronJob('0 0 9 * * 5', ()=>{
  request({
    url: 'https://www.gaitameonline.com/rateaj/getrate',
  }).then(res => {
    if (res.statusCode !== 200) {
      return;
    }
    const rateInf = JSON.parse(res.body);
    for(let i=0;i<rateInf.quotes.length;i++){
      let result = rateInf.quotes[i].currencyPairCode === 'USDJPY';
      if(result===true){
        const ask = "現在の円/ドル(買い)は" + rateInf.quotes[i].ask + "です。";
        const bid = "現在の円/ドル(売り)は" + rateInf.quotes[i].bid + "です。";
        replyToMsg('CJHKRA4NM',ask +"\n"+bid);
        break;
      }
    }
  }).catch(err => {
    console.error('API requesting error.', err);
  });
},null, true, 'Asia/Bangkok');




let count = 0;


rtmClient.on('message', event => {
  // is there text?
  if (!('text' in event)) {
    return;
  }
  if (event.text !== '!fortune') {
    return;
  }
  // 下を変更する

  let fort;
  let Num = 7;
  switch(Math.ceil(Num*Math.random())){
    case 1:
      fort = "大吉";
    break;
    case 2:
      fort = "中吉";
    break;
    case 3:
      fort = "小吉";
    break;
    case 4:
      fort = "吉";
    break;
    case 5:
      fort = "凶";
    break;
    case 6:
      fort = "大凶";
    break;
    case 7:
      fort = "モリンガ";
    break;

  } 
  replyToMsg(event.channel, fort);
});

rtmClient.start();
