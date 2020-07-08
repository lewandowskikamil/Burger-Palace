import React from 'react';
import styles from './BuildControl.module.css';

const BuildControl = ({ label, ingredientAdded, ingredientRemoved, type, disabled }) => {
    return (
        <div className={styles.buildControl}>
            <span className={styles.label}>
                {label}
            </span>
            <button
                className={styles.less}
                onClick={() => ingredientRemoved(type)}
                disabled={disabled}
            >
                Less
            </button>
            <button
                className={styles.less}
                onClick={() => ingredientAdded(type)}
            >
                More
            </button>
        </div>
    );
}

export default BuildControl;