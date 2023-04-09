import axios from "axios"
import Cookies from "universal-cookie"

import { ADMIN, AUTH } from "../config/api.config"

const cookies = new Cookies()

export function getCookie(){
    if(cookies.get('user')){
      return cookies.get('user')
    }
}  

export function isAdmin(){
    const user = getCookie()

    if (user) {
        axios.get(ADMIN,{
            headers: {
                "x-access-token": user
            },
        })
            .then((response) => {
                if(response.data.success){
                    return {success: true, data: response.data.user_id}
                } else {
                    return {success: false, data: response.data.message}
                }
            })} 
    else {
        return {success: false, message: "You're not logged in."}
    }
}

export function isAuthenticated() {
    const user = getCookie();

    if (user) {
      axios
        .get(AUTH, {
          headers: {
            "x-access-token": user,
          },
        })
        .then((response) => {
          if (response.data.success) {
            return {success: true, data: {user_id: response.data.user_id, role: response.data.role}}
          } else {
            cookies.remove("user", { path: "/" });
            return {success: false, message: response.data.message}
          }
        });
    } else {
        return {success: false, message: "You're not logged in."}
    }
}