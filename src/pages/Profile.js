import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"
import { Navigate, useNavigate, useParams } from "react-router-dom"

import useWindowDimensions from '../hooks/useWindowDimensions'

import Header from "../components/header"

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { AUTH, CHAT, PROFILE_IMAGE, USERS } from '../config/api.config'
import Edit from '../components/profile/Edit'
import PreviewPost from '../components/posts/PreviewPost'

// const styles = {
//     profileImage: {
//         height: "25vw",
//         width: "25vw",
//         objectFit: "cover",
//     },
//     profileImageDesktop: {
//         height: "10vw",
//         width: "10vw",
//         objectFit: "cover",
//     },
// }

const newCookies = new Cookies();

function Profile() {
  const navigate = useNavigate()

    const [user, setUser] = useState()
    const [popup, setPopup] = useState()
    
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const [loading, setLoading] = useState()
  
    const [profileInfo, setProfileInfo] = useState()
    const [profileTotalFollowers, setProfileTotalFollowers] = useState()
    const [profileTotalLikes, setProfileTotalLikes] = useState()
    const [profileTotalPosts, setProfileTotalPosts] = useState()
    const [verified, setVerified] = useState()
    const [profilePosts, setProfilePosts] = useState()
    const [isUserFollowing, setIsUserFollowing] = useState()
    
    const params = useParams()

    const profileUsername = params.username

    function getCookie(){
      if(newCookies.get('user')){
        return newCookies.get('user')
      }
    }  
  
    useEffect(() => {
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
          } else {
            newCookies.remove('user', { path: '/' });
          }
        })
      } 
    }, [user])

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

    function getUserInfo(){
      // Get user info from api with userid
      // put in userinfo

      // Info, profile_image, bio, total followers, total posts
      axios.get(USERS + "profile?username=" + profileUsername)
        .then((response) => {
          console.log(response.data);
          if(response.data.success){
            setProfileInfo(response.data.data.user_info[0])
            setProfilePosts(response.data.data.posts)
            setProfileTotalFollowers(response.data.data.total_followers)
            setProfileTotalLikes(response.data.data.total_likes)
            setProfileTotalPosts(response.data.data.total_posts)
            if(response.data.data.user_info[0].verified == 1){
              setVerified(true)
            } else {
              setVerified(false)
            }

            amIFollowingThisUser(response.data.data.user_info[0].user_id)
          } else {
            setError(response.data.message)
          }
        })
    } 

    function amIFollowingThisUser(user_id){
      const cookies = getCookie()

      axios.get(USERS + "friends/is-following?user_id=" + user_id,{
        headers: {
          "x-access-token": cookies
        },
      },)
        .then((response) => {
          if(response.data.success){
            if(response.data.is_following){
              setIsUserFollowing(true)
            } else {
              setIsUserFollowing(false)
            }
          }
        })
    }

    function handleFollow(){
      const cookies = getCookie()

      axios.post(USERS + "friends", {
        user_id: profileInfo.user_id
      },{
        headers: {
          "x-access-token": cookies
        },
      },)
        .then((response) => {
          if(response.data.success){
            setIsUserFollowing(true)
            setProfileTotalFollowers(profileTotalFollowers + 1)
          } else {
            setIsUserFollowing(false)
          }
        })
    }

    function handleUnfollow(){
      const cookies = getCookie()

      axios.delete(USERS + "friends?user_id=" + profileInfo.user_id, {
        headers: {
          "x-access-token": cookies
        },
      },)
        .then((response) => {
          if(response.data.success){
            setIsUserFollowing(false)
            setProfileTotalFollowers(profileTotalFollowers - 1)
          } else {
            setIsUserFollowing(true)
          }
        })
      
    }

    function handleMessage(){
      const cookies = getCookie()

      axios.post(CHAT, {
        user_id: profileInfo.user_id
      }, {
        headers: {
          "x-access-token": cookies
        },
      },)
        .then((response) => {
          console.log(response);
          if(response.data.success){
            navigate("/chat/" + response.data.chatroom_id)
          } else {
          }
        })
      
    }

    useEffect(() => {
      if(!profileInfo || !profilePosts){
        getUserInfo()
        setLoading(true)
      } else {
        setLoading(false)
      }
    })

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error message={error} changeMessage={setError} /> )}
        { success && ( <Success message={success} changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}

        <div className="container mx-auto">
            {/* row met image daarnaast username, bio, edit profile button */}
            {/* Image + username */}
            <div className="flex flex-row pr-4">
                <div className="text-right w-1/3 md:w-1/4 lg:w-1/5 flex justify-center align-middle">
                  {profileInfo && ( <img src={PROFILE_IMAGE + profileInfo.profile_image} alt="profile_image" className="object-cover w-[15vw] h-[15vw] md:w-[10vw] md:h-[10vw] aspect-square rounded-full" /> )}
                </div>

                <div className="ml-3 w-full">
                    <table className="h-1/2">
                        <tbody>
                            <tr>
                                <td className="align-middle">
                                  {profileInfo && (<h2 className="text-start font-bold text-2xl">{profileInfo.username}</h2>)}
                                </td>
                                <td className="align-middle">                         
                                  {verified && (
                                    <div className="pl-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
                                        <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                      </svg>
                                    </div>
                                  )}
                                </td>
                            </tr>
                        </tbody>                        
                    </table>
                      <div className="flex flex-row h-1/4 justify-between text-center w-full">
                        <div className="align-middle">                                  
                          <p className="">Followers</p>
                          {profileTotalFollowers && (<p className="">{profileTotalFollowers}</p>)}
                        </div>
                        <div className="align-middle">                                  
                          <p className="">Posts</p>
                          {profileTotalPosts && (<p className="">{profileTotalPosts}</p>)}
                        </div>
                        <div className="align-middle">                                  
                          <p className="">Likes</p>
                          {profileTotalLikes && (<p className="">{profileTotalLikes}</p>)}
                        </div>
                      </div>
                </div>
            </div>


            {/* bio + edit */}
            <div className="mx-2 my-8">
              {profileInfo && (<p>{profileInfo.bio}</p>) } 
            </div>

            <div className="m-2">
               {user && profileInfo && user === profileInfo.user_id && ( 
                 <div className="">
                   <button className="py-1 px-4 bg-light rounded-xl border w-full" onClick={(e) => { setPopup("edit_profile") }} >Edit profile</button>
                 </div>
               )}
               {user && profileInfo && user !== profileInfo.user_id && !isUserFollowing && ( 
                 <div className="">
                   <button className="py-1 px-4 bg-blue-500 text-white rounded-xl border w-full" onClick={handleFollow} >Follow</button>
                 </div> 
               )}
               {user && profileInfo && user !== profileInfo.user_id && isUserFollowing && ( 
                 <div className="flex flex-row">
                   <button className="mr-2 py-1 px-4 btn-light rounded-xl border w-full" onClick={handleUnfollow} >Unfollow</button>
                   <button className="ml-2 py-1 px-4 btn-light rounded-xl border w-full" onClick={handleMessage} >Message</button>
                 </div>
               )}
            </div>

            {popup && popup == "edit_profile" && <Edit profile={profileInfo} setPopup={setPopup} changeProfile={setProfileInfo} />}

            <div className="border-b mt-4"></div>



            {/* Posts grid */}
            <div className="my-5">
              <div className="grid grid-cols-3 gap-4">

                {profilePosts && profilePosts.length > 0 && (
                  profilePosts.map((post, key) => {
                    return <PreviewPost image={post.media_link} post_id={post.post_id} key={key} />
                  })
                )}

                {profilePosts && profilePosts.length == 0 && (
                  <h4 className="w-full text-center">No posts are found...</h4>
                )}

              </div>
              
            </div>
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