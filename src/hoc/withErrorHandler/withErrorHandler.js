import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        constructor(props) {
            super(props);
            // Nie wywołuj tutaj this.setState()!
            this.state = {
                error: null
            }
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({ error: null })
                return req
            })
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({ error })
            })
        }
        errorConfirmedHandler = () => {
            this.setState({ error: null })
        }
        componentWillUnmount() {
            //preventing memory leaks on unmounting (that could potentially become an issue after implementing routing)
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);

        }
        render() {
            return (
                <>
                    <Modal
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}
                    >
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </>
            )
        }
    }
}
export default withErrorHandler;