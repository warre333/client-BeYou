import React, {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'

import Header from '../components/header'
import FriendsList from '../components/friends/FriendsList'

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { AUTH } from '../config/api.config'

function Explore() {
  const cookies = new Cookies()
  
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

        <FriendsList />


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

export default Explore