import React, { useEffect, Suspense, lazy } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import Spinner from './components/UI/Spinner/Spinner';
import Layout from './hoc/Layout/Layout';
import * as actions from './store/actions';
const BurgerBuilder = lazy(() => import('./containers/BurgerBuilder/BurgerBuilder'));
const Checkout = lazy(() => import('./containers/Checkout/Checkout'));
const Orders = lazy(() => import('./containers/Orders/Orders'));
const Auth = lazy(() => import('./containers/Auth/Auth'));
const Logout = lazy(() => import('./containers/Auth/Logout/Logout'));



const App = ({ onTryAutoSignIn, isAuthed }) => {
  useEffect(() => {
    onTryAutoSignIn();
  }, [onTryAutoSignIn]);
  let routes = (
    <Switch>
      <Route path='/auth' component={Auth} />
      <Route path='/' exact component={BurgerBuilder} />
      <Redirect to='/' />
    </Switch>
  )
  if (isAuthed) routes = (
    <Switch>
      <Route path='/checkout' component={Checkout} />
      <Route path='/orders' component={Orders} />
      <Route path='/logout' component={Logout} />
      <Route path='/auth' component={Auth} />
      <Route path='/' exact component={BurgerBuilder} />
      <Redirect to='/' />
    </Switch>
  )
  return (
    <Layout>
      <Suspense fallback={<div><Spinner></Spinner></div>}>
        {routes}
      </Suspense>
    </Layout>
  );
}

const mapStateToProps = ({ auth: { token } }) => ({ isAuthed: !!token });

const mapDispatchToProps = dispatch => ({
  onTryAutoSignIn: () => dispatch(actions.authCheckState())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);