import React from 'react';
import SlimButton from '../UI/SlimButton/SlimButton';
import styles from './AddingConfirmation.module.css';
import Spinner from '../UI/Spinner/Spinner';

const AddingConfirmation = ({
    burgerDetails: {
        name,
        ingredients,
        price
    },
    dismissModal,
    redirectToCart,
    addItem,
    error,
    loading
}) => {
    let title = <h2 className='primary'>Your burger is being added...</h2>;
    let content = (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Spinner />
        </div>
    );
    if (!loading && !error) {
        title = <h2 className='success'>Success!</h2>;
        content = (
            <>
                <p>You've successfully added burger to the cart:</p>
                <p>Name: <span><strong>{name}</strong></span></p>
                <p>Ingredients:</p>
                <p>Price:<span><strong>{price.toFixed(2)}</strong></span></p>
                <div className={styles.btns}>
                    <SlimButton
                        btnType='success'
                        clicked={redirectToCart}
                    >
                        Go to cart
                    </SlimButton>
                    <SlimButton
                        btnType='primary'
                        clicked={dismissModal}
                    >
                        Add more burgers
                    </SlimButton>
                </div>
            </>
        );
    }
    if (!loading && error) {
        title = <h2 className='danger'>Something went wrong!</h2>;
        content = (
            <>
                <p>Unfortunately, an error occured while trying to add your burger to the cart.</p>
                <div className={styles.btns}>
                    <SlimButton
                        btnType='success'
                        clicked={() => addItem({ name, ingredients })}
                    >
                        Try again
                    </SlimButton>
                    <SlimButton
                        btnType='danger'
                        clicked={dismissModal}
                    >
                        Ok
                    </SlimButton>
                </div>
            </>
        )
    }
    return (
        <div className={styles.addingConfirmation}>
            {title}
            {content}
        </div>
    );
}

export default AddingConfirmation;