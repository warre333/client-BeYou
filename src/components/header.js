import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie"

import Logo from "../images/logo.png"
import Login from './auth/Login';
import Register from './auth/Register';
import { isAuthenticated } from '../functions/Common';

import { AUTH, PROFILE_IMAGE, USERS } from '../config/api.config';

const styles = {
    header_container: {
        width: '100vw',
        margin: 0,
    },

    logo: {
        height: '80%',
        width: '80px',
        objectFit: 'cover',
    }
};

function Header() {
    const newCookies = new Cookies()
    const navigate = useNavigate()

    const [user, setUser] = useState()
    const [role, setRole] = useState()
    const [popup, setPopup] = useState()
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [search, setSearch] = useState()

    function logout(){
        newCookies.remove("user", {path: "/"})
        setUser("")
        navigate("/")
        window.location.reload(false);
    }
  
    useEffect(() => {
      async function auth(){
        await isAuthenticated()
          .then((response) => {
            if(response.success){
              setRole(response.data.role)
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
      }

      auth()
    }, [user])

    function handleLogin(){
      setPopup("login")
    }

    function handleEnterSearch(e){
      if (e.code === "Enter") {
        navigate('/search?keywords=' + search + '&page=1')
      }
    }

    function handleOpenMenu(){
      if(isProfileMenuOpen){
        setIsProfileMenuOpen(false)
      } else {
        setIsProfileMenuOpen(true)
      }
    }

    function handleOpenMenuMobile(){
      if(isMenuOpen){
        setIsMenuOpen(false)
      } else {
        setIsMenuOpen(true)
      }
    }

  return (
        <header className="p-1 mb-3 border-bottom bg-gray-100">
          <div className="hidden md:block container mx-auto">
            <div className="flex flex-row align-center justify-between">
              <a href="/" className="flex align-center my-auto text-decoration-none">
                <img src={Logo} alt="logo" style={styles.logo}/>
              </a>

              <ul className="flex flex-row mr-auto my-auto ">
                <li><a href="/explore" className="nav-link px-2 link-dark">Explore</a></li>
                <li><a href="/friends" className="nav-link px-2 link-dark">Friends</a></li>
                <li><a href="/messages" className="nav-link px-2 link-dark">Messages</a></li>
                {role === "admin" && <li><a className="nav-link px-2 link-dark" href="/admin">Admin</a></li>}
              </ul>

              <div className='my-auto'>
                <input className="border rounded-2xl px-2 py-1" type="search" onKeyPress={handleEnterSearch} onChange={(e) => { setSearch(e.target.value); console.log(e.target.value); }} placeholder="Search..." aria-label="Search" />
              </div>

              {user && (
                <div className="text-end my-auto ml-2 relative">
                  <button onClick={handleOpenMenu}>
                    <img src={PROFILE_IMAGE + user.profile_image} alt="profile_image" width="50" height="50" className="object-cover w-10 h-10 rounded-full" />
                  </button>

                  {isProfileMenuOpen && (
                    <ul className="absolute mt-4 mx-auto right-0 xl:-right-8 text-center bg-gray-100 p-1 border border-gray-200 rounded-lg text-small">
                      <li><a className="" href={"/u/" + user.username}>Profile</a></li> 
                      <li><a className="" href="/create">Create&nbsp;post</a></li>
                      <li><a className="" href="/ads">Advertisements</a></li>
                      <li><a className="" href="/settings">Settings</a></li>

                      <li><hr /></li>

                      <li><button className="text-red-500" onClick={logout}>Sign out</button></li>
                    </ul>
                  )}                  
                </div>
              )}
              {!user && (
                <div className="my-auto">
                  <button className="bg-blue-500 ml-2 py-1 px-4 rounded-full text-white" onClick={handleLogin}>Login</button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden container mx-auto">
            <div className="flex flex-row align-center justify-between">
              <a href="/" className="flex align-center my-auto text-decoration-none">
                <img src={Logo} alt="logo" style={styles.logo}/>
              </a>

              <button className='' onClick={handleOpenMenuMobile}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>

              {isMenuOpen && (
                <div className="fixed top-14 left-0 bg-gray-100 w-screen h-screen">
                  <div className="w-1/2 mt-6 text-center mx-auto">
                    <a href="/explore" className="link-dark"><p className="p-2">Explore</p></a>
                    <hr className="" />
                  </div>
                  <div className="w-1/2 mt-2 text-center mx-auto">
                    <a href="/friends" className="link-dark"><p className="p-2">Friends</p></a>
                    <hr className="" />
                  </div>
                  <div className="w-1/2 mt-2 text-center mx-auto">
                    <a href="/messages" className="link-dark"><p className="p-2">Messages</p></a>
                    <hr className="" />
                  </div>
                  <div className="w-1/2 mt-4 text-center mx-auto">
                    {user && (
                      <div className="text-center my-auto ml-2 relative">
                        <button onClick={handleOpenMenu}>
                          <img src={PROFILE_IMAGE + user.profile_image} alt="profile_image" width="50" height="50" className="object-cover w-10 h-10 rounded-full" />
                        </button>

                        {isProfileMenuOpen && (
                          <ul className="absolute mt-4 mx-auto right-8 text-center bg-gray-100 p-1 border border-gray-200 rounded-lg text-small">
                            <li><a className="" href={"/u/" + user.username}>Profile</a></li> 
                            <li><a className="" href="/create">Create&nbsp;post</a></li>
                            <li><a className="" href="/settings">Settings</a></li>

                            <li><hr /></li>

                            <li><button className="text-red-500" onClick={logout}>Sign out</button></li>
                          </ul>
                        )}                  
                      </div>
                    )}
                    {!user && (
                      <div className="my-auto">
                        <button className="bg-blue-500 ml-2 py-1 px-4 rounded-full text-white" onClick={handleLogin}>Login</button>
                      </div>
                    )}
                  </div>
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