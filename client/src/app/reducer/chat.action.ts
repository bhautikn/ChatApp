import { createAction, props } from "@ngrx/store";

export const loadChats = createAction('[Chat Component] LoadChats');
export const resetChatData = createAction('[Chat Component] Reset', props<{ token:any }>());
export const setChatName = createAction('[Chat Component] set chat name', props<{ token:any, name: string }>());
export const appendData = createAction('[Chat Component] append data', props<{ token:any, data: any, lastMassage: any}>());
export const updateData = createAction('[Chat Component] update data', props<{ token:any, id: any, data: any}>());
export const deleteChat = createAction('[Chat Component] delete chat', props<{ index:any }>());
export const resetresetUnreadToZero = createAction('[Chat Component] reset unread zero', props<{ token:any }>());
export const addChat = createAction('[Chat Component] add chat', props<{ chatObj:any }>());
export const deletePerticulerChat = createAction('[Chat Component] delete one chat', props<{token: any, id: any}>());
export const changeStatus = createAction('[Chat Component] massage sended server', props<{token: any, id: any, status:any}>());
export const setProgress = createAction('[Chat Component] set sended chat progress', props<{token: any, id: any, progress: any}>());
export const changeHistorySatting = createAction('[Chat Component] change history setting', props<{token: any, setting: any}>());
export const updateStatus = createAction('[Chat Component] update chat status', props<{token: any, status: any}>());
export const commit = createAction('[Chat Component] commit');

