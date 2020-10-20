import React from 'react';
import styles from './Card.module.css';

const Card = ({
    centered,
    destination,
    children,
    solePageElement
}) => {
    const cardClasses = [styles.card];
    if (['form', 'stats'].includes(destination)) {
        cardClasses.push(styles.formCard);
    } else if (destination === 'menuItem') {
        cardClasses.push(styles.menuCard);
    } else if (destination === 'cartItem') {
        cardClasses.push(styles.cartCard);
    } else if (destination === 'portionsInfo') {
        cardClasses.push(styles.portionsInfo);
    }
    const card = (
        <div className={cardClasses.join(' ')}>
            {children}
        </div>
    );
    return centered ? (
        <div
            className={solePageElement ? `${styles.cardWrapper} ${styles.soleElement}` : styles.cardWrapper}
        >
            {card}
        </div>
    ) : card;
}

export default Card;