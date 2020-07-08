import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null,
            interceptorsSet: false
        }
        errorConfirmedHandler = () => {
            this.setState({ error: null })
        }
        componentDidMount() {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({ error: null })
                return req
            })
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({ error })
            })
            this.setState({ interceptorsSet: true })
        }
        componentWillUnmount() {
            //preventing memory leaks on unmounting (that could potentially become an issue after implementing routing)
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);

        }
        render() {
            let content = null;
            if (this.state.interceptorsSet) content = (
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
            return content
        }
    }
}
export default withErrorHandler;