const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
const { resolve } = require('path');
const data = {
  sentences: []
};
exports.getCommonByTopic = async (topicName, topicUrl) => {
    const browser = await puppeteer.launch({
        headless: true,
        devtools: false
    });
    console.log(topicName);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(topicUrl, {
      timeout: 13000000
    });
    const lessons = await page.evaluate((topicName) => {
      const items = Array.from(document.querySelectorAll('.sc_player_container1'));
      return items.map(item => {
          return {
            topic: topicName.split('.')[1],
            sentence: `${item.nextSibling.textContent}${item.nextSibling.nextSibling.innerText} ${item.nextSibling.nextSibling.nextSibling.textContent}`,
            nameAudio: item.querySelector(".myButton_play").getAttribute('onclick').split(';')[0].split(',')[1].replace(/'/g, '').replace('.','_'),
            urlAudio: item.querySelector(".myButton_play").getAttribute('onclick').split(';')[0].split(',')[2].replace(/\'/g, ''),
          }
      })
    }, topicName);
    if(lessons.length) {
        await browser.close();
    }
    return lessons;
}

exports.recursion = async (listLesson, index) => {
    console.log(listLesson[index])
    if(!listLesson[index]) {
        return;
    }
    // console.log(index);
    // const fileName = listLesson[index].topic.split('.')[1].replace('?', '');
    // const lessons  = await this.getCommonByTopic(listLesson[index].topic, listLesson[index].urlTopic);
    // fs.writeFileSync(`common/${fileName.toLowerCase().replace(' ', '_')}.json`, JSON.stringify(lessons));
    // // data.sentences.push(lessons);
    // index = index + 1;
    // return this.recursion(listLesson, index)
    console.log(index);
    const folderName = listLesson[index].topic.replace(' ', '_');
    if(!fs.existsSync(`media_common/${folderName}`)){
      fs.mkdirSync(`media_common/${folderName}`);
    }
    request.head(listLesson[index].urlAudio, (err, res, body) => {
      request(listLesson[index].urlAudio).pipe(fs.createWriteStream(`media_common/${folderName}/${listLesson[index].nameAudio}.mp3`)).on('finish', (item) => {
          index = index + 1;
          return this.recursion(listLesson, index);
      }).on('error', (error) => {
        console.log('error index', index);
        return this.recursion(listLesson, index);
      });
    });
}