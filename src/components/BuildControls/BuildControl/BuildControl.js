import React from 'react';
import styles from './BuildControl.module.css';
import AmountPanel from '../../UI/AmountPanel/AmountPanel';

const BuildControl = ({
    label,
    addIngredient,
    removeIngredient,
    type,
    price,
    amount
}) => {
    return (
        <div className={styles.buildControl}>
            <span className={styles.label}>
                {label}
            </span>
            <AmountPanel
                increaseAmount={() => addIngredient(type, price)}
                decreaseAmount={() => removeIngredient(type, price)}
                amount={amount}
            />
        </div>
    );
}

export default BuildControl;