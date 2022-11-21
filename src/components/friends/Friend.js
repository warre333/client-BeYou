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

function Friend(props) {
  return (
    <a href={"/u/" + props.username}>
        <div className='my-1'>
            <div className="bg-light border rounded-xl">
                <div className="flex flex-row">
                    <div className="w-full">
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
                    </div>
        
                    <div className="">
                        <table className="h-full mr-2">
                            <tbody>
                                <tr>
                                    <td className='align-middle'>
                                        <a className="bg-blue-500 py-1 px-4 text-white rounded-xl" href={"/message/"}>message</a>
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

export default Friend