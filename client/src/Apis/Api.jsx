import axios1 from 'axios';
import auth from '../lib/auth';

const axios =  axios1.create({
    baseURL : 'http://localhost:4444',
    headers : {
        Authorization : `Bearer ${auth.token} `
    }
})

export default axios;
