import axios from 'axios'
import {
    TYPE
} from './types'
export function loginUser(dataToSubmit){

    const request = axios.post('/api/users/login', dataToSubmit)
    .then(response => response.data)

    return {
        type: TYPE.LOGIN_USER,
        payload: request
    }

};