import Swal from "sweetalert2";
import { appendData, changeStatus, deleteChat } from "./reducer/chat.action";

export function decodeHTMLEntities(str: any) {
  if (str && typeof str === 'string') {
    // strip script/html tags
    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
  }
  return str;
}

export async function deleteChatByToken({ urlToken, authToken, api, store, curruntIndex }: any) {
  await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      api.deleteChat(urlToken, authToken).subscribe((data: any) => {
        if (data.ok == 200) {
          store.dispatch(deleteChat({ index: curruntIndex }))
        }
      });
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
  });
}

export function sendDataToFreind(obj: any, _chat: any, authToken: any, urlToken: any, store: any) {

  //todo: change status after 20 seconds if not received fix this

  // store.select(getAllChats).subscribe((data: any) => {
  //   setTimeout(() => {
  //     const filterddata = data.chat.find((e: any) => e.token == urlToken);
  //     const tempData = filterddata.data.find((e: any) => e.id == obj.id);
  //     console.log(tempData, 'tempData.status', tempData.status == 'pending');
  //     if (tempData.status == 'pending') {
  //       store.dispatch(changeStatus({ token: urlToken, id: obj.id, status: 'failed' }));
  //     }
  //   }, 20 * 1000);
  // })

  _chat.send(obj.sendableData, obj.type, authToken, obj.id, (data: any) => {
    if (data) {
      store.dispatch(changeStatus({ token: urlToken, id: data.id, status: data.status }));
    } else {
      store.dispatch(changeStatus({ token: urlToken, id: obj.id, status: 'failed' }));
    }
  });

  store.dispatch(appendData({ token: urlToken, data: obj }));
}