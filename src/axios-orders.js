import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-aa74a.firebaseio.com/'
});

export default instance;