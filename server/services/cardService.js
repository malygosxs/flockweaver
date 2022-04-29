const axios = require('axios')

async function updateCardById(id) {
    try {
        const url = `https://assets.skyweaver.net/latest/metadata/${+id + SILVERADD}.json`
        const res = await axios.get(url)
        const cardData = res.data
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = { updateCardById }