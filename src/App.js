import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import Layout from './hoc/Layout/Layout';
import About from './components/About/About';
import Menu from './containers/Menu/Menu';
import Cart from './containers/Cart/Cart';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Signout from './containers/Auth/Signout/Signout';

const App = ({ isAuthed }) => {
  let routes = (
    <Switch>
      <Route path='/auth' component={Auth} />
      <Route path='/about' component={About} />
      <Route path='/menu' component={Menu} />
      <Route path='/signout' component={Signout} />
      <Route path='/' exact component={BurgerBuilder} />
      <Redirect to='/' />
    </Switch>
  )
  if (isAuthed) routes = (
    <Switch>
      <Route path='/checkout' component={Checkout} />
      <Route path='/orders' component={Orders} />
      <Route path='/signout' component={Signout} />
      <Route path='/auth' component={Auth} />
      <Route path='/about' component={About} />
      <Route path='/menu' component={Menu} />
      <Route path='/cart' component={Cart} />
      <Route path='/' exact component={BurgerBuilder} />
      <Redirect to='/' />
    </Switch>
  )
  return (
    <Layout>
      {routes}
    </Layout>
  );
}

const mapStateToProps = ({ firebase: { auth } }) => ({ isAuthed: !!auth.uid });

export default connect(mapStateToProps)(App);