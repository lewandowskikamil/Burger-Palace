import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './hoc/Layout/Layout';
import About from './components/About/About';
import Redirect from './components/Redirect/Redirect';
import Menu from './containers/Menu/Menu';
import Cart from './containers/Cart/Cart';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Signout from './containers/Auth/Signout/Signout';
import Admin from './containers/Admin/Admin';

const App = ({ isAuthed, userRole }) => {
  const location = useLocation();
  let routes = (
    <AnimatePresence exitBeforeEnter>
      <Switch location={location} key={location.key}>
        <Route path='/' exact component={About} />
        <Route path='/menu' component={Menu} />
        <Route path='/builder' component={BurgerBuilder} />
        <Route path='/auth' component={Auth} />
        <Route path='/signout' component={Signout} />
        <Route path="/">
          <Redirect to='/' />
        </Route>
      </Switch>
    </AnimatePresence>
  )
  if (isAuthed) routes = (
    <AnimatePresence exitBeforeEnter>
      <Switch location={location} key={location.key}>
        <Route path='/' exact component={About} />
        <Route path='/menu' component={Menu} />
        <Route path='/builder' component={BurgerBuilder} />
        <Route path='/cart' component={Cart} />
        <Route path='/checkout' component={Checkout} />
        <Route path='/orders' component={Orders} />
        <Route path='/auth' component={Auth} />
        <Route path='/signout' component={Signout} />
        {['admin', 'super admin'].includes(userRole) ? (
          <Route path='/admin' component={Admin} />
        ) : null}
        <Route path="/">
          <Redirect to='/' />
        </Route>
      </Switch>
    </AnimatePresence>
  )
  return (
    <Layout>
      {routes}
    </Layout>
  );
}

const mapStateToProps = ({
  firebase: {
    auth: { uid },
    profile: { role }
  }
}) => ({
  isAuthed: !!uid,
  userRole: role
});

export default connect(mapStateToProps)(App);