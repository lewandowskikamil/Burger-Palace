import React from 'react';
import styles from './Order.module.css'
const Order = ({ ingredients, price }) => {
    const renderedIngredients = Object.keys(ingredients)
        .map(igKey => (
            ingredients[igKey] ? (
                <span key={igKey}
                    style={{
                        textTransform: 'capitalize',
                        display: 'inline-block',
                        margin: '0 8px',
                        border: '1px solid #ccc',
                        padding: '5px'
                    }}
                >
                    {igKey} ({ingredients[igKey]})
                </span>
            ) : null
        ))
    return (
        <div className={styles.order}>
            {renderedIngredients}
            <p>Price: <strong>{price.toFixed(2)}</strong></p>
        </div>
    );
}

export default Order;