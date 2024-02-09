import { createReducer, on } from "@ngrx/store";
import {
    addChat,
    appendData,
    commit,
    deleteChat,
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
    on(commit, (state) => (commitR(state)))
);
function commitR(state: any) {
    localStorage.setItem('chats', JSON.stringify(state))
}
function appendDataR(state: any, token: number, data: any) {
    const index = getIndexByToken(state, token);
    if (index >= 0) {
        let tempData = { ...state[index], data: state[index].data + data, unread: state[index].unread + 1 }
        return changeObjectBetweenArray(state, tempData, index);
    }
    return state;
}

function resetDataR(state: any, token: any) {

    const index = getIndexByToken(state, token);
    if (index >= 0) {
        let tempData = { ...state[index], data: '', unread: 0 }
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
        const tempData = { ...state[index], unread: 0 }
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