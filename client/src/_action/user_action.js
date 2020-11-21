import axios from 'axios';
import  * as types from './types'

export function loginUser(dataToSubmit) {
    //dataTosubmit 은 서버에 보낼 사용자가 적은 데이터

    // 서버에 요청 후res.date를 request에 데이터를 담는다
    const request = axios.post('/api/users/login', dataToSubmit)
    .then(res=>res.date)

    return{
        type : types.LOGIN_USER,
        paylode :request

    }
}

export function registerUser(dataTosubmit){
    const request = axios.post('api/user/register',dataTosubmit)
    .then(res =>res.data)
    return {
        type : types.REGISTER_USER,
        paylode : request
    }
}

export function auth(){
    const request = axios.get('/api/users/auth')
        .then(response => response.data)

    return {
        type: types.AUTH_USER,
        payload: request
    }
}