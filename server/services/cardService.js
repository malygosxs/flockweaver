const axios = require('axios')
const { Card } = require('../models/models')
const SILVERADD = 65536

async function updateCardById(id) {
    try {
        const url = `https://assets.skyweaver.net/latest/metadata/${+id + SILVERADD}.json`
        const res = await axios.get(url)
        const cardData = res.data
        const [description, flavorText] = cardData.description.split('\n\n')
        const indexSubstr = cardData.name.indexOf('(Silver)')
        let name = cardData.name.trim()
        if (indexSubstr !== -1) {
            name = cardData.name.substr(0, cardData.name.indexOf('(Silver)')).trim()
        }

        const mana = cardData.properties.mana === 'X' ? '100' : cardData.properties.mana


        Card.update({
            cost: mana
        },
            {
                returning: true,
                where: { idsw: id }
            }
        )
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = { updateCardById }