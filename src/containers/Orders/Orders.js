import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import OrderTable from '../../components/Orders/OrderTable/OrderTable';
import OrderFilters from '../../components/Orders/OrderFilters/OrderFilters';
import OrderStats from '../../components/Orders/OrderStats/OrderStats';
import Spinner from '../../components/UI/Spinner/Spinner';
import PageHeading from '../../components/UI/PageHeading/PageHeading';
import * as actions from '../../store/actions';
import {
    variantsProps,
    containerVariants,
    fadeVariants,
    translateXVariants,
    translateYVariants,
    scaleXVariants
} from '../../shared/utility';

const Orders = ({
    onFilterOrders,
    onSetOrdersFilters,
    onCalculateOrdersStats,
    savedFilters,
    filteredOrders,
    filteredOrdersBurgers,
    ordersStats,
    ordersBurgersStats,
    userId,
    userRole,
    ordersRequested,
    ordersError,
    ordersBurgersRequested,
    ordersBurgersError,
    orders,
    ordersBurgers
}) => {

    const pageHeading = (
        <motion.div
            variants={translateYVariants}
            custom={true}
        >
            <PageHeading>Cart</PageHeading>
        </motion.div>
    );
    let pageContent;
    if (!ordersRequested || !ordersBurgersRequested) pageContent = (
        <motion.div
            key='spinner'
            variants={fadeVariants}
            {...variantsProps}
        >
            <Spinner withFullPageWrapper large />
        </motion.div>
    )
    else if (ordersError || ordersBurgersError) pageContent = (
        <motion.div
            key='contentFail'
            variants={fadeVariants}
            {...variantsProps}
        >
            {pageHeading}
            <motion.p
                className='info'
                variants={scaleXVariants}
            >
                Unfortunately an error occured while trying to load your orders. Sorry for the inconvenience. Try again later.
            </motion.p>
        </motion.div>
    )
    else if (!orders.length) pageContent = (
        <motion.div
            key='contentEmpty'
            variants={fadeVariants}
            {...variantsProps}

        >
            {pageHeading}
            <motion.p
                className='info'
                variants={scaleXVariants}
            >
                There are no orders yet.
            </motion.p>
        </motion.div>
    )
    else pageContent = (
        <motion.div
            key='contentSuccess'
            variants={fadeVariants}
            {...variantsProps}
        >
            {pageHeading}
            <motion.div
                variants={translateXVariants}
                custom={true}
            >
                <OrderFilters
                    savedFilters={savedFilters}
                    filterOrders={onFilterOrders}
                    setOrdersFilters={onSetOrdersFilters}
                    orders={orders}
                    ordersBurgers={ordersBurgers}
                    userRole={userRole}
                    userId={userId}
                />
            </motion.div>
            <motion.div
                variants={translateXVariants}
                custom={false}
            >
                <AnimatePresence exitBeforeEnter>
                    {filteredOrders.length ? (
                        <motion.div
                            key='orderTable'
                            variants={containerVariants}
                            {...variantsProps}
                        >
                            <OrderTable
                                filteredOrders={filteredOrders}
                                filteredOrdersBurgers={filteredOrdersBurgers}
                            />
                        </motion.div>
                    ) : (
                            <motion.p
                                key='noMatchingOrders'
                                className='info'
                                variants={containerVariants}
                                {...variantsProps}
                            >
                                There are no matching orders.
                            </motion.p>
                        )}
                </AnimatePresence>
            </motion.div>
            <AnimatePresence>
                {Boolean(filteredOrders.length) && <motion.div
                    variants={fadeVariants}
                    {...variantsProps}
                >
                    <OrderStats
                        key='orderStats'
                        ordersStats={ordersStats}
                        filteredOrders={filteredOrders}
                        ordersBurgersStats={ordersBurgersStats}
                        calculateOrdersStats={onCalculateOrdersStats}
                    />
                </motion.div>}
            </AnimatePresence>
        </motion.div>
    )
    return (
        <motion.div
            variants={containerVariants}
            {...variantsProps}
        >
            <AnimatePresence exitBeforeEnter>
                {pageContent}
            </AnimatePresence>
        </motion.div>
    )
}

const mapStateToProps = ({
    orders: {
        savedFilters,
        filteredOrders,
        filteredOrdersBurgers,
        ordersStats,
        ordersBurgersStats
    },
    firebase: {
        auth: { uid },
        profile: { role }
    },
    firestore: {
        ordered,
        status,
        errors
    }
}) => ({
    savedFilters,
    filteredOrders,
    filteredOrdersBurgers,
    ordersStats,
    ordersBurgersStats,
    userId: uid,
    userRole: role,
    ordersRequested: status.requested.orders,
    ordersError: errors.allIds.includes('orders'),
    ordersBurgersRequested: status.requested.ordersBurgers,
    ordersBurgersError: errors.allIds.includes('ordersBurgers'),
    orders: ordered.orders,
    ordersBurgers: ordered.ordersBurgers
});

const mapDispatchToProps = dispatch => ({
    onFilterOrders: (orders, ordersBurgers, userRole, userId) => {
        dispatch(actions.filterOrders(orders, ordersBurgers, userRole, userId))
    },
    onSetOrdersFilters: filters => {
        dispatch(actions.setOrdersFilters(filters))
    },
    onCalculateOrdersStats: () => {
        dispatch(actions.calculateOrdersStats())
    }
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => {
        let ordersQuery;
        let orderBurgersQuery;
        if (props.userRole === 'user') {
            ordersQuery = {
                collection: 'orders',
                where: [['userId', '==', `${props.userId}`]],
                storeAs: 'orders'
            }
            orderBurgersQuery = {
                collectionGroup: 'orderBurgers',
                where: [['userId', '==', `${props.userId}`]],
                storeAs: 'ordersBurgers'
            }
        } else {
            ordersQuery = {
                collection: 'orders',
                storeAs: 'orders'
            }
            orderBurgersQuery = {
                collectionGroup: 'orderBurgers',
                storeAs: 'ordersBurgers'
            }
        }
        return [ordersQuery, orderBurgersQuery]
    }))(Orders);