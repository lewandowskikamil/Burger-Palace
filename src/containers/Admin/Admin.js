import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import * as actions from '../../store/actions';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import AsyncProgress from '../../components/UI/Modal/AsyncProgress/AsyncProgress';
import PageHeading from '../../components/UI/PageHeading/PageHeading';
import Button from '../../components/UI/Button/Button';
import PricesForm from '../../components/Admin/PricesForm/PricesForm';
import Roles from '../../components/Admin/Roles/Roles';
import styles from './Admin.module.css';
import {
    variantsProps,
    containerVariants,
    fadeVariants,
    translateXVariants,
    translateYVariants
} from '../../shared/utility';

const Admin = ({
    userRole,
    pricesRequested,
    pricesError,
    prices,
    onUpdatePrices,
    onChangeRole,
    rolesRequested,
    rolesError,
    roles,
    adminError,
    adminLoading,
    history
}) => {
    const [isModalShowed, setIsModalShowed] = useState(false);
    const [modalToShow, setModalToShow] = useState('');

    const pageHeading = (
        <motion.div
            variants={translateYVariants}
            custom={true}
        >
            <PageHeading>
                {userRole === 'admin' ? 'admin panel' : 'super admin panel'}
            </PageHeading>
        </motion.div>
    );
    const redirectSection = (
        <section className={styles.redirectSection}>
            <motion.div
                variants={translateYVariants}
                custom={false}
            >
                <h2>Introduce changes to menu</h2>
                <Button
                    clicked={() => history.push('/menu')}
                    gradient
                >
                    Go to menu
                </Button>
            </motion.div>
            <motion.div
                variants={translateYVariants}
                custom={false}
            >
                <h2>Check out all the orders and their stats</h2>
                <Button
                    clicked={() => history.push('/orders')}
                    gradient
                >
                    Go to orders
                </Button>
            </motion.div>
        </section>
    );

    let pageContent;
    let pricesSection;
    let rolesSection;

    if (!pricesRequested || (userRole === 'super admin' ? !rolesRequested : false)) {
        pageContent = (
            <motion.div
                key='spinner'
                variants={fadeVariants}
                {...variantsProps}
            >
                <Spinner withFullPageWrapper large />
            </motion.div>
        )
    } else {
        if (pricesError) pricesSection = (
            <motion.section
                variants={translateXVariants}
                custom={true}
            >
                <p className='info'>
                    Unfortunately, an error occured while trying to fetch ingredient prices from our database. Please, try again later.
                </p>
            </motion.section>
        )
        else pricesSection = (
            <motion.section
                variants={translateXVariants}
                custom={true}
            >
                <PricesForm
                    pricesData={prices[0]}
                    onSubmit={onUpdatePrices}
                    setIsModalShowed={setIsModalShowed}
                    setModalToShow={setModalToShow}
                    valueUnit='PLN'
                />
            </motion.section >
        )

        if (userRole !== 'super admin') rolesSection = null;
        else if (rolesError) rolesSection = (
            <motion.section
                variants={translateXVariants}
                custom={false}
            >
                <p className='info'>
                    Unfortunately, an error occured while trying to fetch roles from our database. Please, try again later.
                </p>
            </motion.section>
        )
        else rolesSection = (
            <Roles
                changeRole={onChangeRole}
                roles={roles}
                setIsModalShowed={setIsModalShowed}
                setModalToShow={setModalToShow}
            />
        )

        pageContent = (
            <motion.div
                key='content'
                variants={fadeVariants}
                {...variantsProps}
            >
                {pageHeading}
                {pricesSection}
                {rolesSection}
                {redirectSection}
            </motion.div>
        )
    }

    const modalContent = (
        <AsyncProgress
            error={adminError}
            loading={adminLoading}
            heading={{
                loading: modalToShow === 'updatePrices' ? (
                    'Updating ingredient prices...'
                ) : (
                        'Updating user role...'
                    ),
                fail: 'Something went wrong!',
                success: 'Success!'
            }}
            mainContent={{
                fail: modalToShow === 'updatePrices' ? (
                    'Unfortunately, an error occured, while trying to update ingredient prices.'
                ) : (
                        'Unfortunately, an error occured, while trying to update user role.'
                    ),
                success: modalToShow === 'updatePrices' ? (
                    'Ingredient prices have been successfully updated.'
                ) : (
                        'User role has been successfully updated.'
                    )
            }}
            buttons={{
                success: [{
                    theme: 'success',
                    content: 'Ok',
                    clickHandler: () => setIsModalShowed(false)
                }],
                fail: [{
                    theme: 'danger',
                    content: 'Ok',
                    clickHandler: () => setIsModalShowed(false)
                }]
            }}
        />
    )

    return (
        <>
            <Modal
                isShowed={isModalShowed}
                closeModal={() => setIsModalShowed(false)}
            >
                {modalContent}
            </Modal>
            <motion.div
                variants={containerVariants}
                {...variantsProps}
            >
                <AnimatePresence exitBeforeEnter>
                    {pageContent}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
const mapStateToProps = ({
    firebase: {
        profile: { role }
    },
    firestore: {
        ordered: { prices, roles },
        status,
        errors
    },
    admin: {
        error,
        loading
    }
}) => ({
    userRole: role,
    pricesRequested: status.requested.prices,
    pricesError: errors.allIds.includes('prices'),
    prices,
    rolesRequested: status.requested.roles,
    rolesError: errors.allIds.includes('roles'),
    roles,
    adminError: error,
    adminLoading: loading
})
const mapDispatchToProps = dispatch => ({
    onUpdatePrices: updatedPrices => {
        dispatch(actions.updatePrices(updatedPrices))
    },
    onChangeRole: (userId, operationType) => {
        dispatch(actions.changeRole(userId, operationType))
    }
})
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => {
        return props.userRole === 'admin' ? (
            [
                { collection: 'ingredients', doc: 'prices', storeAs: 'prices' }
            ]
        ) : (
                [
                    { collection: 'ingredients', doc: 'prices', storeAs: 'prices' },
                    { collection: 'roles' }
                ]
            )
    }))(Admin);