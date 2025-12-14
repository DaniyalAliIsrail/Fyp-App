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
    forgetPassword: (data) => axios.post("user/forget-password", data),
    verifyForgetPasswordOTP: (data) => axios.post("user/verify-forget-password-otp", data),
    resetPasswordWithToken: (data) => axios.post("user/reset-password-with-token", data),
}
