import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"

import useWindowDimensions from '../hooks/useWindowDimensions'

import Header from "../components/header"

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { AUTH } from '../config/api.config'

const styles = {
    profileImage: {
        height: "25vw",
        width: "25vw",
        objectFit: "cover",
    },
    profileImageDesktop: {
        height: "10vw",
        width: "10vw",
        objectFit: "cover",
    },
}

const cookies = new Cookies();

function Profile() {
    const [user, setUser] = useState()
    const [popup, setPopup] = useState()
    
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const [loading, setLoading] = useState()
  
    const [userInfo, setUserInfo] = useState({"user_id": 1, "username": "@warre002", "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquam congue fringilla. Phasellus aliquet porttitor placerat. Cras ligula odio, fringilla sit amet turpis in, semper lobortis metus. Phasellus id est odio. Morbi hendrerit enim et dui malesuada, a vulputate velit aliquam. Donec ut tortor dapibus, vulputate nulla rutrum, tristique ipsum.", "profile_image": "https://pbs.twimg.com/media/CmUPSBuUMAEvfoh.jpg", "verified": 0})
    const [userPosts, setUserPosts] = useState({"image": "https://cdn.discordapp.com/attachments/504315373969997835/975313956937801748/unknown.png", "caption": "tes caption"})
    
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
          )
        } else { 
          setUser("none")
          setPopup("login")
        }
      }
  
      isAuthenticated()
    }, [])

    // Screen sizing
    const { width, height } = useWindowDimensions();
    const [isOnMobile, setIsOnMobile] = useState(false)

    useEffect(() => {
        if(width < 768){
            setIsOnMobile(true)
        } else {
            setIsOnMobile(false)
        }
    })

    async function getUser(){
        // Get userid from auth 
    }

    async function getUserInfo(){
        // Get user info from api with userid
        // put in userinfo

        // Info, profile_image, bio, total followers, total posts
    } 

    async function getUserPosts(){
        // Get user posts from api with userid
        // put in userposts
    }

    useEffect(() => {
        if(!user){
            getUser()

        } else if(user && !userInfo){
            getUserInfo()

        } else if(user && !userPosts){
            getUserPosts()

        }
    })

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error changeMessage={setError} /> )}
        { success && ( <Success changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}

        <div className="container">
            {/* row met image daarnaast username, bio, edit profile button */}
            {/* Image + username */}
            <div className="row">
                <div className="col-4 col-md-auto text-end">
                    <img src={"https://pbs.twimg.com/media/CmUPSBuUMAEvfoh.jpg"} className="rounded-circle" style={isOnMobile ? styles.profileImage : styles.profileImageDesktop} alt="user profile" />
                </div>

                <div className="col ms-md-3">
                    <table className="h-100">
                        <tbody>
                            <tr>
                                <td className="align-middle">
                                    <h2 className="text-start ">{userInfo.username}</h2>
                                </td>
                            </tr>
                        </tbody>                        
                    </table>
                </div>
            </div>


            {/* bio + edit */}
            <div className="">
                {userInfo.bio}
            </div>



            {/* Posts grid */}
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

export default Profile