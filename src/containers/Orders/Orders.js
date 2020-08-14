import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import OrderTable from '../../components/Order/OrderTable/OrderTable';
import OrderFilters from '../../components/Order/OrderFilters/OrderFilters';
import OrderStats from '../../components/Order/OrderStats/OrderStats';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions';
import styles from './Orders.module.css';

const Orders = ({
    loading,
    filteredOrders,
    orders,
    orderStats,
    error,
    onOrdersFetch,
    onFilterOrders,
    token,
    userId
}) => {
    useEffect(() => {
        onOrdersFetch(token, userId);
    }, [onOrdersFetch, token, userId])

    let ordersToShow = <p>There are no orders matching below filters.</p>;
    let orderStatsToShow = <p>There are no stats to show.</p>;

    if (filteredOrders.length) {
        ordersToShow = <OrderTable orders={filteredOrders} />;
        orderStatsToShow = <OrderStats {...orderStats} />;
    }

    let displayedOrders = orders.length ? (
        <>
            {ordersToShow}
            <OrderFilters onFilterOrders={onFilterOrders} />
            {orderStatsToShow}
        </>
    ) : (
            <p>There are no orders to show.</p>
        )

    if (error) displayedOrders = (
        <p>Something went wrong, please try again later.</p>
    )
    if (loading) displayedOrders = <Spinner />

    return (
        <div className={styles.orders}>
            <h2>Orders</h2>
            {displayedOrders}
        </div>
    )
}

const mapStateToProps = ({
    order: { loading, filteredOrders, orders, orderStats, error },
    auth: { token, userId }
}) => ({
    loading,
    filteredOrders,
    orders,
    orderStats,
    error,
    token,
    userId
});

const mapDispatchToProps = dispatch => ({
    onOrdersFetch: (token, userId) => {
        dispatch(actions.fetchOrders(token, userId))
    },
    onFilterOrders: (filters) => {
        dispatch(actions.changeOrderFilters(filters))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Orders);