import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"

import ChatList from "../components/messages/ChatList"
import Header from "../components/header"

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { AUTH } from '../config/api.config'

const cookies = new Cookies();

function Messages() {
  const [user, setUser] = useState()
  const [popup, setPopup] = useState()
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  function getCookie(){
    if(cookies.get('user')){
      return cookies.get('user')
    }
  }  

  useEffect(() => {
    function isAuthenticated(){
      const cookies = getCookie()
  
      if(cookies){
        axios.get(AUTH,
          {
            headers: {
              "x-access-token": cookies
            },
          },
        ).then((response) => {
          if(response.data.success){
            setUser(response.data.user_id)
          }  else {
            setUser("none")
            setPopup("login")
            cookies.remove('user', { path: '/' });
          }
        })
      } else { 
        setUser("none")
        setPopup("login")
      }
    }

    isAuthenticated()
  }, [])

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error message={error} changeMessage={setError} /> )}
        { success && ( <Success message={success} changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}

        <ChatList setError={setError} error={error} />
        
        {/* Login & register popups */}
        { popup === "login" && (
          <Login setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading} />
        )}

        { popup === "register" && (
          <Register setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading}  />
        )}
        
    </div>
  )
}

export default Messages