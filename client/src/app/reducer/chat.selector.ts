import { createSelector } from "@ngrx/store";

export const getAllChats = (state: any) => state;

export const getChatByIndex = (props:any) =>{
    return createSelector(
    getAllChats,
    (state:any) => state.chat[props.index]
    )
}

export const getChatByToken = (props:any) =>{
    return createSelector(
    getAllChats,
    (state:any) => {
        // console.log(state.chat.filter((item:any)=>item.token == props.token)[0]);
        return state.chat.filter((item:any)=>item.token == props.token)[0]
    }
    )
}