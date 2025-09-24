const { useState } = React;

function HomePage(){
    const [message, setMessage] = useState('');

    const goToSeller = () => {
        // If seller exposes a mount function, call it to render seller UI
        if (window.mountSeller && typeof window.mountSeller === 'function') {
            window.mountSeller();
        } else {
            // fallback: navigate to seller.js directly (will reload the page)
            window.location.href = 'seller.js';
        }
    };

    const goToBuying = () => {
        if (window.mountBuyer && typeof window.mountBuyer === 'function') {
            window.mountBuyer();
        } else {
            // fallback: navigate to seller.js directly (will reload the page)
            window.location.href = 'buyer.js';
        }
    };

    return (
        <div className="home-container">
            <h1 className="logo">Livestream Thrifting</h1>
            <p className="tagline">Choose an option to continue</p>

            <div className="button-row">
                <button className="primary-btn" onClick={goToBuying}>Buying</button>
                <button className="secondary-btn" onClick={goToSeller}>Selling</button>
            </div>

            {message && <div className="info">{message}</div>}
        </div>
    );
}

// Render the home page
ReactDOM.render(<HomePage />, document.getElementById('root'));
