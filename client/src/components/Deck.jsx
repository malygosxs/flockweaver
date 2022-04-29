import React, { useState } from 'react';
import CardFull from './Card';
import Tippy from '@tippyjs/react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Deck = ({ deck, classw, deckstring }) => {
    const [title, setTitle] = useState('Copy')

    const copy = async () => {
        await navigator.clipboard.writeText(deckstring);
        setTitle('Copied')
    }

    return (
        <div className='p-2'>
            <div className='p-2 card'>
                <div className='d-flex'>
                    <div className='d-flex' style={{ flexGrow: 1 }}>
                        <Tippy content={title} hideOnClick={false} className="text-white">
                            <button className='fa-copy fas' onClick={copy} />
                        </Tippy>
                    </div>
                    <div className='deck-hero' style={{
                        width: '165px',
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