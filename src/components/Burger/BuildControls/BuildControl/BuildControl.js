import React from 'react';
import styles from './BuildControl.module.css';

const BuildControl = ({ label, ingredientChanged, type, disabled }) => {
    return (
        <div className={styles.buildControl}>
            <span className={styles.label}>
                {label}
            </span>
            <button
                className={styles.less}
                onClick={() => ingredientChanged(type, false)}
                disabled={disabled}
            >
                Less
            </button>
            <button
                className={styles.less}
                onClick={() => ingredientChanged(type, true)}
            >
                More
            </button>
        </div>
    );
}

export default BuildControl;