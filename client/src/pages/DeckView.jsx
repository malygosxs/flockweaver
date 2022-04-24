import React, {useEffect} from 'react';
import Deck from '../components/Deck';
import { getCards } from '../http/deckviewAPI';
import { useParams } from 'react-router-dom';

const DeckView = () => {

    const {uuid} = useParams()

    useEffect(() => {
        const cards = getCards(uuid)
        console.log(cards);
    }, [])

    return (
        <div className='d-flex flex-wrap justify-content-start p-4'>
            <Deck />
            <Deck />
            <Deck />
            <Deck />
        </div>
    );
}

export default DeckView;