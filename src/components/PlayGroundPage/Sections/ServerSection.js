// ServerSection.js
function ServerSection({
    servers,
    selectedServer,
    handleServerChange,
}) {
    return (

        <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
            <div className="d-flex flex-row dynamic-ts my-2">
                <i className="bi bi-hdd-network me-2"></i>
                Servers
            </div>
            <div className="row g-2">
                {servers.length > 0 ? (
                    servers.map((server) => (
                        <div key={server.server_name} className="d-flex col-3 col-md-2 col-lg-2">
                            <button
                                className={`btn w-100 align-items-center justify-content-center text-white border-0 rounded-pill shadow-sm
                                    ${selectedServer.server_name === server.server_name
                                        ? 'btn-primary bd-callout-primary active'
                                        : 'btn-dark bd-callout-dark'
                                    }`}
                                onClick={() => handleServerChange(server)}
                            >
                                <span className="text-truncate dynamic-ss">{server.server_name}</span>
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