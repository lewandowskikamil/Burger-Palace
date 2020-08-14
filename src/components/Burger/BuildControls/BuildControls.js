import React from 'react';
import styles from './BuildControls.module.css'
import BuildControl from './BuildControl/BuildControl'

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' },
]

const BuildControls = ({ ingredientAdded, ingredientRemoved, disabled, price, purchasable, addedToCart }) => {
    return (
        <div className={styles.buildControls}>
            <p>Current price: <strong>{price.toFixed(2)}</strong></p>
            {controls.map(({ label, type }) => (
                <BuildControl
                    key={label}
                    label={label}
                    type={type}
                    ingredientAdded={ingredientAdded}
                    ingredientRemoved={ingredientRemoved}
                    disabled={disabled[type]}
                />
            ))}
            <button
                className={styles.orderButton}
                disabled={!purchasable}
                onClick={addedToCart}
            >
                Add to cart
            </button>
        </div>
    );
}

export default BuildControls;