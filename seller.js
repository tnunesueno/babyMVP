const { useState, useRef } = React;

const LivestreamHomepage = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const startStream = async () => {
        try {
            setError(null);
            
            // Request access to user's webcam
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: true
            });
            
            // Store stream reference for cleanup
            streamRef.current = stream;
            
            // Set video source
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            
            setIsStreaming(true);
            
        } catch (err) {
            console.error('Error accessing webcam:', err);
            setError(
                err.name === 'NotAllowedError' 
                    ? 'Camera access denied. Please allow camera access and try again.'
                    : err.name === 'NotFoundError'
                    ? 'No camera found. Please connect a camera and try again.'
                    : 'Unable to access camera. Please check your camera and try again.'
            );
        }
    };

    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        
        setIsStreaming(false);
        setError(null);
    };

    const toggleCamera = async () => {
        if (isStreaming) {
            stopStream();
        } else {
            await startStream();
        }
    };

    return (
        <div className="container">
            <h1 className="logo">Livestream Marketing</h1>
            <p className="tagline">Connect with your audience in real-time</p>
            
            <button 
                className="stream-button" 
                onClick={toggleCamera}
            >
                {isStreaming ? 'Stop Stream' : 'Stream'}
            </button>
            
            {error && (
                <div className="error">
                    {error}
                </div>
            )}
            
            <div className={`video-container ${isStreaming ? 'active' : ''}`}>
                <video 
                    ref={videoRef}
                    autoPlay 
                    muted 
                    playsInline
                />
                {isStreaming && (
                    <div className="controls">
                        <button className="control-btn" onClick={stopStream}>
                            Stop Stream
                        </button>
                        <button className="control-btn" onClick={() => window.alert('Stream settings coming soon!')}>
                            Settings
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Expose a mount function so other scripts (like home.js) can render this UI
window.mountSeller = function mountSeller() {
    ReactDOM.render(<LivestreamHomepage />, document.getElementById('root'));
};

// If seller.js is loaded directly (no existing app mounted), mount automatically
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Only mount if root exists and is empty (to avoid clobbering)
    const root = document.getElementById('root');
    if (root && root.childNodes.length === 0) {
        window.mountSeller();
    }
} else {
    document.addEventListener('DOMContentLoaded', () => {
        const root = document.getElementById('root');
        if (root && root.childNodes.length === 0) {
            window.mountSeller();
        }
    });
}