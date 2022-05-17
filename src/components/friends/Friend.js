import React from 'react'

function Friend(props) {
  return (
    <div>
        <div className="bg-light border rounded-4">
            <div className="row">
                <div className="col-8">
                    <table>
                        <tr>
                            <td>
                                <svg width="50" height="50" className='rounded-circle m-2'>
                                <image href={props.user_image} height="50" width="50"/>
                                </svg>
                            </td>  

                            <td>
                                <h4 className="font-weight-normal small align-middle">{props.username}</h4>
                            </td>
                        </tr>
                    </table> 
                </div>
                
                <div className="col">
                    <table>
                        <tr>
                            <td>
                                <a className="btn btn-primary align-middle" href={"/profile/" + "1"}>profile</a>
                            </td>
                            
                            <td>

                            </td>
                        </tr>
                    </table>
                </div>
            </div>            
        </div>
    </div>
  )
}

export default Friend