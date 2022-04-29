const bs58 = require('bs58')
const { Op } = require('sequelize')
const short = require('short-uuid')
const { Card, CardTranslation, Prism, ClassInfo, LineUp } = require('../models/models')
const { isBigEndian, SW_PREFIX_LEN, CLASS_LEN, VERSION_LEN, VERSION, SW_PREFIX } = require('../utils/consts')

class DecodeController {
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

    //TODO: checkpoint, allow duplicate
    validateDecks = async (req, res) => {
        try {
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



                        const classInfo = resp.map(obj => obj.code);
                        resp.fill('')
                        console.log(classInfo);
                        const duplicateIndex = firstDuplicateIndex(classInfo)

                        if (duplicateIndex !== -1) {
                            resp[duplicateIndex] = 'Duplicate class'
                        }
                    }
                    else {
                        //if it contains classInfo, error = ''
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
        catch (e) {
            res.status(500).json({message: e.message})
        }
    }

    async createNewUrl(req, res) {
        const codes = req.body;
        const concatString = codes.join('.')
        const uuid = short.generate()
        try {
            await LineUp.create({
                uuid,
                private: false,
                concatString
            })
            return res.json(uuid)
        }
        catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    decodeDecks = async (req, res) => {
        const { url } = req.query
        let lineup;
        try {
            lineup = await LineUp.findOne({ where: { uuid: url } })
        }
        catch (e) {
            res.status(502).json({ message: e.message })
        }
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
            res.status(422).json({ message: e.message })
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
    //try {
    const clazz = deckString.substr(SW_PREFIX_LEN, CLASS_LEN)
    const info = await ClassInfo.findOne({
        where: {
            code: clazz
        }
    })
    return info
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