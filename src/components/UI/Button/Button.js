import React from 'react';
import styles from './Button.module.css'

const Button = ({ children, clicked, btnType, disabled }) => {
    return (
        <button
            onClick={clicked}
            className={[styles.button, styles[btnType]].join(' ')}
            disabled={Boolean(disabled)}
        >
            {children}
        </button>
    );
}

export default Button;