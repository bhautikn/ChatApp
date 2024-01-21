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