import React, {useEffect, useState} from 'react'
import axios from 'axios'

import Header from '../components/header'
import PostList from '../components/posts/PostList'
import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import { getCookie, isAuthenticated } from '../functions/Common'

import { POSTS } from '../config/api.config'

function Homepage() {
  const [posts, setPosts] = useState()
  const [popup, setPopup] = useState("none")
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()


  useEffect(() => {    
    const isAuthenticatedResult = isAuthenticated()
    const user = getCookie()

    if (isAuthenticatedResult.success) {
      axios.get(POSTS + "feed", {
        headers: {
          "x-access-token": user
        },
      })
        .then((response) => {
          if(response.data.success){
            setPosts(response.data.data)
          } else {
            setError("An unkown error has occurred.")
          }              
        })
    } else {
      setPopup("login");
    }  
  }, [])
  
  
  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error message={error} changeMessage={setError} /> )}
        { success && ( <Success message={success} changeMessage={setSuccess} /> )}
        { loading && ( <Loading /> )}
        
        <PostList posts={posts} setError={setError} />  
        
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

export default Homepage