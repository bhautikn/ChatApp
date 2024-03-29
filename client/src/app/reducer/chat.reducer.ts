import { createReducer, on } from "@ngrx/store";
import {
    addChat,
    appendData,
    changeHistorySatting,
    changeStatus,
    commit,
    deleteChat,
    deletePerticulerChat,
    resetChatData,
    resetresetUnreadToZero,
    setChatName,
    setProgress,
    updateData,
    updateStatus

} from './chat.action';
import { dateDiffInDays, getChats } from "../functions";

const initialState: any = getChats();

export const chatReducer = createReducer(
    initialState,
    on(deleteChat, (state, props) => (deleteChatR(state, props.index))),
    on(appendData, (state, props) => (appendDataR(state, props.token, props.data, props.lastMassage))),
    on(setChatName, (state, props) => (setChatNameR(state, props.token, props.name))),
    on(resetChatData, (state, props) => (resetDataR(state, props.token))),
    on(resetresetUnreadToZero, (state, props) => (resetUnreadToZeroR(state, props.token))),
    on(addChat, (state, props) => (addChatR(state, props.chatObj))),
    on(deletePerticulerChat, (state, props) => (deletePerticulerChatR(state, props.token, props.id))),
    on(changeStatus, (state, props) => (changeStatusR(state, props.token, props.id, props.status))),
    on(setProgress, (state, props) => (setProgressR(state, props.token, props.id, props.progress))),
    on(updateData, (state, props) => (updateDataR(state, props.token, props.id, props.data))),
    on(changeHistorySatting, (state, props) => (changeHistorySattingR(state, props.token, props.setting))),
    on(updateStatus, (state, props) => (updateStatusR(state, props.token, props.status))),
    on(commit, (state) => (commitR(state))),
);

function commitR(state: any) {
    let data: any = state.map((item: any) => {
        if (item.history) {
            return {...item, status: 'offline'};
        }
        return { 
            ...item, 
            data: [] , 
            status: 'offline',
            lastMassage: ''
        };
    })
    localStorage.setItem('chats', JSON.stringify(data))
}

function changeHistorySattingR(state: any, token: any, setting: any) {
    const index = getIndexByToken(state, token);
    if (index < 0) return state;
    return changeObjectBetweenArray(state, { ...state[index], history: setting }, index);
}

function updateStatusR(state: any, token: any, status: any) {
    const index = getIndexByToken(state, token);
    if (index < 0) return state;
    return changeObjectBetweenArray(state, { ...state[index], status: status }, index);
}

function changeStatusR(state: any, token: any, id: any, status: any) {
    const chatIndex: number = getIndexByToken(state, token);
    if (chatIndex >= 0) {
        let tempData = {
            ...state[chatIndex],
            data: state[chatIndex].data.map((item: any) => {
                if (item.id == id) {
                    return { ...item, status: status }
                }
                return item;
            })
        };
        return changeObjectBetweenArray(state, tempData, chatIndex);
    } else {
        return state;
    }
}

function deletePerticulerChatR(state: any, token: any, id: any) {
    const chatIndex: number = getIndexByToken(state, token);
    const index: number = getIndexById(state[chatIndex].data, id);
    if (chatIndex < 0 || index < 0) return state;

    let tempData = {
        ...state[chatIndex],
        data: [
            ...state[chatIndex].data.slice(0, index),
            ...state[chatIndex].data.slice(index + 1)
        ]
    };
    return changeObjectBetweenArray(state, tempData, chatIndex);

}

function appendDataR(state: any, token: number, data: any, lastMassage: any) {
    const index = getIndexByToken(state, token);
    if (index >= 0) {
        const lastModified: any = new Date(state[index].modified);
        let datediff = dateDiffInDays(lastModified, new Date());

        if (datediff >= 1 || state[index].data.length == 0) {
            let obj = {
                type: 'sepretor',
                data: new Date().toString(),
            };
            var tempData = {
                ...state[index],
                lastMassage: lastMassage,
                data: [...state[index].data, obj, data],
                unread: state[index].unread + 1,
                modified: new Date().toString()
            }
        }
        else {
            var tempData = {
                ...state[index],
                lastMassage: lastMassage,
                data: [...state[index].data, data],
                unread: state[index].unread + 1,
                modified: new Date().toString()
            }
        }
        // console.log(state[index].data.length)
        return [
            tempData,
            ...state.slice(0, index),
            ...state.slice(index + 1),
        ];
    }
    return state;
}

function resetDataR(state: any, token: any) {

    const index = getIndexByToken(state, token);
    if (index >= 0) {
        let tempData = { ...state[index], data: [], unread: 0, lastMassage: ''}
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
    state = [
        ...state, 
        { 
            ...obj, 
            modified: state.created, 
            history: true,
            status: 'offline',
        }
    ];
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

function updateDataR(state: any, token: any, id: any, data: any) {
    const chatIndex: number = getIndexByToken(state, token);
    const index: number = getIndexById(state[chatIndex].data, id);
    if (chatIndex < 0 || index < 0) return state;
    let tempData = {
        ...state[chatIndex],
        data: [
            ...state[chatIndex].data.slice(0, index),
            { ...state[chatIndex].data[index], ...data },
            ...state[chatIndex].data.slice(index + 1)
        ]
    };
    return [
        tempData,
        ...state.slice(0, chatIndex),
        ...state.slice(chatIndex + 1),
    ];
}

function setProgressR(state: any, token: any, id: any, percentage: any) {
    const chatIndex: number = getIndexByToken(state, token);
    if (chatIndex >= 0) {
        let tempData = {
            ...state[chatIndex],
            data: state[chatIndex].data.map((item: any) => {
                if (item.id == id) {
                    return { ...item, percentage: percentage }
                }
                return item;
            })
        };
        return changeObjectBetweenArray(state, tempData, chatIndex);
    } else {
        return state;
    }
}

function changeObjectBetweenArray(state: any, tempData: any, index: any) {
    return [
        ...state.slice(0, index),
        tempData,
        ...state.slice(index + 1),
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

function getIndexById(state: any, id: any) {
    let index = -1;
    // console.log(state, id);
    state.forEach((item: any, i: any) => {
        if (item.id == id) {
            index = i;
            return;
        }
    })
    return index;
}