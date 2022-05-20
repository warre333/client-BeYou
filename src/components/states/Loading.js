function Loading(props) {
    return (
        <div className="Loading">
            <h2>The page will be loaded soon, please wait</h2>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>     
    );
}

export default Loading;