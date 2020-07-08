import React, { Component } from 'react';
import { connect } from 'react-redux';
import Order from '../../components/Order/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions';

class Orders extends Component {
    componentDidMount() {
        this.props.onOrdersFetch();
    }
    render() {
        const { loading, orders, error } = this.props;
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
        if(error) displayedOrders=<p>Something went wrong, please try again later.</p>
        if (loading) displayedOrders = <Spinner />
        return displayedOrders;
    }
}
const mapStateToProps = ({ order: { loading, orders, error } }) => ({ loading, orders, error });

const mapDispatchToProps = dispatch => ({
    onOrdersFetch: () => dispatch(actions.fetchOrders())
})

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));