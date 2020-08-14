import React from 'react';
import { Redirect } from 'react-router';
import ContactData from '../../containers/Checkout/ContactData/ContactData';
import { connect } from 'react-redux';
import styles from './Checkout.module.css'

const Checkout = ({ totalPrice }) => {
    let checkout = <Redirect to='/' />
    if (totalPrice) checkout = (
        <div className={styles.checkout}>
            <ContactData/>
        </div>
    )
    return checkout;
}
const mapStateToProps = ({ cart: { totalPrice } }) => ({ totalPrice });

export default connect(mapStateToProps)(Checkout);