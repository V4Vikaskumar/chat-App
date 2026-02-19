import axios from "./Api";


async function signup({name,email,password}) {
    try {
        const {data : {data} } = await axios({
        method : 'post',
        url : `/api/auth/signup`,
        data : {
            name,
            email,
            password
        }
    });
    console.log(data);
    return data;
    } catch (error) {
        console.log(error);
    }
}

async function signin({email,password}){
    try {
        const {data : {data}} = await axios({
            method : 'post',
            url : '/api/auth/signin',
            data : {
                email,
                password
            }
        })
        console.log(data);
        return data;
    } catch (error) {
        return error;
    }
    
}

export async function find({nameofFriend}) {
    try {
        const {data: {data}} = await axios({
            method : 'post',
            url : '/api/friend/findfriend',
            data : {
                email : nameofFriend
            }
        })
        // console.log(data);
        return data;
    } catch (error) {
        return error;
    }
}

export async function lastOnline() {
    try {
        await axios({
            method : 'post',
            url : '/api/users/lastonline'
        })
    } catch (error) {
        return error;
    }
}

export default {
    signup,
    signin
}