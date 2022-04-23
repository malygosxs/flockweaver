const sequelize = require('../db');
const {DataTypes} = require('sequelize')

const Card = sequelize.define('card', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    idsw: {type: DataTypes.INTEGER, unique: true},
    cost: {type: DataTypes.INTEGER},
    attack: {type: DataTypes.INTEGER},
    health: {type: DataTypes.INTEGER},
    art_by: {type: DataTypes.STRING},
    image: {type: DataTypes.STRING},
    isCollectable: {type: DataTypes.BOOLEAN},
    type: {type: DataTypes.STRING},
    supply: {type: DataTypes.INTEGER},
    weekNumberGold: {type: DataTypes.INTEGER},
    hex_code: {type: DataTypes.STRING(7)},
})

const CardTranslation = sequelize.define('card_translation', {
    cardId: {type: DataTypes.INTEGER, primaryKey: true},
    languageCode: {type: DataTypes.STRING, primaryKey: true},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    flavor_text: {type: DataTypes.STRING}
}, {timestamps: false})

const Enchant = sequelize.define('enchant', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    cost: {type: DataTypes.INTEGER},

    image: {type: DataTypes.STRING}
}, {timestamps: false})

const Expansion = sequelize.define('expansion', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    number: {type: DataTypes.INTEGER},
    date: {type: DataTypes.DATEONLY}
})

const Element = sequelize.define('element', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
}, {timestamps: false})

const Prism = sequelize.define('prism', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
}, {timestamps: false})

const Keyword = sequelize.define('keyword', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
}, {timestamps: false})

const CardElement = sequelize.define('card_elements', {
    
}, {timestamps: false})

const CardPrism = sequelize.define('card_prisms', {

}, {timestamps: false})

const CardKeyword = sequelize.define('card_keywords', {

}, {timestamps: false})

const ClassCode = sequelize.define('class_code', {
    name: {type: DataTypes.STRING},
    code: {type: DataTypes.STRING, primaryKey: true},
    prism1: {type: DataTypes.STRING},
    prism2: {type: DataTypes.STRING}
}, {timestamps: false})

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
    sw_tag: {type: DataTypes.STRING}
})

const LineUp = sequelize.define('lineup', {
    uuid: {type: DataTypes.STRING, primaryKey: true},
    private: {type: DataTypes.BOOLEAN},
    concatString: {type: DataTypes.STRING(500)}
})

User.hasMany(LineUp);
LineUp.belongsTo(User);

Card.belongsToMany(Element, {through: CardElement});
Element.belongsToMany(Card, {through: CardElement});

Card.belongsToMany(Prism, {through: CardPrism});
Prism.belongsToMany(Card, {through: CardPrism});

Card.belongsToMany(Keyword, {through: CardKeyword});
Keyword.belongsToMany(Card, {through: CardKeyword});

Enchant.hasMany(Card);
Card.belongsTo(Enchant);

Expansion.hasMany(Card);
Card.belongsTo(Expansion);

Card.hasMany(CardTranslation);
CardTranslation.belongsTo(Card);



module.exports = {
    Card, Enchant, Expansion, Element, Prism,
    Keyword, CardElement, CardKeyword, CardPrism, CardTranslation,
    ClassCode, User, LineUp
}