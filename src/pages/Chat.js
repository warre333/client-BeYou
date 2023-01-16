import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"
import { useParams } from 'react-router-dom'

import Header from '../components/header'

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { API_URL, AUTH } from '../config/api.config'
import { io } from 'socket.io-client'

const newCookies = new Cookies();


function Chat() {
  const params = useParams()
  const socket = io(API_URL, { transports : ['websocket', 'polling', 'flashsocket'] });
  
  const [user, setUser] = useState()
  const [chatroom, setChatroom] = useState(params.chatroom)
  const [joinedRoom, setJoinedRoom] = useState(false)
  const [popup, setPopup] = useState()
  
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
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

            const username = response.data.user_id
            socket.auth = { username }
            socket.connect()
          }  else {
            setUser("none")
            setPopup("login")
            newCookies.remove('user', { path: '/' });
          }
        })
      } else { 
        setUser("none")
        setPopup("login")
      }
    }

    isAuthenticated()
  }, [])

  useEffect(() => {
    if(!chatroom || !(user && user !== "none")) return
    socket.emit('leave', { user_id: user }, (error) => {
      if(error) {
        console.log(error);
      }
    });

    socket.emit('join', { user_id: user, chatroom }, (error) => {
      if(error) {
        console.log(error);
      }
    });

    setJoinedRoom(true)
  }, [chatroom, user]) 

  useEffect(() => {
    socket.on('message', message => {
      setMessages(msgs => [ ...msgs, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  });

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', { user_id: user, chatroom, message }, () => setMessage(''));
    }
  }

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
        {joinedRoom && (
          <div className="">
            {messages && messages.map((text, key) => {
              return <p className="text-black">{text.user}: {text.text}</p>
            })}
            <input type="text" className='border' onChange={(e) => { setMessage(e.target.value) }} name="" id="" />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
        {!joinedRoom && (
          Loading
        )}
        
        

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

export default Chat