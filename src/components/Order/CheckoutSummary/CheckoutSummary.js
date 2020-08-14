import React from 'react';
import Burger from '../../Burger/Burger';
import SlimButton from '../../UI/SlimButton/SlimButton';
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
                <div className={styles.burgerWrapper}>
                    <Burger ingredients={ingredients} />
                </div>
            </div>
            <SlimButton btnType="success" clicked={checkoutContinued}>Continue</SlimButton>
            <SlimButton btnType="danger" clicked={checkoutCancelled}>Cancel</SlimButton>
        </div>
    );
}

export default CheckoutSummary;