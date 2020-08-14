import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, lg, clicked }) => {
    const btnClasses = [styles.btn];
    if (lg) btnClasses.push(styles.lg)
    else btnClasses.push(styles.sm)
    return (
        <button
            className={btnClasses.join(' ')}
            onClick={clicked}
        >
            {children}
        </button>
    );
}

export default Button;