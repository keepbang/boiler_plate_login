import {
    TYPE
} from '../_actions/types';

export default function (state = {}, action){

    switch (action.type) {
        case TYPE.LOGIN_USER:
            return {...state, loginSuccess: action.payload}
        default:
            return state;
    }

}