import {makeAutoObservable} from 'mobx'

export default class CardStore {

    constructor() {
        this._decks = []
        makeAutoObservable(this)
    }

    setDecks(decks) {
        this._decks = decks
    }

    get decks() {
        return this._decks
    }
}