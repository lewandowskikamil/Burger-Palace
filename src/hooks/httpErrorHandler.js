import { useState, useEffect } from 'react';

export default httpClient=>{
    const [error, setError] = useState(null);

    const errorConfirmedHandler = () => {
        setError(null)
    }
    const reqInterceptor = httpClient.interceptors.request.use(req => {
        setError(null)
        return req
    })
    const resInterceptor = httpClient.interceptors.response.use(res => res, error => {
        setError(error)
    })
    useEffect(() => {
        return () => {
            httpClient.interceptors.request.eject(reqInterceptor);
            httpClient.interceptors.response.eject(resInterceptor);
        }
    }, [reqInterceptor, resInterceptor, httpClient.interceptors.request, httpClient.interceptors.response])
    
    return [error, errorConfirmedHandler]
}