import Swal from "sweetalert2";
import { appendData, changeStatus, deleteChat, setProgress, updateData } from "./reducer/chat.action";

export function decodeHTMLEntities(str: any) {
  if (str && typeof str === 'string') {
    // strip script/html tags
    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
  }
  return str;
}

export async function deleteChatByToken({ urlToken, authToken, api, store, curruntIndex }: any) {
  let res = false;
  await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    customClass: 'swal-background',
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      res = true;
      api.deleteChat(urlToken, authToken).subscribe((data: any) => {
        if (data.ok == 200) {
          store.dispatch(deleteChat({ index: curruntIndex }));
        }
      });
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
        customClass: 'swal-background',
      });
    }
  });
  return res;
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
  // let tempObj = { ...obj }
  // delete tempObj.sendableData;
  // delete tempObj.status;
  // delete tempObj.lastMassage;
  // delete tempObj.data;

  // // console.log(tempObj)

  // _chat.sendFile(authToken, obj.sendableData, tempObj, [
  //   (data: any) => {
  //     store.dispatch(setProgress({ token: urlToken, id: obj.id, progress: data }))
  //   }, () => {
  //     store.dispatch(changeStatus({ token: urlToken, id: obj.id, status: 'sent' }));
  //     console.log('finished tranfer ...')
  //   }, () => {
  //     store.dispatch(changeStatus({ token: urlToken, id: obj.id, status: 'seen' }));
  //     console.log('recive data to opponent')
  //   }
  // ]);
  // store.dispatch(changeLastMassage({token: urlToken, massage: obj.lastMassage}));

  store.dispatch(appendData({ token: urlToken, data: obj, lastMassage: obj.lastMassage }));
}

export function editDataToFreind(obj: any, _chat: any, authToken: any, urlToken: any, store: any){
  _chat.edit(obj.data, authToken, obj.id, (data: any) => {
    if (data) {
      store.dispatch(changeStatus({ token: urlToken, id: data.id, status: data.status }));
    } else {
      store.dispatch(changeStatus({ token: urlToken, id: obj.id, status: 'failed' }));
    }
  });
  store.dispatch(updateData({ token: urlToken, data: obj, id: obj.id}));
}

export function formateDate(date: any) {
  const date_t = new Date(date);
  return date_t.getDay() + '/' + date_t.getMonth() + '/' + date_t.getFullYear();
}

export function formatAMPM(date: any) {
  date = new Date(date);
  var hours: any = date.getHours();
  var minutes: any = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function getChats() {
  if (!localStorage['chats']) {
    let arr: any = [];
    localStorage['chats'] = JSON.stringify(arr);
  }
  return JSON.parse(localStorage['chats']);
}

export function tost(props: any, animation: boolean = false) {

  var toastMixin = Swal.mixin({
    toast: true,
    animation: animation,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  setTimeout(() => {
    toastMixin.fire(
      props
    );
  }, 50)
}

export const formateTime = (date: any) => {
  const curruntDate: any = new Date();
  date = new Date(date);
  var seconds = Math.floor((curruntDate - date) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return formateDate(date);
  }
  interval = seconds / 2592000;

  if (interval > 1) {
    return formateDate(date);
  }
  interval = seconds / 86400;
  if (interval > 1) {
    interval = Math.floor(interval);
    if (interval == 1) {
      return 'tommorow';
    }
    return formateDate(date)
    // console.log(interval + " days ago")
    // return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return formatAMPM(date);
  }
  interval = seconds / 60;
  if (interval > 1) {
    return formatAMPM(date);
  }
  return "now";
}

export const formateTime2 = (date: any) => {
  const curruntDate: any = new Date();
  date = new Date(date);
  let diff = dateDiffInDays(date, curruntDate)
  if (diff == 0) {
    return 'today';
  }
  if (diff == 1) {
    return 'tommorow';
  }
  return formateDate(date);
}

export function dateDiffInDays(date1: any, date2: any) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}