import React from 'react';
import styles from './SlimButton.module.css'

const SlimButton = ({ children, clicked, btnType, disabled }) => {
    return (
        <button
            onClick={clicked}
            className={[styles.slimButton, styles[btnType]].join(' ')}
            disabled={Boolean(disabled)}
        >
            {children}
        </button>
    );
}

export default SlimButton;