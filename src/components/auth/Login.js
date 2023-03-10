import React, {useState, useEffect} from 'react'
import sha256 from 'js-sha256'
import axios from 'axios'
import Cookies from 'universal-cookie'

import { AUTH } from '../../config/api.config'

import Error from '../states/Error'
import Success from '../states/Success'
import Loading from '../states/Loading'
import useWindowDimensions from '../../hooks/useWindowDimensions'

const styles = {
    opacityBackground: {
        background: "rgba(33, 37, 41, .4)",
    },

    center: {
        top: "25%",
        left: "25%",
    },

    centerWhiteCard: {
        top: "25%",
        left: "25%",        
        borderRadius: "10px",
    },

    centerWhiteCardMobile: {
        top: "25%",     
    },

    marginLeft25: {
        marginLeft: "12.5%",
    },
}

function Login(props) {    
    const newCookies = new Cookies()

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [viewPassword, setViewPassword] = useState()

    async function login(){
        setLoading(true)

        if(username){
            if(password){
                console.log(username, password)
                axios.post(AUTH + "login", {           
                    username: username,
                    password: password,
                })
                    .then((response) => {
                        if(response.data.success){
                            setLoading(false)
                            setError("")
                            newCookies.set("user", response.data.token, { path: '/' })
                            props.setPopup("none")

                            if(response.data.role){
                                setLoading(false)
                                setError("")
                                newCookies.set("user", response.data.token, { path: '/' })
                                props.setPopup("none")
                                window.location.reload(false);
                            } else {
                                window.location.reload(false);
                            }
                        } else {
                            setLoading(false)
                            setError(response.data.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                setLoading(false)
                setError("You should enter a password")
            }
        } else {
            setLoading(false)
            setError("You should enter a username")
        }
    }

    // Screen sizing
    const { width } = useWindowDimensions();
    const [isOnMobile, setIsOnMobile] = useState(false)

    useEffect(() => {
        if(width < 768){
            setIsOnMobile(true)
        } else {
            setIsOnMobile(false)
        }
    })


  return (
    <div className='w-screen h-screen top-0 start-0 fixed mx-auto my-auto' style={styles.opacityBackground}>
        {/* Darkend background */}
        <div className="w-full top-[25%] md:left-[25%] md:w-1/2 h-1/2 fixed bg-light rounded-3xl" >

            {/* centered white space */}
            <div className="h-full">
                <h1 className="text-center text-xl font-bold m-4">Login</h1>
                
                {!loading && (
                    <div className="w-2/3 mx-auto p-2">
                        {error && ( <p className='w-full text-center text-orange-300'>{error}</p> )}

                        <label htmlFor="username" className="text-left w-full ml-4">Username</label>
                        <input type="text" name="username" id="username" className="w-full mb-2 py-1 px-4 border border-gray-200 focus:border-none bg-white rounded-2xl" onChange={(e) => { setUsername(e.target.value)}} />

                        <label htmlFor="password" className="text-left w-full ml-4">Password</label>
                        <div className="w-full mb-2 border border-gray-200 focus:border-none bg-white py-1 rounded-2xl flex flex-row">
                            <input type={viewPassword ? "test" : "password"} name="password" id="password" className="w-full ml-4 mr-2" onChange={(e) => { setPassword(sha256(e.target.value))}} />

                            <button className="mr-3" 
                                onClick={() => { 
                                    if(viewPassword){
                                        setViewPassword(false) 
                                    } else {
                                        setViewPassword(true)
                                    }
                                }}>
                                {!viewPassword && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"></path>
                                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"></path>
                                    </svg>
                                )}

                                {viewPassword && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
                                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="flex flex-row mt-4">
                            <div className="w-full md:w-1/2 mr-0 md:mr-1">
                                <button className="w-full text-center bg-blue-500 rounded-full py-1 text-white" onClick={login}>Login</button>
                            </div>

                            <div className="w-full md:w-1/2 ml-0 md:ml-1">
                                <button className="w-full text-center bg-gray-300 rounded-full py-1" onClick={() => { props.setPopup("register") }}>Register</button>
                            </div>
                        </div>  
                    </div>
                )} 

                {loading && (
                    <Loading />
                )}
            </div>
        </div>
    </div>
  )
}

export default Login