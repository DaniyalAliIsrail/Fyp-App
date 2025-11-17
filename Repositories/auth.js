import axios from "../utils/client";

export const auth = {
    signUp: (data) =>
    axios.post("user/Register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
    login: (data) => axios.post("user/login", data),
}
