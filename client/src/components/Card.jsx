import React, { useEffect, useState } from 'react';

const CardFull = ({ card }) => {
    const [rowPath, setRowPath] = useState()
    const [mouseOver, setMouseOver] = useState('none')
    const domainPath = process.env.REACT_APP_API_URL


    useEffect(() => {
        const lastDigit = card.idsw % 10
        const rowPathL = `${domainPath}/asset/myRowArt/${lastDigit}/${card.idsw}.png`
        setRowPath(rowPathL)
    }, [card, domainPath])



    return (
        <div onMouseOver={() => setMouseOver('block')} onMouseOut={() => setMouseOver('none')}>
            <div style={{ "--color-border": 'var(--color-darker-grey)', "--color-gradient": 'var(--color-dark-basic)' }} className="decklist-card-container decklist-card is-flex is-align-items-center">
                <span className="deck-text decklist-card-background" style={{ paddingLeft: '0.5ch' }} />
                <span className="card-number deck-text decklist-card-background is-unselectable has-text-left" style={{ width: '3ch' }}>
                    {card.cost === 100 ? 'X' : card.cost}
                </span>
                <div className="card-name deck-text decklist-card-gradient has-text-left is-clipped">
                    {card.card_translations[0].name}
                </div>
                <div
                    style={{ backgroundImage: `url("${rowPath}")` }}
                    className="decklist-card-tile">
                </div>
                <div className="decklist-card-image"
                    style={{ backgroundImage: `url('https://assets.skyweaver.net/latest/full-cards/2x/${card.idsw}-silver.png')`, display: mouseOver}}   
                    >
                </div>
            </div>
        </div>
    );
};

export default CardFull;