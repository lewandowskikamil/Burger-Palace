import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import OrderTable from '../../components/Order/OrderTable/OrderTable';
import OrderFilters from '../../components/Order/OrderFilters/OrderFilters';
import OrderStats from '../../components/Order/OrderStats/OrderStats';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions';
import styles from './Orders.module.css';

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
    ordersBurgers,
    areStatsCalculated
}) => {

    if (!ordersRequested || !ordersBurgersRequested) return (
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
    if (ordersError || ordersBurgersError) return (
        <>
            <h2 className={styles.pageHeading}>Orders</h2>
            <div>
                <p>Unfortunately an error occured while trying to load your orders. Sorry for the inconvenience. Try again later.</p>
            </div>
        </>
    )
    if (!orders.length) return (
        <>
            <h2 className={styles.pageHeading}>Orders</h2>
            <div>
                <p>There are no orders yet.</p>
            </div>
        </>
    )
    return (
        <>
            <h2 className={styles.pageHeading}>Orders</h2>
            <OrderFilters
                savedFilters={savedFilters}
                filterOrders={onFilterOrders}
                setOrdersFilters={onSetOrdersFilters}
                orders={orders}
                ordersBurgers={ordersBurgers}
            />
            <OrderStats
                ordersStats={ordersStats}
                filteredOrders={filteredOrders}
                ordersBurgersStats={ordersBurgersStats}
                calculateOrdersStats={onCalculateOrdersStats}
                areStatsCalculated={areStatsCalculated}
            />
            <OrderTable
                filteredOrders={filteredOrders}
                filteredOrdersBurgers={filteredOrdersBurgers}
            />
        </>
    )
}

const mapStateToProps = ({
    orders: {
        savedFilters,
        filteredOrders,
        filteredOrdersBurgers,
        ordersStats,
        ordersBurgersStats,
        areStatsCalculated
    },
    firebase: {
        auth: { uid },
        profile
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
    userRole: profile.isLoaded && profile.role,
    ordersRequested: status.requested.orders,
    ordersError: errors.allIds.includes('orders'),
    ordersBurgersRequested: status.requested.ordersBurgers,
    ordersBurgersError: errors.allIds.includes('ordersBurgers'),
    orders: ordered.orders,
    ordersBurgers: ordered.ordersBurgers,
    areStatsCalculated
});

const mapDispatchToProps = dispatch => ({
    onFilterOrders: (orders, ordersBurgers) => {
        dispatch(actions.filterOrders(orders, ordersBurgers))
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
        if (!props.userRole) return []
        else if (props.userRole === 'user') {
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
        // define orders query and orderBurgers query
        // get user orders&burgers or get 'em all (if you're admin/super admin)
        return [ordersQuery, orderBurgersQuery]
    }))(Orders);



    // let ordersToShow = <p>There are no orders matching below filters.</p>;
    // let orderStatsToShow = <p>There are no stats to show.</p>;

    // if (filteredOrders.length) {
    //     ordersToShow = <OrderTable orders={filteredOrders} />;
    //     orderStatsToShow = <OrderStats {...orderStats} />;
    // }

    // let displayedOrders = orders.length ? (
    //     <>
    //         {ordersToShow}
    //         <OrderFilters onFilterOrders={onFilterOrders} />
    //         {orderStatsToShow}
    //     </>
    // ) : (
    //         <p>There are no orders to show.</p>
    //     )

    // if (error) displayedOrders = (
    //     <p>Something went wrong, please try again later.</p>
    // )
    // if (loading) displayedOrders = <Spinner />

    // return (
    //     <div className={styles.orders}>
    //         <h2>Orders</h2>
    //         {displayedOrders}
    //     </div>
    // )