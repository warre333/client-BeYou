import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { getCookie } from '../../functions/Common'

import { CHAT, PROFILE_IMAGE } from '../../config/api.config'

function Friend(props) {
    const navigate = useNavigate()
      
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
                </div>
            </div>
        </div>
  )
}

export default Friend