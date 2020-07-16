import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Order from '../../components/Order/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions';

const Orders = ({
    loading,
    orders,
    error,
    onOrdersFetch,
    token,
    userId
}) => {
    useEffect(() => {
        onOrdersFetch(token, userId);
        // alternatively, you could use getState in fetchOrders action creator
    }, [onOrdersFetch, token, userId])
    let displayedOrders = orders.length ? (
        <div>
            {orders.map(({ id, ingredients, price }) => (
                <Order
                    key={id}
                    ingredients={ingredients}
                    price={+price}
                />
            ))}
        </div>
    ) : <p>There are no orders to display.</p>
    if (error) displayedOrders = <p>Something went wrong, please try again later.</p>
    if (loading) displayedOrders = <Spinner />
    return displayedOrders;
}
const mapStateToProps = ({
    order: { loading, orders, error },
    auth: { token, userId }
}) => ({
    loading,
    orders,
    error,
    token,
    userId
});

const mapDispatchToProps = dispatch => ({
    onOrdersFetch: (token, userId) => {
        dispatch(actions.fetchOrders(token, userId))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));