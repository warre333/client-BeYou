import React from 'react'

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
      </div> 
  )
}

export default PreviewPost