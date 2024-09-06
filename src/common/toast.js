import { toast } from "react-toastify";

export const toastHandler = (message, type) => {
  toast(message, {
    type,
  });
};
