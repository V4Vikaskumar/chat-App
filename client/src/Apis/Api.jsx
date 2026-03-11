import axios1 from 'axios';
import auth from '../lib/auth';

const axios =  axios1.create({
    baseURL : 'https://chat-app-1-lbg4.onrender.com',
    headers : {
        Authorization : `Bearer ${auth.token} `
    }
})

export default axios;
