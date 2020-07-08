import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import styles from './CheckoutSummary.module.css';

const CheckoutSummary = ({ ingredients, checkoutContinued, checkoutCancelled }) => {
    return (
        <div className={styles.checkoutSummary}>
            <h1
                style={{
                    margin: '30px 15px'
                }}
            >
                We hope it tastes well!
            </h1>
            <div style={{
                width: '100%'
            }}>
                <Burger ingredients={ingredients} />
            </div>
            <Button btnType="success" clicked={checkoutContinued}>Continue</Button>
            <Button btnType="danger" clicked={checkoutCancelled}>Cancel</Button>
        </div>
    );
}

export default CheckoutSummary;