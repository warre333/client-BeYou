import React, {useState, useEffect} from 'react'
import axios from 'axios'

import Header from '../components/header'
import FriendsList from '../components/friends/FriendsList'
import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import { getCookie, isAuthenticated } from '../functions/Common'

import { USERS } from '../config/api.config'

function Explore() {  
  const [popup, setPopup] = useState()
  const [friendsList, setFriendsList] = useState()
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  useEffect(() => {      
    async function auth(){
      await isAuthenticated()
        .then((response) => {
          if(response.success) {
            getFriends()
          } else {
            setPopup("login");
          }        
        })       
    }

    auth()
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