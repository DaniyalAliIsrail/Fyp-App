import axios from "../utils/client";

export const pushApi = {
  saveExpoPushToken: (expo_push_token) =>
    axios.post("user/push-token", { expo_push_token }),
};
