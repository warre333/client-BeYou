import React from "react";
function Success(props) {
    const changeMessageState = () => {
        props.changeMessage("")
    }

    return (
        <div className="alert alert-success alert-dismissible fade show">
            <p style={{margin: "0"}}>{props.message}</p>
            <button type="button" data-bs-dismiss="alert" className="btn-close " aria-label="Close" style={{float: 'right'}} onClick={changeMessageState} />
        </div>     
    );
}

export default Success;