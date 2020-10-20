import React from 'react';
import styles from './AuthMissing.module.css';
import Button from '../../Button/Button';

const AuthMissing = ({ btnClicked }) => {
    return (
        <div className={styles.authMissing}>
            <h2 className='primary'>You're not signed in!</h2>
            <p>Only authenticated users can add items to cart. Authentication will take you just a moment.</p>
            <Button
                clicked={btnClicked}
            >
                Sign In
            </Button>
        </div>
    );
}

export default AuthMissing;