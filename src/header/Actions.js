import * as ActionTypes from './ActionTypes.js';
import fetch from 'cross-fetch';
import config from '../config.js';
import {requestPost} from "../home/Actions";

const requestIdState = () => ({
    type: ActionTypes.POST_REQUEST_ID,
});
const requestIdSuccess = (list) => ({
    type: ActionTypes.POST_REQUEST_ID_SUCCESS,
    payload: {list: list}
});
const requestIdFailure = () => ({
    type: ActionTypes.POST_REQUEST_ID_FAILURE
});
export const requestId = () => {
    return (dispatch) => {
        dispatch(requestIdState());
        return fetch(`${config.url}getPostId`,{method:'GET'}).then(res=>res.json()).then(
            json=>{
                dispatch(requestIdSuccess(json));
                for(let item of json){
                    dispatch(requestPost(item))
                }
            }
        ).catch(dispatch(requestIdFailure()))
    }
};

export const ChangeOptions = () => ({
    type: ActionTypes.HEADER_OPTIONS
});
export const BackTop = () => ({
    type: ActionTypes.HEADER_BACK_TOP
});
export const SendUserName = (name) => ({
    type: ActionTypes.HEADER_SEND_USER_NAME,
    payload: {name: name}
});
export const UserNameNull = () => ({
    type: ActionTypes.HEADER_USER_NAME_NULL,
});