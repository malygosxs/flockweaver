import React from 'react';
import CardFull from './Card';

const Deck = () => {
    return (
        <div className='p-2'>
            <div style={{ width: 230 }} className='card'>
                <CardFull></CardFull>
                <CardFull></CardFull>
                <CardFull></CardFull>
                <CardFull></CardFull>
                <CardFull></CardFull>
                <CardFull></CardFull>
                <CardFull></CardFull>
            </div>
        </div>
    );
};

export default Deck;