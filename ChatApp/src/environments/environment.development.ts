import Swal from "sweetalert2";

const devUrl:string = 'http://'+window.location.hostname+':3000/';
// const devUrl = 'https://fuzzy-disco-r44g6q4g57jfjvj-3000.app.github.dev/';

export const environment = {
    soketUrl: devUrl,
    apiUrl: devUrl,
    production: false,
    gif_api:'https://g.tenor.com/v1/',
    gif_api_key: 'LIVDSRZULELA'
};

export const formateTime = (date:any) => {
    const curruntDate:any = new Date();
    date = new Date(date);
    var seconds = Math.floor((curruntDate - date) / 1000);
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

export function formatAMPM(date: Date) {
  var hours: any = date.getHours();
  var minutes: any = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function setChat(newChat: any) {
  let chats = getChats()
  chats.push(newChat);
  localStorage.setItem('chats', JSON.stringify(chats));
}

export function getChats() {
  if (!localStorage['chats']) {
    let arr: any = [];
    localStorage['chats'] = JSON.stringify(arr);
  }
  return JSON.parse(localStorage['chats']);
}

export function updateChat(chats:any){
  localStorage.setItem('chats', JSON.stringify(chats));
}
export function tost(props:any) {
  var toastMixin = Swal.mixin({
    toast: true,
    animation: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  toastMixin.fire(
    props
  );
}