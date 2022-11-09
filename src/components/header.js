import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie"

import { AUTH, PROFILE_IMAGE, USERS } from '../config/api.config';

import Logo from "../images/logo.png"
import Login from './auth/Login';
import Register from './auth/Register';

const styles = {
    header_container: {
        width: '100vw',
        margin: 0,
    },

    logo: {
        height: '80%',
        width: '60px',
        objectFit: 'cover',
    }
};

function Header() {
    const newCookies = new Cookies()
    const navigate = useNavigate()

    const [user, setUser] = useState()
    const [popup, setPopup] = useState()

    const [search, setSearch] = useState()

    function logout(){
        // Log out
        newCookies.remove("user", {path: "/"})
        setUser("")
        navigate("/")
        window.location.reload(false);
    }

    function getCookie(){
      if(newCookies.get('user')){
        return newCookies.get('user')
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
          )
            .then((response) => {
                if(response.data.success){
                    axios.get(USERS + "?user_id=" + response.data.user_id).then((response) => {
                        if(response.data.success){
                            setUser(response.data.data)
                        } else {                          
                          setUser("")
                        }
                    }) 
                } else {
                  setUser("")
                }         
            })
        } else {
          setUser("")
        }
      }
  
      isAuthenticated()
    }, [user])

    function handleLogin(){
      setPopup("login")
    }

    function handleEnterSearch(e){
      if (e.code == "Enter") {
        navigate('/search?keywords=' + search + '&page=1')
      }
    }

  return (
        <header className="p-1 mb-3 border-bottom bg-light">
            <div className="container">
                <div className="d-flex flex flex-row flex-wrap align-items-center justify-content-lg-start">
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                        <img src={Logo} alt="logo" style={styles.logo}/>
                    </a>

                    <ul className="nav col-auto col-lg-auto me-lg-auto mb-2  mb-md-0">
                        <li><a href="/explore" className="nav-link px-2 link-dark">Explore</a></li>
                        <li><a href="/friends" className="nav-link px-2 link-dark">Friends</a></li>
                        <li><a href="/messages" className="nav-link px-2 link-dark">Messages</a></li>
                        {/* Shopping page */}
                    </ul>

                    <div className='col-auto mb-0 me-3 ms-3 ms-lg-0'>
                        <input className="form-control" type="search" onKeyPress={handleEnterSearch} onChange={(e) => { setSearch(e.target.value) }} placeholder="Search..." aria-label="Search" />
                    </div>

                    {user && (
                      <div className="dropdown text-end">
                          <a href="/" className="d-block link-dark text-decoration-none" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={PROFILE_IMAGE + user.profile_image} alt="profile_image" width="32" height="32" className="rounded-circle" />
                          </a>
                          <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
                              <li><a className="dropdown-item" href={"/u/" + user.username}>Profile</a></li> 
                              <li><a className="dropdown-item" href="/create">Create Post</a></li>
                              <li><a className="dropdown-item" href="/settings">Settings</a></li>

                              <li><hr className="dropdown-divider" /></li>
                              <li><button className="dropdown-item" onClick={logout}>Sign out</button></li>
                          </ul>
                      </div>
                    )}
                    {!user && (
                        <div className="">
                            <button className="btn-primary btn" onClick={handleLogin}>Login</button>
                        </div>
                    )}
                </div>
            </div>



            {/* Login & register popups */}
            { popup === "login" && (
            <Login setPopup={setPopup} />
            )}

            { popup === "register" && (
            <Register setPopup={setPopup} />
            )}
        </header>

  )
}

export default Header