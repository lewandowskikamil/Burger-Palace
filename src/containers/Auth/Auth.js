import React, { Component } from 'react';
import { connect } from 'react-redux';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import styles from './Auth.module.css';
import * as actions from '../../store/actions';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';


class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementLabel: 'Email',
                elementConfig: {
                    id: 'emailInput',
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true,
                    errorMessage: 'It must be a valid email, don\'t fuck with me.'
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementLabel: 'Password',
                elementConfig: {
                    id: 'passwordInput',
                    type: 'password',
                    placeholder: 'Your password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                    errorMessage: 'Password must be at least 6 characters long.'
                },
                valid: false,
                touched: false
            },
        },
        isFormValid: false,
        isSignUp: true,
    }
    switchAuthModeHandler = () => {
        this.setState(prevState => ({
            isSignUp: !prevState.isSignUp
        }))
    }
    inputChangeHandler = (e) => {
        const { [e.target.name]: formElement } = this.state.controls;
        const updatedFormElement = updateObject(formElement, {
            value: e.target.value,
            valid: checkValidity(
                e.target.value, formElement.validation
            )
        })
        if (!updatedFormElement.touched) updatedFormElement.touched = true
        const updatedControls = updateObject(this.state.controls, {
            [e.target.name]: updatedFormElement
        })
        if (this.state.isFormValid === updatedFormElement.valid) {
            this.setState({ controls: updatedControls });
        } else {
            let isFormValid = true;
            for (const inputIdentifier in updatedControls) {
                if (!updatedControls[inputIdentifier].valid && isFormValid) {
                    isFormValid = false
                }
            }

            this.setState({ controls: updatedControls, isFormValid });
        }
    }
    
    submitHandler = (e) => {
        const { controls: { email, password }, isSignUp } = this.state;
        e.preventDefault();
        this.props.onAuth(email.value, password.value, isSignUp)
    }
    componentDidMount() {
        const { purchasable, authRedirectPath, onSetAuthRedirectPath } = this.props;
        if (!purchasable && authRedirectPath !== '/') onSetAuthRedirectPath('/');
    }
    render() {
        const formElementsArray = Object.keys(this.state.controls)
            .map(elKey => ({
                ...this.state.controls[elKey],
                elementConfig: {
                    ...this.state.controls[elKey].elementConfig,
                    name: elKey
                }
            }))
            .map(element => (
                <Input
                    key={element.elementConfig.name}
                    changed={this.inputChangeHandler}
                    {...element}
                />
            ))
        let form = (
            <form onSubmit={this.submitHandler}>
                {formElementsArray}
                <Button btnType='success' disabled={!this.state.isFormValid}>{this.state.isSignUp ? 'Sign Up' : 'Sign In'}</Button>
            </form>
        )
        if (this.props.loading) form = <Spinner />
        let errorMessage = null;
        if (this.props.error) errorMessage = (
            <p>{this.props.error.message}</p>
        )
        if (this.props.isAuthed) return <Redirect to={this.props.authRedirectPath} />

        return (
            <div className={styles.auth}>
                <h2>{this.state.isSignUp ? 'Sign Up' : 'Sign In'}</h2>
                {errorMessage}
                {form}
                <Button btnType='danger' clicked={this.switchAuthModeHandler}>Switch to {this.state.isSignUp ? 'Sign In' : 'Sign Up'} Panel</Button>
            </div>
        );
    }
}
const mapStateToProps = ({ auth: { loading, error, token, authRedirectPath }, burger: { purchasable } }) => ({ loading, error, isAuthed: !!token, purchasable, authRedirectPath })
const mapDispatchToProps = dispatch => ({
    onAuth: (email, password, isSignUp) => {
        dispatch(actions.auth(email, password, isSignUp))
    },
    onSetAuthRedirectPath: (path) => {
        dispatch(actions.setAuthRedirectPath(path))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth);