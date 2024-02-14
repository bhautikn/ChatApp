import Swal from "sweetalert2";
import { deleteChat } from "./reducer/chat.action";

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