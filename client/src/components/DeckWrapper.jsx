import React, { useEffect, useState } from 'react';
import { getDeck } from '../http/deckviewAPI';
import Deck from './Deck';

const DeckWrapper = ({deckstring}) => {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [deck, setDeck] = useState();

    useEffect(() => {
        getDeck(deckstring).then(data => {
            setDeck(data)
            setHasLoaded(true)
        }).catch(e => console.log(e))
    }, [])


    return (
        hasLoaded && <Deck deckstring={deckstring} deck={deck.cards} classw={deck.classInfo} />
    );
};

export default DeckWrapper;