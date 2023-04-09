import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { getCookie } from '../../functions/Common'

import { CHAT, PROFILE_IMAGE } from '../../config/api.config'

function Friend(props) {
    const navigate = useNavigate()

    function handleMessage(){
        const user = getCookie()
  
        axios.post(CHAT, {
          user_id: props.user_id
        }, {
          headers: {
            "x-access-token": user
          },
        },)
          .then((response) => {
            if(response.data.success){
              navigate("/messages/" + response.data.chatroom_id)
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
                                        <button className="bg-blue-500 py-1 px-4 text-white rounded-xl" onClick={handleMessage}>message</button>
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