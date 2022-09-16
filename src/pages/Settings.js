import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"
import sha256 from 'js-sha256'

import Header from '../components/header'

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { AUTH, USERS } from '../config/api.config'

const newCookies = new Cookies();

function Page() {
  const [user, setUser] = useState()
  const [popup, setPopup] = useState()

  const [oldPassword, setOldPassword] = useState()
  const [newPassword, setNewPassword] = useState()
  const [newEmail, setNewEmail] = useState()
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  function getCookie(){
    if(newCookies.get('user')){
      return newCookies.get('user')
    }
  }  

  function handleOldPassword(e){
    setOldPassword(sha256(e.target.value))
  }

  function handleNewPassword(e){
    setNewPassword(sha256(e.target.value))
  }

  function handleNewEmail(e){
    setNewEmail(e.target.value)
  }

  function changePassword(){
    const user = getCookie()

    axios.patch(USERS + "password", {
      old_password: oldPassword,
      new_password: newPassword
    }, {
      headers: {
        "x-access-token": user
      },
    },)
      .then((response) => {
        if(response.data.success){
          setSuccess(response.data.message)
        } else {
          setError(response.data.message)
        }
      })
  }

  function changeEmail(){
    const user = getCookie()

    axios.patch(USERS + "email", {
      new_email: newEmail,
    }, {
      headers: {
        "x-access-token": user
      },
    },)
      .then((response) => {
        if(response.data.success){
          setSuccess(response.data.message)
        } else {
          setError(response.data.message)
        }
      })

      .catch((err) => {
        console.log(err)
      })
  }

  function logout(){
      // Log out
      newCookies.remove("user", {path: "/"})
      setUser("")
      window.location.reload(false);
  }

  function terminateAccount(){
    const user = getCookie()

    axios.delete(USERS, {
      headers: {
        "x-access-token": user
      },
    },)
      .then((response) => {
        if(response.data.success){
          logout()

          setSuccess(response.data.message)
        } else {
          setError(response.data.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
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


        {/* 
        
            Page content

        */}
        <div className="w-50 mx-auto">
          <h3 className="">Change password</h3>

          <label htmlFor="" className="">Old password</label>
          <input type="password" className="form-control" onChange={handleOldPassword} />

          <br />
          
          <label htmlFor="" className="">New password</label>
          <input type="password" className="form-control" onChange={handleNewPassword} />
          
          <br />

          <input type="submit" value="Change password" onClick={changePassword} className='btn btn-primary' />

          <br />
          <br />
          <br />

          <h3 className="">Change email address</h3>

          <label htmlFor="" className="">New email address</label>
          <input type="email" onChange={handleNewEmail} className="form-control" />
          
          <br />

          <input type="submit" onClick={changeEmail} value="Change email" className='btn btn-primary' />

          <br />
          <br />
          <br />
          <br />

          <input type="text" onClick={terminateAccount} value="TERMINATE ACCOUNT" className='btn border border-danger text-danger text-center rounded' />
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