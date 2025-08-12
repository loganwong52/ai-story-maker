import { useState, useEffect, useRef } from 'react';
import "./ZoomButton.css"

const ZoomButton = ({ action, children, direction }) => {
    const [isHolding, setIsHolding] = useState(false);
    const holdTimer = useRef();
    const actionCount = useRef(0);

    // Handle both click and hold
    const handlePointerDown = (e) => {
        e.preventDefault(); // Prevent text selection
        action(); // Immediate click action

        // Start hold action after 300ms
        holdTimer.current = setTimeout(() => {
            setIsHolding(true);
            actionCount.current = 0;
            holdTimer.current = setInterval(() => {
                actionCount.current++;
                action();
            }, 100 - Math.min(actionCount.current * 10, 50)); // Accelerates while holding
        }, 300);
    };

    const handlePointerUp = () => {
        clearTimeout(holdTimer.current);
        clearInterval(holdTimer.current);
        setIsHolding(false);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            clearTimeout(holdTimer.current);
            clearInterval(holdTimer.current);
        };
    }, []);

    return (
        <button
            className={`zoom-button ${isHolding ? 'active' : ''}`}
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp} // Cancel if mouse leaves
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
            aria-label={`Zoom ${direction}`}
        >
            {children}
            {isHolding && <span className="pulse-animation" />}
        </button>
    );
};

export default ZoomButton