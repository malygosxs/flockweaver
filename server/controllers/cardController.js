const { Card, CardTranslation } = require("../models/models");
const { createCardById } = require('../parser/requestCard');
const { updateCardById } = require("../services/cardService");


class CardController {
    async create(req, res) {
        try {
            const { id } = req.body;
            const cardData = await createCardById(id);
            res.json(cardData);
        }
        catch (e) {
            res.status(500).json({ message: e.message })
        }
    }

    async createBulk(req, res) {
        try {
            const arr = req.body
            for (const card of arr) {
                createCardById(card)
            }
            return res.json('~~~~')
        }
        catch (e) {
            res.status(500).json({ message: e.message })
        }
    }

    async getOne(req, res) {
        const { lng, id } = req.params
        const card = await Card.findOne({ //prettify
            where: {
                idsw: id
            },
            include: {
                model: CardTranslation,
                required: true,
                where: {
                    languageCode: lng
                },
                attributes: ['name'],
            },

        })
        return res.json(card)
    }

    async updateBulkById(req, res) {
        try {
            const arr = req.body
            for (const card of arr) {
                updateCardById(card)
            }
            return res.json('~~~~')
        }
        catch (e) {
            res.status(500).json({ message: e.message })
        }
    }

    async getAll(req, res) {
        return res.json({ message: 'get all!' })
    }
}

module.exports = new CardController();