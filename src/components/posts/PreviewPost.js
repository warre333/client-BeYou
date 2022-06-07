import React from 'react'

const styles = {
    bg: {
        width: "100%",
        aspectRatio: "1 / 1",
        background: "radial-gradient(circle, rgba(69,69,69,1) 0%, rgba(20,20,20,1) 80%)",
    },

    image: {
        maxHeight: "100%",
        maxWidth: "100%",
        objectFit: "contain",
    },
      
    buttonbg: {    
        background: "none",
        color: "inherit",
        border: "none",
        padding: 0,
        font: "inherit",
        cursor: "pointer",
        outline: "inherit",
        // width: "100%",
        // aspectRatio: "1 / 1",
    },
    
    keepRatio: {
      width: "100%",
      aspectRatio: "1 / 1",
    },
}

function PreviewPost(props) {
  return (
    <button className="col-4 text-center rounded-3" style={styles.buttonbg} >
      <div className="bg-light border justify-content-center text-center align-middle" style={styles.bg}>
        <table style={styles.keepRatio}>
          <tbody style={styles.keepRatio}>
            <tr style={styles.keepRatio}>
              <td style={styles.keepRatio}><img src={props.image} alt="user post" className="" style={styles.image} /></td>
            </tr>
          </tbody>
        </table>
      </div>        
    </button>
    
  )
}

export default PreviewPost