import React from 'react'

import { PROFILE_IMAGE } from '../../config/api.config'

function ChatListItem(props) {
  return (
    <a href={"/messages/" + props.chatroom_id}>
        <div className='my-1'>
            <div className="bg-light border rounded-xl">
                <div className="flex flex-row">
                    <div className="">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                    <div className='mt-1 ml-1'><img src={PROFILE_IMAGE + props.user_image} alt="post" height="50" width="50" className="object-cover w-10 h-10 rounded-full" /></div>
                                    </td>
                                    <td>
                                        <h4 className="font-normal text-sm align-middle">{props.username}</h4>
                                    </td>
                                </tr>
                            </tbody>
        
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </a>
  )
}

export default ChatListItem