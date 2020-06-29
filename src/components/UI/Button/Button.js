import React from 'react';
import styles from './Button.module.css'

const Button = ({ children, clicked, btnType }) => {
    return (
        <button
            onClick={clicked}
            className={[styles.button, styles[btnType]].join(' ')}
        >
            {children}
        </button>
    );
}

export default Button;