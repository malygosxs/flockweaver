import React from 'react';
import Deck from '../components/Deck';

const DeckView = () => {

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