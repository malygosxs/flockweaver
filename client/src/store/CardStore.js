import {makeAutoObservable} from 'mobx'

export default class CardStore {

    constructor() {
        this._cards = [{idsw: 33, name: 'Agfnfj', cost: 1},{idsw: 33, name: '1212', cost: 2},{idsw: 33, name: 'wqwq', cost: 5}]
        makeAutoObservable(this)
    }

    setCards(bool) {
        this._cards = bool
    }

    get cards() {
        return this._cards
    }
}