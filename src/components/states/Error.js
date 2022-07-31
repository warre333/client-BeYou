import React from "react";
function Error(props) {
    const changeMessageState = () => {
        props.changeMessage("")
    }

    return (
        <div className="alert alert-danger alert-dismissible fade show">
            <p style={{margin: "0"}}>{props.message}</p>
            <button type="button" data-bs-dismiss="alert" className="btn-close " aria-label="Close" style={{float: 'right'}} onClick={changeMessageState}/>
        </div>     
    );
}

export default Error;