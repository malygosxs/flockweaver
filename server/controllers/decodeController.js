const bs58 = require('bs58')
const sequelize = require('sequelize')
const short = require('short-uuid')
const DecodeService = require('../services/decodeService')
const { Card, CardTranslation, Prism, ClassInfo, LineUp, Deck } = require('../models/models')
const { isBigEndian, SW_PREFIX_LEN, CLASS_LEN, VERSION_LEN, VERSION, SW_PREFIX } = require('../utils/consts')

class DecodeController {

    decodeDeckstring = async (req, res) => {
        try {
            const { deckstring } = req.query
            const data = await DecodeService.decodeDeckstring(deckstring)
            return res.json(data);
        }
        catch (e) {
            return res.status(500).json('Something went wrong!')
        }
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
            await Promise.all(codes.map((el) => DecodeService.validateDeck(el)))
                .then(resp => {
                    if (resp.every(x => x instanceof Object)) {



                        const classInfo = resp.map(obj => obj.code);
                        resp.fill('')
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
            await Promise.all(codes.map((el) => DecodeService.decodeDeckstring(el)))
                .then(resp => res.json(resp))
        }
        catch (e) {
            res.status(422).json({ message: e.message })
        }
    }

    getCurrentDecks = async (req, res) => {
        const data = await Deck.findAll({attributes: ['id', 'code']});
        const updatedDate = await Deck.max('date')
        return res.json({decks: data, updatedDate})
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




module.exports = new DecodeController()