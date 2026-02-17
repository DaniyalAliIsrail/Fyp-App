import axios from "../utils/client"

export const locationApi = {
    shareLocation:(data) => axios.post("user/location",data)
}