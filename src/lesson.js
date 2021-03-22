const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
const { resolve } = require('path');
const data = {
  sentences: []
};
exports.getLessonByTopic = async (topicName, topicUrl) => {
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
            topic: topicName,
            sentence: `${item.nextSibling.textContent}${item.nextSibling.nextSibling.innerText} ${item.nextSibling.nextSibling.nextSibling.textContent}`,
            nameAudio: item.querySelector(".myButton_play").getAttribute('onclick').split(';')[0].split(',')[1].replace(/'/g, '').replace('.','_'),
            urlAudio: item.querySelector(".myButton_play").getAttribute('onclick').split(';')[0].split(',')[2].replace(/\'/g, ''),
          }
      })
    }, topicName);
    await browser.close();
    console.log(JSON.stringify(lessons));
    return lessons;
}

exports.recursion = async (listLesson, index) => {
    if(!listLesson[index]) {
        return data;
    }
    console.log(index);
    const lessons  = await this.getLessonByTopic(listLesson[index].topic, listLesson[index].urlTopic);
    fs.writeFileSync(`sentences/${listLesson[index].topic.toLowerCase().replace(' ', '_')}.json`, JSON.stringify(lessons));
    // data.sentences.push(lessons);
    index = index + 1;
    return this.recursion(listLesson, index)
    // const sentences = listLesson[index].sentences;
    // const folderName = listLesson[index].topic.replace(' ', '_');
    // if(!fs.existsSync(`media/${folderName}`)){
    //   fs.mkdirSync(`media/${folderName}`);
    // }
    // await Promise.all(sentences.map(element => {
    //   request.head(element.urlAudio, (err, res, body) => {
    //     request(element.urlAudio).pipe(fs.createWriteStream(`media/${folderName}/${element.nameAudio}.mp3`)).on('finish', (item) => {
    //     });
    //   });
    // })).then(result => {
    //     index = index + 1;
    //     return setTimeout(() => {this.recursion(listLesson, index)}, 120000);
    // });
}