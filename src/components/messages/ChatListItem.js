import React from 'react'
import { PROFILE_IMAGE } from '../../config/api.config'

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

function ChatListItem(props) {
    console.log(props);
  return (
    <a href={"/chat/" + props.chatroom_id}>
        <div className='my-1 text-dark'>
            <div className="bg-light border rounded-4">
                <div className="row">
                    <div className="col-8">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <svg width="50" height="50" className='rounded-circle m-2'>
                                            <image href={PROFILE_IMAGE + props.user_image} style={styles.image} height="50" width="50" />
                                        </svg>
                                    </td>
                                    <td>
                                        <h4 className="font-weight-normal small align-middle">{props.username}</h4>
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