const {validateDeck} = require("../controllers/decodeController");
// const {Sequelize} = require('sequelize');

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         dialect: 'postgres',
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//         logging: false
//     }
// )

// sequelize.authenticate();

test('Invalid class code', async () => {
    const deck = 'SWxAGO02jXwCFgLo3MKVjuiWfwERTXpGZuPg8zDvevft9HbBzoG6iVkhCQfSQFVVX7uhFAmF2mfG4WGZNM8N32tCZu'
    const res = await validateDeck(deck)
    expect(res).toBe('Invalid code, could not parse class')
})

test('Invalid version code', async () => {
    const deck = 'SWxAGW01jXwCFgLo3MKVjuiWfwERTXpGZuPg8zDvevft9HbBzoG6iVkhCQfSQFVVX7uhFAmF2mfG4WGZNM8N32tCZu'
    const res = await validateDeck(deck)
    expect(res).toBe('Invalid code, could not parse version')
})

test('Invalid length, fast return', async () => {
    const deck = 'SWxAGW'
    const res = await validateDeck(deck)
    expect(res).toBe('Invalid deckstring length')
})