import { useState, useEffect, useRef } from 'react';
import "./ArrowButton.css";

const ArrowButton = ({ action, children, direction }) => {
    const [isHolding, setIsHolding] = useState(false);
    const holdTimer = useRef();
    const actionCount = useRef(0);

    const handlePointerDown = (e) => {
        e.preventDefault();
        action();

        holdTimer.current = setTimeout(() => {
            setIsHolding(true);
            actionCount.current = 0;
            holdTimer.current = setInterval(() => {
                actionCount.current++;
                action();
            }, 100 - Math.min(actionCount.current * 10, 50)); // Accelerates
        }, 300);
    };

    const handlePointerUp = () => {
        clearTimeout(holdTimer.current);
        clearInterval(holdTimer.current);
        setIsHolding(false);
    };

    useEffect(() => {
        return () => {
            clearTimeout(holdTimer.current);
            clearInterval(holdTimer.current);
        };
    }, []);

    return (
        <button
            className={`arrow-button ${isHolding ? 'active' : ''}`}
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
            aria-label={`Move ${direction}`}
        >
            {children}
        </button>
    );
};

export default ArrowButton;