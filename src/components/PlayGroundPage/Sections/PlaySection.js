// PlaySection.js
import useSaveWatchHistory from '../../../hooks/WatchHistoryPage/useSaveWatchHistory';
import './PlaySection.css';

const PlaySection = ({ id, type, loadingServers, selectedServer, inHistory, setInHistory }) => {
    const { addToHistory } = useSaveWatchHistory();

    // Handling add to history
    const handleAddToHistory = () => {
        try {
            if (!inHistory) {
                setInHistory(true);
                addToHistory(id, type).catch((err) => {
                    console.error('Failed to save watch history:', err);
                });
            }
        } catch (error) {
            console.error('Error adding to history:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center w-100">
            <div className="d-flex justify-content-center custom-bg custom-theme-radius-low p-2 player-container">
                <div className="position-relative overflow-hidden custom-theme-radius-low player">
                    {!loadingServers ? (
                        <iframe
                            title="Iframe"
                            src={selectedServer?.server_link}
                            className="w-100 h-100 custom-theme-radius-low border-0"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                            onLoad={handleAddToHistory}
                        />
                    ) : (
                        <div className="stream-overlay d-flex flex-column justify-content-center align-items-center custom-theme-radius-low text-center text-white">
                            <div className="spinner-border mb-2" role="status" />
                            <span className="dynamic-fs">Fetching stream...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PlaySection;