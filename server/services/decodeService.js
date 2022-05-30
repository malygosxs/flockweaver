const bs58 = require('bs58')
const { Op } = require('sequelize')
const { Card, CardTranslation, Prism, ClassInfo, LineUp } = require('../models/models')
const { isBigEndian, SW_PREFIX_LEN, CLASS_LEN, VERSION_LEN, VERSION, SW_PREFIX } = require('../utils/consts')

class DecodeService {
    decodeDeckstring = async (deckstring) => {

        const language = 'en'
        const isFullDecks = true;

        if (deckstring.length < SW_PREFIX_LEN + CLASS_LEN + VERSION_LEN) {
            throw new Error('Invalid deckstring length')
        }


        const classInfo = await parseClass(deckstring)
        if (classInfo === null) {
            throw new Error('Invalid code, could not parse class')
        }

        const version = await parseVersion(deckstring)
        if (version === null) {
            throw new Error('Invalid code, could not parse version')
        }

        const [numbers, cards] = await parseNumbers(deckstring, language, classInfo)

        const deckSize = classInfo.prism1 === classInfo.prism2 ? 25 : 30

        if (cards === null) {
            throw new Error('Invalid deckstring')
        }

        if (cards.length !== numbers.length) {
            throw new Error('Deckstring is not valid') //error handler
        }

        if (cards.length !== deckSize && isFullDecks) {
            throw new Error('Deckstring contains not a full deck')
        }



        return { cards, classInfo, deckstring }
    }

    validateDeck = async (deckstring) => {
        const language = 'en'
        const isFullDecks = true;

        if (deckstring.length < SW_PREFIX_LEN + CLASS_LEN + VERSION_LEN) {
            return 'Invalid deckstring length'
        }


        const classInfo = await parseClass(deckstring)
        if (classInfo === null) {
            return 'Invalid code, could not parse class'
        }

        const version = await parseVersion(deckstring)
        if (version === null) {
            return 'Invalid code, could not parse version'
        }

        const [numbers, cards] = await parseNumbers(deckstring, language, classInfo)

        const deckSize = classInfo.prism1 === classInfo.prism2 ? 25 : 30

        if (cards === null) {
            return 'Invalid deckstring'
        }

        if (cards.length !== numbers.length) {
            return 'Deckstring is not valid' //error handler
        }

        if (cards.length !== deckSize && isFullDecks) {
            return 'Deckstring contains not a full deck'
        }

        return classInfo
    }

}



async function parseNumbers(deckstring, lng, classInfo) {
    try {
        const base58EncodedValues = deckstring.substr(
            SW_PREFIX_LEN + CLASS_LEN + VERSION_LEN
        )

        const bytes = bs58.decode(base58EncodedValues)
        if (isBigEndian) {
            bytes.swap16()
        }
        const numbers = new Uint16Array(
            bytes.buffer,
            bytes.byteOffset,
            bytes.length / 2
        )
        const cards = await Card.findAll({
            where: {
                idsw: {
                    [Op.in]: numbers
                }
            },
            attributes: ['idsw', 'cost'],
            order: [['cost', 'ASC'], [CardTranslation, 'name', 'ASC']],
            include: [
                {
                    model: CardTranslation,
                    required: true,
                    where: {
                        languageCode: lng
                    },
                    attributes: ['name'],
                },
                {
                    model: Prism,
                    attributes: [],
                    where: {
                        [Op.or]: [{ name: classInfo.prism1 }, { name: classInfo.prism2 }],
                    }
                }
            ]


        })
        return [numbers, cards]
    }
    catch (e) {
        return null
    }
}

async function parseClass(deckString) {
    const clazz = deckString.substr(SW_PREFIX_LEN, CLASS_LEN)
    const info = await ClassInfo.findOne({
        where: {
            code: clazz
        }
    })
    return info
}

function parseVersion(deckString) {
    const prefix = deckString.substr(0, SW_PREFIX_LEN)
    if (prefix !== SW_PREFIX) return null
    const version = deckString.substr(SW_PREFIX_LEN + CLASS_LEN, VERSION_LEN)
    return version === VERSION ? version : null
}


module.exports = new DecodeService()