import React, { useEffect, useState } from 'react';
import DeckWrapper from '../components/DeckWrapper';
import { $host } from '../http';

const Home = () => {
    const [date, setDate] = useState('')
    const [decks, setDecks] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    useEffect(() => {
        $host.get('/api/decode/currentdecks').then(res => {
            setDate(res.data.updatedDate)
            setDecks(res.data.decks)
            setHasLoaded(true)
        })
    }, [])

    return (hasLoaded && <div>
        <div className='d-flex mt-2 px-4 justify-content-end'>{`Updated at ${date}`}</div>
        <div className='d-flex flex-wrap justify-content-around m-4'>
            
            {decks.map(deck =>
                <DeckWrapper key={deck.id} deckstring={deck.code} />
            )}
        </div>
    </div>

    );
};

export default Home;