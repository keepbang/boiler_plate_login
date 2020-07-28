import {
    TYPE
} from '../_actions/types';

export default function (state = {}, action){

    switch (action.type) {
        case TYPE.LOGIN_USER:
            return {...state, loginSuccess: action.payload}
        case TYPE.REGISTER_USER:
            return {...state, register: action.payload}
        case TYPE.AUTH_USER:
            return {...state, userData: action.payload}
        default:
            return state;
    }

}