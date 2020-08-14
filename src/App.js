import React, { useEffect} from 'react';
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
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions';



const App = ({ onTryAutoSignIn, onUpdateCart, isAuthed }) => {
  useEffect(() => {
    onUpdateCart();
    onTryAutoSignIn();
  }, [onTryAutoSignIn, onUpdateCart]);
  let routes = (
    <Switch>
      <Route path='/auth' component={Auth} />
      <Route path='/about' component={About} />
      <Route path='/menu' component={Menu} />
      <Route path='/cart' component={Cart} />
      <Route path='/checkout' component={Checkout} />
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

const mapStateToProps = ({ auth: { token } }) => ({ isAuthed: !!token });

const mapDispatchToProps = dispatch => ({
  onTryAutoSignIn: () => dispatch(actions.authCheckState()),
  onUpdateCart:()=>dispatch(actions.updateCart())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);