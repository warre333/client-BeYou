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

import { AUTH, USERS } from '../config/api.config'

function Explore() {
  const cookies = new Cookies()
  
  const [user, setUser] = useState()
  const [popup, setPopup] = useState()

  const [friendsList, setFriendsList] = useState()
  
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
      const user = getCookie()
  
      if(user){
        axios.get(AUTH,
          {
            headers: {
              "x-access-token": user
            },
          },
        ).then((response) => {
          if(response.data.success){
            setUser(response.data.user_id)
            getFriends()
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

  function getFriends(){
    const user = getCookie()

    if(user){
      axios.get(USERS + "friends", 
      {
        headers: {
          "x-access-token": user
        },
      })
        .then((response) => {
          console.log(response.data);

          if(response.data.success){
            setFriendsList(response.data.data)
          } else {
            setError(response.data.message)
          }
        })
    } else {
      setError("You should be logged in to see your friend list.")
    }    
  }

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error message={error} changeMessage={setError} /> )}
        { success && ( <Success message={success} changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}

        <FriendsList friendsList={friendsList} />


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