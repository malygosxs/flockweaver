const { Card, CardTranslation } = require("../models/models");
const { createCardById } = require('../parser/requestCard');


class CardController {
    async create(req, res) {
        const { id } = req.body;
        const cardData = await createCardById(id);
        res.json(cardData);

    }

    async createBulk(req, res) {
        const arr = req.body
        for (const card of arr) {
            createCardById(card)
        }
        return res.json('done!')
    }

    async getOne(req, res) {
        const { lng, id } = req.params
        const card = await Card.findOne({ //prettify
            where: {
                idsw: id
            },
            include: {
                all: true,
            }

        })
        return res.json(card)
    }

    async getAll(req, res) {
        return res.json({ message: 'get all!' })
    }
}

module.exports = new CardController();