import React from 'react';
import SlimButton from '../UI/SlimButton/SlimButton';
import styles from './AsyncResultInfo.module.css';

const AsyncResultInfo = ({ infoType, clicked }) => {
    return (
        <div className={styles.asyncResultInfo}>
            <h2
                style={{
                    color: infoType === 'success' ? '#5C9210' : '#944317'
                }}
            >
                {infoType === 'success' ? 'Success!' : 'Something went wrong!'}
            </h2>
            <p>
                {infoType === 'success' ? 'Your order has been successfully made and it\'ll be delivered to you soon. Thank you for choosing Burger Bay!' : 'Sorry for the inconvenience, please try again later.'}
            </p>
            <SlimButton
                btnType={infoType}
                clicked={clicked}
            >
                Ok
            </SlimButton>
        </div>
    );
}

export default AsyncResultInfo;