const bs58 = require('bs58')
const { Op } = require('sequelize')
const short = require('short-uuid')
const { Card, CardTranslation, Prism, ClassCode, LineUp } = require('../models/models')
const { isBigEndian, SW_PREFIX_LEN, CLASS_LEN, VERSION_LEN, VERSION, SW_PREFIX } = require('../utils/consts')

class DecodeController {
    decodeDeckstring = async (deckstring) => {

        const language = 'en'
        const isFullDecks = true;

        if (deckstring.length < SW_PREFIX_LEN + CLASS_LEN + VERSION_LEN) {
            throw new Error('Invalid deckstring length')
        }


        const classCode = await parseClass(deckstring)
        if (classCode === null) {
            throw new Error('Invalid code, could not parse class')
        }

        const version = await parseVersion(deckstring)
        if (version === null) {
            throw new Error('Invalid code, could not parse version')
        }

        const [numbers, cards] = await parseNumbers(deckstring, language, classCode)

        const deckSize = classCode.prism1 === classCode.prism2 ? 25 : 30

        if (cards === null) {
            throw new Error('Invalid deckstring')
        }

        if (cards.length !== numbers.length) {
            throw new Error('Deckstring is not valid') //error handler
        }

        if (cards.length !== deckSize && isFullDecks) {
            throw new Error('Deckstring contains not a full deck')
        }



        return { cards, classCode }
    }

    validateDeck = async (deckstring) => {
        const language = 'en'
        const isFullDecks = true;

        if (deckstring.length < SW_PREFIX_LEN + CLASS_LEN + VERSION_LEN) {
            return 'Invalid deckstring length'
        }


        const classCode = await parseClass(deckstring)
        if (classCode === null) {
            return 'Invalid code, could not parse class'
        }

        const version = await parseVersion(deckstring)
        if (version === null) {
            return 'Invalid code, could not parse version'
        }

        const [numbers, cards] = await parseNumbers(deckstring, language, classCode)

        const deckSize = classCode.prism1 === classCode.prism2 ? 25 : 30

        if (cards === null) {
            return 'Invalid deckstring'
        }

        if (cards.length !== numbers.length) {
            return 'Deckstring is not valid' //error handler
        }

        if (cards.length !== deckSize && isFullDecks) {
            return 'Deckstring contains not a full deck'
        }

        return classCode
    }

    //TODO: checkpoint, allow duplicate
    validateDecks = async (req, res) => {
        const { codes } = req.query
        if (codes === undefined) {
            return res.status(400).json('Codes are required!')
        }
        if (codes.length > 5) {
            return res.status(404).json('Expected less decks!')
        }
        await Promise.all(codes.map((el) => this.validateDeck(el)))
            .then(resp => {
                if (resp.every(x => x instanceof Object)) {



                    const classCode = resp.map(obj => obj.code);
                    resp.fill('')
                    console.log(classCode);
                    const duplicateIndex = firstDuplicateIndex(classCode)

                    if (duplicateIndex !== -1) {
                        resp[duplicateIndex] = 'Duplicate class'
                    }
                }
                else {
                    //if it contains classCode, error = ''
                    resp = resp.map(el => {
                        if (el instanceof Object) {
                            return ''
                        }
                        return el;
                    })
                }

                console.log(resp);
                return res.json(resp)
            })
    }

    async createNewUrl(req, res) {
        const codes = req.body;
        const concatString = codes.join('.')
        const uuid = short.generate()
        await LineUp.create({
            uuid,
            private: false,
            concatString
        })
        return res.json(uuid)
    }

    decodeDecks = async (req, res) => {
        const { url } = req.query
        const lineup = await LineUp.findOne({ where: { uuid: url } })
        if (!lineup) {
            return res.status(404).json('No decks for this URL')
        }
        const { concatString } = lineup
        const codes = concatString.split('.');
        try {
            await Promise.all(codes.map((el) => this.decodeDeckstring(el)))
                .then(resp => res.json(resp))
        }
        catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

function firstDuplicateIndex(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr.indexOf(arr[i]) !== i) {
            return i;
        }
    }
    return -1;
}

async function parseNumbers(deckstring, lng, classCode) {
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
                        [Op.or]: [{ name: classCode.prism1 }, { name: classCode.prism2 }],
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
    //try {
        const clazz = deckString.substr(SW_PREFIX_LEN, CLASS_LEN)
        const classCode = await ClassCode.findOne({
            where: {
                code: clazz
            }
        })
        return classCode
    //}
    //catch (e) {
    //    return null
    //}
}

function parseVersion(deckString) {
    const prefix = deckString.substr(0, SW_PREFIX_LEN)
    if (prefix !== SW_PREFIX) return null
    const version = deckString.substr(SW_PREFIX_LEN + CLASS_LEN, VERSION_LEN)
    return version === VERSION ? version : null
}



module.exports = new DecodeController()