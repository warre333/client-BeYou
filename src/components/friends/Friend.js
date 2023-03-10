import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { CHAT, PROFILE_IMAGE } from '../../config/api.config'

const styles = {
    image: {
        objectFit: "contain",
    },
    
    button: {    
      background: "none",
      color: "inherit",
      border: "none",
      padding: 0,
      font: "inherit",
      cursor: "pointer",
      outline: "inherit",
    },
  
    postComment: {
      height: "4vh",
    },
}

function Friend(props) {
    const newCookies = new Cookies()
    const navigate = useNavigate()

    function getCookie(){
      if(newCookies.get('user')){
        return newCookies.get('user')
      }
    }   

    function handleMessage(){
        const cookies = getCookie()
  
        axios.post(CHAT, {
          user_id: props.user_id
        }, {
          headers: {
            "x-access-token": cookies
          },
        },)
          .then((response) => {
            console.log(response);
            if(response.data.success){
              navigate("/messages/" + response.data.chatroom_id)
            } else {
            }
          })
        
      }

      
  return (
        <div className='my-1'>
            <div className="bg-light border rounded-xl">
                <div className="flex flex-row">
                    <div className="w-full">
                        <a href={"/u/" + props.username}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <img src={PROFILE_IMAGE + props.user_image} alt="post" height="50" width="50" className="object-cover w-10 h-10 rounded-full m-1" />
                                        </td>
                                        <td>
                                            <h4 className="text-sm align-middle">{props.username}</h4>
                                        </td>
                                    </tr>
                                </tbody>
            
                            </table>
                        </a>
                    </div>
        
                    <div className="">
                        <table className="h-full mr-2">
                            <tbody>
                                <tr>
                                    <td className='align-middle'>
                                        <a className="bg-blue-500 py-1 px-4 text-white rounded-xl" onClick={handleMessage}>message</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Friend