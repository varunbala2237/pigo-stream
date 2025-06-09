// ServerSection.js
function ServerSection({
    servers,
    selectedServer,
    handleServerChange,
    serverStatus,
    serverStatusLoading
}) {
    return (

        <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
            <div className="d-flex flex-row dynamic-ts my-2">
                <i className="bi bi-hdd-network me-2"></i>
                Servers
            </div>
            <div className="row g-2">
                {servers.length > 0 ? (
                    servers.map((server, index) => (
                        <div key={server.server_name} className="col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
                            <button
                                className={`btn w-100 d-flex flex-row align-items-center justify-content-center border-0 rounded-pill shadow-sm 
                                    ${selectedServer.server_name === server.server_name
                                        ? 'btn-primary bd-callout-primary active'
                                        : 'btn-primary bd-callout-dark'
                                    }`}
                                onClick={() => handleServerChange(server)}
                            >
                                <span className="text-truncate dynamic-ss">{server.server_name}</span>
                                {!serverStatusLoading && !serverStatus[index] && (
                                    <i className="bi bi-exclamation-triangle text-danger ms-2"></i>
                                )}
                            </button>
                        </div>

                    ))
                ) : (
                    <div className="text-white">No servers available</div>
                )}
            </div>
        </div>
    );
};

export default ServerSection;