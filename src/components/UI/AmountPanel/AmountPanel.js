import React from 'react';
import styles from './AmountPanel.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../shared/icons';

const AmountPanel = ({
    increaseAmount,
    decreaseAmount,
    amount,
    margin
}) => {
    return (
        <div
            className={styles.amountPanel}
            style={{ margin: margin ? margin : '0' }}
        >
            <button
                onClick={decreaseAmount}
                disabled={!amount}
            >
                <FontAwesomeIcon icon={icons.faMinus} />
            </button>
            <span><strong>{amount}</strong></span>
            <button
                onClick={increaseAmount}
            >
                <FontAwesomeIcon icon={icons.faPlus} />
            </button>
        </div>
    );
}

export default AmountPanel;