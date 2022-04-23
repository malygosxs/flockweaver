const axios = require('axios')
const fs = require('fs')
const sharp = require('sharp')
const path = require('path')
const SILVERADD = 65536;
const { Card, Element, CardElement, Keyword, CardKeyword, Prism, CardPrism, CardTranslation } = require('../models/models')

async function createCardById(id) {
    try {
        const url = `https://assets.skyweaver.net/latest/metadata/${+id + SILVERADD}.json`
        const res = await axios.get(url)
        const cardData = res.data
        const [description, flavorText] = cardData.description.split('\n\n')

        const [name] = cardData.name.split(' ')
        const mana = cardData.properties.mana === 'X' ? '100' : cardData.properties.mana

        const hexCode = await createRowArt(id);

        const newCard = {
            idsw: id,
            type: cardData.properties.cardType,
            cost: mana,
            health: cardData.properties.health,
            attack: cardData.properties.power,
            isCollectible: true,
            art_by: cardData.properties.artist,
            hex_code: hexCode
        }

        const propertiesObj = cardData.properties;

        const card = await Card.create(newCard)
        const createdCardId = card.getDataValue('id')



        await CardTranslation.create({
            cardId: createdCardId,
            languageCode: 'en',
            name: name,
            flavor_text: flavorText,
            description: description
        });

        await createCardProps(propertiesObj, createdCardId)

        



        //return cardData;
    }
    catch (e) {
        console.log(e, id);
    }
}

async function createRowArt(id) {
    const lastDigit = id % 10;
    const buffer2x = await getBufferById(id, '2x')
    const buffer4x = await getBufferById(id, '4x')

    const [r, g, b] = await sharp(buffer4x)
        .extract({ left: 74, top: 94 + 25, width: 1, height: 1 })
        .raw()
        .toBuffer()
    const hexCode = getHexCodeFiller(r,g,b);

    sharp(buffer4x)
        .extract({ left: 74, top: 94, width: 218, height: 50 })
        .toFile(`./static/myRowArt/${lastDigit}/${id}.png`)
        .catch(e => console.log(e))

    sharp(buffer2x).toFile(`./static/en/2x/${lastDigit}/${id}.png`)
        .catch(e => console.log(e))

    sharp(buffer4x).toFile(`./static/en/4x/${lastDigit}/${id}.png`)
        .catch(e => console.log(e))

    return hexCode;

}

async function getBufferById(id, simplify = '2x') {
    const baseUrl = `https://assets.skyweaver.net/latest/full-cards/${simplify}/${id}-silver.png`


    async function getBuffer(url) {
        const response = await axios(url, { responseType: 'arraybuffer' })
        const buffer64 = Buffer.from(response.data, 'binary')
        return buffer64
    }

    return getBuffer(baseUrl)

}

function getHexCodeFiller(...colors) {
    return '#' + colors.map(x => x.toString(16)).join('')
} 

async function createCardProps(propertiesObj, createdCardId) {
    await createCardKeyword(propertiesObj, createdCardId)
    await createCardPrism(propertiesObj, createdCardId)
    await createCardElement(propertiesObj, createdCardId)
}


async function createCardKeyword(propsObj, createdCardId) {
    for (const prop in propsObj) {
        if (!prop.startsWith('trait:')) {
            continue
        }
        const traitName = propsObj[prop].value
        try {
            const { id } = await Keyword.findOne({ where: { name: traitName } })
            await CardKeyword.create({ cardId: createdCardId, keywordId: id })
        }
        catch (e) {
            console.log(e)
        }
    }
}

async function createCardPrism(propsObj, createdCardId) {
    try {
        const newCardPrism = propsObj['prism'];
        const prism = await Prism.findOne({ where: { name: newCardPrism } })
        await CardPrism.create({ cardId: createdCardId, prismId: prism.id })
    }
    catch (e) {
        console.log(error.response.data.message);
    }
}

async function createCardElement(propsObj, createdCardId) {
    const newCardElement = propsObj['element'];
    const element = await Element.findOne({ where: { name: newCardElement } })
    await CardElement.create({ cardId: createdCardId, elementId: element.id })
}


module.exports = { createCardById }

