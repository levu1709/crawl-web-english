// load puppeteer
const puppeteer = require('puppeteer');
const domain = "https://basicenglishspeaking.com/about";
const request = require('request');
const catelogy = require('./src/catelogy');
const lesson = require('./src/lesson');
const common = require('./src/common');
const getSubtitles = require('youtube-captions-scraper').getSubtitles;
const fs = require('fs');
// IIFE
(async () => {
  // wrapper to catch errors
  try {
    console.time();
    // const catelogysJson = await fs.readFileSync('common/catelogy.json');
    // const data = [];
    // const catelogys = await catelogy.getCatelogy('https://basicenglishspeaking.com/100-common-phrases-and-sentence-patterns/');
    // fs.writeFileSync('common/catelogy.json', JSON.stringify(catelogys));
    // const catelogys = JSON.parse(catelogysJson);
    // await common.recursion(catelogys, 91);
    // for (let i = 0; i < catelogys.length; i++) {
    //   console.log(444);
    //   const fileName = catelogys[i].topic.split('.')[1].replace('?', '');
    //   const commonsJSON = await fs.readFileSync(`common/${fileName.toLowerCase().replace(' ', '_')}.json`);
    //   const commons = JSON.parse(commonsJSON);
    //   for (let j = 0; j < commons.length; j++){
    //     console.log(j)
    //     data.push(commons[j]);
    //   }
    // }
    // fs.writeFileSync('common/english_common.json', JSON.stringify(data));
    // const commonJson = await fs.readFileSync('common/english_common.json');
    // console.log(JSON.parse(commonJson).length)
    // await common.recursion(JSON.parse(commonJson), 380);
    getSubtitles({
      videoID: 'ksZpu1s1LV0',
      lang: 'us'
    }).then(function (captions) {
      console.log(captions);
      console.timeEnd();
      return;
    }).catch(error => {
      console.log(error);
    });
  } catch (error) {
    // display errors
    console.log(error);
  }
})();