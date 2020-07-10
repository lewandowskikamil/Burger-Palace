import React, { Component } from 'react';
import { Redirect } from 'react-router';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../../containers/Checkout/ContactData/ContactData';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

class Checkout extends Component {
    render() {
        const { ingredients, history, purchased } = this.props;
        let summary = <Redirect to='/' />
        if (ingredients) {
            const purchasedRedirect = purchased ? <Redirect to='/' /> : null
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary
                        ingredients={ingredients}
                        checkoutContinued={() => history.replace('/checkout/contact-data')}
                        checkoutCancelled={() => history.goBack()}
                    />
                    <Route
                        path={this.props.match.path + '/contact-data'} component={ContactData}
                    />
                </div>
            )
        }
        return summary;
    }
}
const mapStateToProps = ({ burger: { ingredients }, order: { purchased } }) => ({ ingredients, purchased });

export default connect(mapStateToProps)(Checkout);