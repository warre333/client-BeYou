import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../../config/api.config';

const styles = {
    bg: {
        maxWidth: "100%",
        // maxHeight: "20vh",
        aspectRatio: "1 / 1",
        background: "radial-gradient(circle, rgba(69,69,69,1) 0%, rgba(20,20,20,1) 80%)",
    },

    image: {
        maxHeight: "100%",
        maxWidth: "100%",
        aspectRatio: "1 / 1",
        objectFit: "contain",
    },
    
    keepRatio: {
      width: "100%",
      aspectRatio: "1 / 1",
    },
}

function PreviewPost(props) {  
  return (
    <Link to={"/post/" + props.post_id}>
      <div className="text-center rounded-xl">
        <div className="bg-gray-100 justify-center text-center align-middle" style={styles.bg}>
          <table style={styles.keepRatio}>
            <tbody style={styles.keepRatio}>
              <tr style={styles.keepRatio}>
                <td style={styles.keepRatio}><img src={IMAGES + "posts/" + props.image} alt="user post" className="" style={styles.image} /></td>
              </tr>
            </tbody>
          </table>
        </div> 

        <p className="bg-gray-100 font-bold pt-1">Status: {props.status || "loading"}</p>
        <div className="bg-gray-100 py-1 px-2 flex flex-row justify-between rounded-b-lg">
          <p className="">Budget: €{props.budget / 100 || 0}</p>
          <p className="">{props.views || 0} Views</p>
        </div>     
      </div>
    </Link>
  )
}

export default PreviewPost