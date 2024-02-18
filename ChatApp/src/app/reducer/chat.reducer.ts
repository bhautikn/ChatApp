import { createReducer, on } from "@ngrx/store";
import {
    addChat,
    appendData,
    changeStatus,
    commit,
    deleteChat,
    deletePerticulerChat,
    resetChatData,
    resetresetUnreadToZero,
    setChatName

} from './chat.action';

import { getChats } from "../../environments/environment.development";

const initialState: any = getChats();

export const chatReducer = createReducer(
    initialState,
    on(deleteChat, (state, props) => (deleteChatR(state, props.index))),
    on(appendData, (state, props) => (appendDataR(state, props.token, props.data))),
    on(setChatName, (state, props) => (setChatNameR(state, props.token, props.name))),
    on(resetChatData, (state, props) => (resetDataR(state, props.token))),
    on(resetresetUnreadToZero, (state, props) => (resetUnreadToZeroR(state, props.token))),
    on(addChat, (state, props) => (addChatR(state, props.chatObj))),
    on(deletePerticulerChat, (state, props) => (deletePerticulerChatR(state, props.token, props.index))),
    on(changeStatus,(state, props) => (changeStatusR( state, props.token, props.id, props.status ))),
    on(commit, (state) => (commitR(state)))
);

function commitR(state: any) {
    localStorage.setItem('chats', JSON.stringify(state))
}
function changeStatusR(state:any, token:any, id:any, status:any){
    const chatIndex:number = getIndexByToken(state, token);
    if(chatIndex >= 0){
        let tempData = {
            ...state[chatIndex], 
            data: state[chatIndex].data.map((item:any) => {
                if(item.id == id){
                    return {...item, status: status}
                }
                return item;
            })
        };
        return changeObjectBetweenArray(state, tempData, chatIndex);
    }else{
        return state;
    }
}
function deletePerticulerChatR(state:any, token:any, index:any){
    const chatIndex:number = getIndexByToken(state, token);
    if(chatIndex >= 0){
        let tempData = {
            ...state[chatIndex], 
            data: [
                ...state[chatIndex].data.slice(0, index), 
                ...state[chatIndex].data.slice(index + 1)
            ]
        };
        return changeObjectBetweenArray(state, tempData, chatIndex);
    }else{
        return state;
    }

}

function appendDataR(state: any, token: number, data: any) {
    const index = getIndexByToken(state, token);
    if (index >= 0) {
        let tempData = { 
            ...state[index], 
            data: [...state[index].data, data], 
            unread: state[index].unread + 1,
            modified: new Date().toString()
        }
        return changeObjectBetweenArray(state, tempData, index);
    }
    return state;
}

function resetDataR(state: any, token: any) {

    const index = getIndexByToken(state, token);
    if (index >= 0) {
        let tempData = { ...state[index], data: [], unread: 0 }
        return changeObjectBetweenArray(state, tempData, index);
    }
    return state;
}

function deleteChatR(state: any, index: number) {
    localStorage.removeItem(state[index].token);
    return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
    ];
}

function addChatR(state: any, obj: any) {
    state = [...state, obj];
    return state;
}
function resetUnreadToZeroR(state: any, token: any) {
    const index = getIndexByToken(state, token);

    if (index >= 0) {
        const tempData = { ...state[index], unread: 0, modified: new Date().toString() }
        return changeObjectBetweenArray(state, tempData, index);
    }

    return state;
}
function setChatNameR(state: any, token: any, name: string) {

    for (let i in state) {
        if (state[i].token == token) {
            const tempData = { ...state[i], name: name }
            return [
                ...state.slice(0, i),
                tempData,
                ...state.slice(i + 1)
            ];
        }
    }
    return state;
}

function changeObjectBetweenArray(state: any, tempData: any, index: any) {
    return [
        ...state.slice(0, index),
        tempData,
        ...state.slice(index + 1)
    ];
}

function getIndexByToken(state: any, token: any): number {
    let index = -1;
    state.forEach((item: any, i: any) => {
        if (item.token == token) {
            index = i;
            return;
        }
    })
    return index;
}