import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"

import Header from '../components/header'

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { ADMIN } from '../config/api.config'
import { useNavigate } from 'react-router-dom';

import Analytics from '../components/admin/Analytics'
import Users from '../components/admin/Users'
import Posts from '../components/admin/Posts'

const newCookies = new Cookies();

function Page() {
  const navigate = useNavigate()

  const [user, setUser] = useState()
  const [page, setPage] = useState('Analytics')
  const [popup, setPopup] = useState()
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  function getCookie(){
    if(newCookies.get('user')){
      return newCookies.get('user')
    }
  }  

  useEffect(() => {
    function isAuthenticated(){
      const cookies = getCookie()
  
      if(cookies){
        axios.get(ADMIN,
          {
            headers: {
              "x-access-token": cookies
            },
          },
        ).then((response) => {
          if(response.data.success){
            setUser(response.data.user_id)
          }  else {
            navigate("/")
          }
        })
      } else { 
        navigate("/")
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


        {/* 
        
            Page content

        */}          

        <div className="flex flex-row">
          <div className="w-1/5">
            <div className="bg-gray-100 mt-12 py-8 h-full w-full rounded-r-2xl flex flex-col">
              <button className="py-2 pl-6 border-t border-gray-200" onClick={(e) => { setPage('Analytics') }}>
                <p className="">Analytics</p>
              </button>
              <button className="py-2 pl-6 border-t border-gray-200" onClick={(e) => { setPage('Users') }}>
                <p className="">Users</p>
              </button>
              <button className="py-2 pl-6 border-y border-gray-200" onClick={(e) => { setPage('Posts') }}>
                <p className="">Posts</p>
              </button>
              {/* <button className="py-2 pl-6 border-b border-gray-200" onClick={(e) => { setPage('Advertisements') }}>
                <p className="">Advertisements</p>
              </button> */}
            </div>
          </div>

          { page === 'Analytics' && <Analytics />}
          { page === 'Users' && <Users />}
          { page === 'Posts' && <Posts />}
          {/* { page === 'Advertisements' && <Analytics />} */}
          
        </div>
        

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

export default Page