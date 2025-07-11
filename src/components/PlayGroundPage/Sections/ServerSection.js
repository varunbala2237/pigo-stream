// ServerSection.js

const ServerSection = ({
    servers,
    selectedServer,
    handleServerChange,
}) => {
    return (

        <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
            <div className="d-flex flex-row dynamic-ts mb-2">
                <i className="bi bi-hdd-stack me-2"></i>
                Servers
            </div>
            <div className="row g-2">
                {servers.length > 0 ? (
                    servers.map((server) => (
                        <div key={server.server_name} className="d-flex col-4 col-md-3 col-lg-2">
                            <button
                                className={
                                    `btn w-100 align-items-center d-flex flex-column
                                    justify-content-center align-items-center text-white border-0 rounded-pill shadow-sm
                                    ${selectedServer.server_name === server.server_name
                                        ? 'btn-primary bd-callout-primary active'
                                        : 'btn-dark bd-callout-dark'
                                    }`
                                }
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