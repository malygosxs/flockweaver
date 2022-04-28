import React, { useEffect, useState } from 'react';
import './card.css'

const CardFull = ({ card }) => {
    const [rowPath, setRowPath] = useState()
    const domainPath = process.env.REACT_APP_API_URL


    useEffect(() => {
        const lastDigit = card.idsw % 10
        const rowPathL = `${domainPath}/static/myRowArt/${lastDigit}/${card.idsw}.png`
        setRowPath(rowPathL)
    }, [card, domainPath])



    return (
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
            {/* <div id="dbb6adf8-446d-4006-a317-19fb69ef2b0c" className="decklist-card-image" style={{ backgroundImage: 'url("https://art.hearthstonejson.com/v1/render/latest/enUS/256x/CORE_EX1_410.png")', display: 'none' }}>
            </div> */}
        </div>
    );
};

export default CardFull;