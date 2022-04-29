import React, { useContext, useEffect } from 'react';
import Deck from '../components/Deck';
import { getCards } from '../http/deckviewAPI';
import { useParams } from 'react-router-dom';
import { Context } from '../index'
import { observer } from 'mobx-react-lite'

const DeckView = observer(() => {

    const { uuid } = useParams()
    const { decks } = useContext(Context)

    useEffect(() => {
        getCards(uuid).then(data => {
            decks.setDecks(data)
            const title = decks.decks.map(x => x.classInfo.name).join('/')
            document.title = title;
        })
    }, [])
    

    return (
        <div className='d-flex flex-wrap justify-content-start p-4'>
            {decks.decks.map(deck =>
                <Deck
                    key={deck.classInfo.code}
                    deck={deck.cards}
                    classw={deck.classInfo}
                    deckstring={deck.deckstring}
                />
            )}
        </div>
    );
})

export default DeckView;