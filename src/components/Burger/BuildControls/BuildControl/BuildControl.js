import React from 'react';
import styles from './BuildControl.module.css';

const BuildControl = ({
    label,
    addIngredient,
    removeIngredient,
    type,
    disabled,
    price
}) => {
    return (
        <div className={styles.buildControl}>
            <span className={styles.label}>
                {label}
            </span>
            <button
                className={styles.less}
                onClick={() => removeIngredient(type, price)}
                disabled={disabled}
            >
                Less
            </button>
            <button
                className={styles.less}
                onClick={() => addIngredient(type, price)}
            >
                More
            </button>
        </div>
    );
}

export default BuildControl;