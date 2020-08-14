import React from 'react';
import styles from './OrderStats.module.css';
const OrderStats = ({
    avgBurger: {
        avgBacon,
        avgCheese,
        avgMeat,
        avgSalad,
        avgBurgerPrice
    },
    avgOrder: {
        avgBurgersAmount,
        avgOrderPrice
    }
}) => {
    return (
        <div className={styles.orderStats}>
            <h2>Stats</h2>
            <p>Based on displayed orders, your burger on average:</p>
            <p>costs: <span><strong>{avgBurgerPrice !== null && avgBurgerPrice.toFixed(2)}</strong></span></p>
            <p>consists of:</p>
            <ul>
                <li><span><strong>{avgBacon !== null && avgBacon.toFixed(2)}</strong></span>portion of bacon</li>
                <li><span><strong>{avgCheese !== null && avgCheese.toFixed(2)}</strong></span>portion of cheese</li>
                <li><span><strong>{avgMeat !== null && avgMeat.toFixed(2)}</strong></span>portion of meat</li>
                <li><span><strong>{avgSalad !== null && avgSalad.toFixed(2)}</strong></span>portion of salad</li>
            </ul>
            <p>...and your order on average:</p>
            <p>costs: <span><strong>{avgBurgerPrice !== null && avgOrderPrice.toFixed(2)}</strong></span></p>
            <p>consists of: <span><strong>{avgBurgersAmount !== null && avgBurgersAmount.toFixed(2)}</strong></span> burgers</p>
        </div>
    );
}

export default OrderStats;