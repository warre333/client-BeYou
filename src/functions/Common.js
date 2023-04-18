import axios from "axios"
import Cookies from "universal-cookie"

import { ADMIN, AUTH } from "../config/api.config"

const cookies = new Cookies()

export function getCookie(){
    if(cookies.get('user')){
      return cookies.get('user')
    }
}  

export function isAdmin() {
    const user = getCookie()

    if (user) {
        return new Promise(function (resolve, reject) {
            axios.get(ADMIN,{
                headers: {
                    "x-access-token": user
                },
            })
                .then((response) => {
                    if(response.data.success){
                        resolve({success: true, data: response.data.user_id})
                    } else {
                        resolve({success: false, data: response.data.message})
                    }
                })
        })
    } else {
        return {success: false, message: "You're not logged in."}
    }
}

export function isAuthenticated() {
    const user = getCookie();

    if (user) {
        return new Promise(function (resolve, reject) {
            axios.get(AUTH, {
                headers: {
                    "x-access-token": user,
                },
            })
                .then((response) => {
                    if (response.data.success) {
                        resolve({success: true, data: {user_id: response.data.user_id, role: response.data.role}})
                    } else {
                        cookies.remove("user", { path: "/" });
                        resolve({success: false, message: response.data.message})
                    }
                })
        })
    } else {
        return {success: false, message: "You're not logged in."}
    }
}