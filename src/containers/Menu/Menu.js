import React, { useState } from 'react';
import Button from '../../components/UI/Button/Button';
import BurgerCard from '../../components/BurgerCard/BurgerCard';
import AddingConfirmation from '../../components/AddingConfirmation/AddingConfirmation';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import SlimButton from '../../components/UI/SlimButton/SlimButton';
import styles from './Menu.module.css';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import * as actions from '../../store/actions';

const Menu = ({
    history,
    onAddToCart,
    burgers,
    cartError,
    cartLoading,
    menuError,
    menuRequested,
    isAuthed
}) => {
    const [isModalShowed, setIsModalShowed] = useState(false);
    const [addedBurger, setAddedBurger] = useState(null);
    const addToCart = ({ name, ingredients, price }) => {
        if (isAuthed) {
            onAddToCart({ name, ingredients });
            setAddedBurger({
                name,
                ingredients,
                price
            });
        }
        setIsModalShowed(true);
    }
    const redirectToSignIn = () => {
        const state = {
            prevPath: history.location.pathname
        }
        history.push('/auth', state);
    }
    if (!menuRequested) return (
        <div
            style={{
                margin: '100px 0',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Spinner />
        </div>
    )
    if (menuError) return (
        <div className={styles.menu}>
            <h2>Menu</h2>
            <div>
                <p>Unfortunately, an error occured while trying to load menu items. Please, try again later or build your custom burger.</p>
            </div>
            <Button
                clicked={() => history.push('/')}
                lg
            >
                Build custom burger
            </Button>
        </div>
    )
    let modalContent = null;
    if (isModalShowed && !isAuthed) modalContent = (
        <div>
            <h2 className='danger'>You're not signed in!</h2>
            <p>Only authenticated users can add items to cart. Authentication will take you just a moment.</p>
            <SlimButton
                btnType='success'
                clicked={redirectToSignIn}
            >
                Sign In
            </SlimButton>
        </div>
    );
    if (isModalShowed && isAuthed) modalContent = (
        <AddingConfirmation
            burgerDetails={addedBurger}
            dismissModal={() => setIsModalShowed(false)}
            redirectToCart={() => history.push('/cart')}
            error={cartError}
            loading={cartLoading}
            addItem={onAddToCart}
        />
    )

    return (
        <>
            <Modal
                show={isModalShowed}
                modalClosed={() => setIsModalShowed(false)}
            >
                {modalContent}
            </Modal>
            <div className={styles.menu}>
                <h2>Menu</h2>
                <div>
                    {burgers.map(burger => (
                        <BurgerCard
                            key={burger.id}
                            burgerInfo={burger}
                            btnClicked={() => addToCart(burger)}
                        />
                    ))}
                </div>
                <h3>Couldn't find a burger matching your needs?</h3>
                <Button
                    clicked={() => history.push('/')}
                    lg
                >
                    Build custom burger
                </Button>
            </div>
        </>
    )
}
const mapStateToProps = ({
    cart: {
        error,
        loading
    },
    firestore: {
        ordered,
        status,
        errors
    },
    firebase: { auth }
}) => ({
    cartError: error,
    cartLoading: loading,
    burgers: ordered.menu,
    menuRequested:status.requested.menu,
    menuError:errors.allIds.includes('menu'),
    isAuthed: !!auth.uid
})
const mapDispatchToProps = dispatch => ({
    onAddToCart: item => dispatch(actions.addItem(item))
})
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'menu' },
    ])
)(Menu)