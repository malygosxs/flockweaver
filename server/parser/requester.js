const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-stealth')());

const url = 'https://play.skyweaver.net/market/cards/buy'

async function getArrId() {
    browser = await puppeteer.launch({
        headless: true,
    })
    page = await browser.newPage();


    await page.goto(url,
        { waitUntil: "networkidle2" });

    page.on('console', async msg => {
        const args = msg.args();
        const vals = [];
        for (let i = 0; i < args.length; i++) {
            vals.push(await args[i].jsonValue());
        }
        console.log(vals.join('\t'));
    });

    await page.evaluate(() => {

        const wait = (duration) => {
            console.log('waiting', duration);
            return new Promise(resolve => setTimeout(resolve, duration));
        };

        (async () => {

            window.atBottom = false;
            const scroller = document.documentElement;  // usually what you want to scroll, but not always
            let lastPosition = -1;
            while (!window.atBottom) {
                scroller.scrollTop += 1000;
                // scrolling down all at once has pitfalls on some sites: scroller.scrollTop = scroller.scrollHeight;
                await wait(300);
                const currentPosition = scroller.scrollTop;
                if (currentPosition > lastPosition) {
                    console.log('currentPosition', currentPosition);
                    lastPosition = currentPosition;
                }
                else {
                    window.atBottom = true;
                }
            }
            console.log('Done!');

        })();

    });

    await page.waitForFunction('window.atBottom == true', {
        timeout: 900000,
        polling: 1000 // poll for finish every second
    });
    const content = await page.content();
    browser.close()


    const $ = cheerio.load(content);
    const cardItem = $('.Tilt');
    const arrId = [];


    cardItem.each((index, el) => {
        const imgUrl = $(el).children().attr('data-card-id');
        arrId.push(imgUrl);
    })
    fs.writeFile('./parser/array.json', JSON.stringify(arrId), 'utf-8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

    return arrId;
}

getArrId();