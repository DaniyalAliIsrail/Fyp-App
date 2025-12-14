import axios from "../utils/client";

export const auth = {
    signUp: (data) =>
    axios.post("user/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
    login: (data) => axios.post("user/login", data),
    verifyOTP: (data) => axios.post("user/verify-otp", data),
    resendOTP: (data) => axios.post("user/resend-otp", data),
    resetPassword: (data) => axios.put("user/reset-password", data),
}
