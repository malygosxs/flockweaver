import React from 'react';
import CardFull from './Card';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Deck = ({ deck, classw }) => {
    return (
        <div className='p-2'>
            <div className='p-2 card'>
                <div className='d-flex'>
                    <div className='d-flex' style={{flexGrow: 1}}><button className='fa-copy fas'></button></div>
                    <div className='deck-hero' style={{width: '165px',
                        background: `linear-gradient(90deg, var(--color-${classw.prism1.toLowerCase()}) 0%, var(--color-${classw.prism2.toLowerCase()}) 100%)`
                    }}>
                        {classw.name}
                    </div>
                </div>
                <div style={{ width: 200 }} className='card'>
                    {deck.map(card =>
                        <CardFull card={card} key={card.idsw} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Deck;