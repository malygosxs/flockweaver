require('dotenv').config()
const fs = require('fs');
const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-stealth')());
const sequelize = require('../db');
const { Card, Element, CardElement, Keyword, CardKeyword, Prism, CardPrism, CardTranslation } = require('../models/models');
const download = require('image-downloader');
const url = 'https://play.skyweaver.net/market/cards/buy'



const start = async () => {
    browser = await puppeteer.launch({
        headless: true,
    })
    page = await browser.newPage();
    //const arrId = await getArrId(page);
    const arrId = JSON.parse(fs.readFileSync('./parser/array.json', 'utf8'));

    //saveStaticImages(arrId);

    const keywordObj = await Keyword.findAll({
        attributes: ['name'],
        raw: true
    })
    const keywordArr = keywordObj.map(k => k.name)
    //console.log(keywordArr);


    for (const [i, cardId] of arrId.entries()) {
        //if (i < 50) continue;
        const cardUrl = `https://play.skyweaver.net/items/cards/${cardId}/silver`;

        await Promise.all([
            page.goto(cardUrl, { waitUntil: "networkidle0" }),
            page.waitForNavigation()
        ])
        const content = await page.content();
        const $ = cheerio.load(content);


        const supply = $('#app > div:nth-child(2) > div > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(5)').text().trim();
        const textArrDiv = $('.detailsStatsRow').parent().parent().children();
        const textArr = [];
        textArrDiv.each((i, el) => {
            textArr.push($(el).text())
        })
        const cleanArr = textArr.filter(x => x !== 'RELATED CARDS');
        const flavor_text = cleanArr[cleanArr.length - 1];
        console.log(flavor_text);

        const detailRow = $('.detailsStatsRow');
        const detail = {};
        detail['idsw'] = cardId;
        detailRow.each((index, el) => {
            const nameDetailDup = $(el).find('div:nth-child(1)').text().toLowerCase().trim().replace(' ', '_');
            const nameDetail = nameDetailDup.substring(0, nameDetailDup.length / 2) //why it's like namename
            const descriptionDetail = $(el).find('div:nth-child(2)').text().trim();
            detail[nameDetail] = descriptionDetail;
        })
        detail['supply'] = supply;
        //detail['flavor_text'] = flavor_text;
        const name_en = detail['name'];

        delete detail['name'];
        
        detail['isCollectable'] = true;
        if (detail.cost === 'Variable') {
            detail.cost = 100;
        }
        console.log(name_en, i);

        const card = await Card.create(detail);
        const newCardId = card.getDataValue('id');

        const keywordArrOnCard = [];

        for (const divstring of cleanArr) {
            for (const keyword of keywordArr) {
                if (divstring.startsWith(keyword.toUpperCase() + ':')) {
                    keywordArrOnCard.push(keyword)
                }
            }
        }
        console.log(keywordArrOnCard);

        await CardTranslation.create({cardId: newCardId, languageCode: 'en', name: name_en, flavor_text: flavor_text});

        for (const keyword of keywordArrOnCard) {
            const { id } = await Keyword.findOne({ where: { name: keyword } })
            await CardKeyword.create({ cardId: newCardId, keywordId: id });
        }

        const newCardPrism = detail['prism'];
        const prism = await Prism.findOne({ where: { name: newCardPrism} })
        await CardPrism.create({ cardId: newCardId, prismId: prism.id })

        const newCardElement = detail['element'];
        const element = await Element.findOne({ where: { name: newCardElement } })
        await CardElement.create({ cardId: newCardId, elementId: element.id })
    }

    await browser.close();
}

start();




async function getArrId(page) {
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

function saveStaticImages(arrId) {
    const baseUrl = 'https://assets.skyweaver.net/latest/full-cards/2x/'
    for (const cardId of arrId) {
        console.log(`${baseUrl}${cardId}-silver.png`);
        downloadImage(
            `${baseUrl}${cardId}-silver.png`,
            path.resolve(__dirname, 'static', '2x', cardId[cardId.length - 1], `${cardId}.png`)
        )

    }
}



function downloadImage(url, filepath) {
    return download.image({
        url,
        dest: filepath
    });
}