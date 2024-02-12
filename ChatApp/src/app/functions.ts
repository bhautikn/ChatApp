import { formatAMPM } from "../environments/environment.development";

export function genrateData(miamitype: string, fromOrTo: string, data: any): string {

    let forVideo = `
      <video width="320" height="240" class="text" controls>
        <source src='${data}' type="video/mp4" >
      </video> <br>
    `;
    let forImage = `
      <img src='${data}' class="text"> <br>
    `;
    let forText = `
      <div class="text">${data}</div>
    `;
    let forOther = `
      <div></div>
    `
    switch (miamitype) {
      case 'text':
        return getStrBydata(forText, fromOrTo);
      case 'image':
        return getStrBydata(forImage, fromOrTo);
      case 'video':
        return getStrBydata(forVideo, fromOrTo);
      default:
        return ''
    }
  }
  export function getStrBydata(data: string, fromOrTo: string) {
    let child = `
      <div class="row">
          <div class="${fromOrTo}">
              <div class="massage">
                ${data}
                <div class="time">${formatAMPM(new Date())}</div>
              </div>
          </div>
      </div>
    `;
    return child;
  }

  export function decodeHTMLEntities (str:any) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
    }
  
    return str;
  }