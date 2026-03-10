import axios from "./Api";
import auth from "../lib/auth";

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

export async function updateName({name}){
    try {
        const {data} = await axios({
            method : 'post',
            url : '/api/auth/updatename',
            data : {
                newName : name
            }
        })
        // console.log(auth.user);
        // console.log(data);
        auth.user = data.user;
        return data;
    } catch (error) {
        return error;
    }
}

export async function updateEmail({email}){
    try{
        const {data} = await axios({
            method : 'post',
            url : '/api/auth/updateemail',
            data : {
                newEmail : email
            }
        })
        console.log(auth.user);
        console.log(data);
        auth.user = data.user;
        return data;
    }catch(error){
        return error;
    }
}

export async function updatePassword({password}){
    console.log(password)
    try {
        const {data} = await axios({
            method : 'post',
            url : '/api/auth/updatepassword',
            data : {
                newPassword : password
            }
        });
        // console.log(auth.user);
        // console.log(data);
        auth.user = data.user;

        return data;
    } catch (error) {
        return error;
    }
}


export default {
    signup,
    signin
}