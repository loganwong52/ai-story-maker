import { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import './Bubble.css';
import ThoughtBubble from './thoughtBubble.jsx';

const BUBBLE_TYPES = {
    SPEECH: "speech",
    THOUGHT: "thought",
    CAPTION: "caption",
    EXCLAMATION: "exclamation"
};

const BubbleStyle = {
    speech: {
        borderRadius: '75%',
        paddingBottom: '15px',
        paddingLeft: '20px',
        paddingRight: '20px',

        // tail: a curved or straight line
    },
    thought: {


        // tail: a bunch of circles following a curved or straight line.
    },
    caption: {
        borderRadius: '0',
        tail: null // No tail
    },
    exclamation: {
        borderRadius: '10px',
        // tail: a straight line
    }
}





function ComicBubbles() {
    const [bubbles, setBubbles] = useState([]);
    const [selectedType, setSelectedType] = useState(BUBBLE_TYPES.SPEECH);
    const bubbleRef = useRef({});

    // Create a new bubble
    const addBubble = () => {
        const newBubble = {
            id: Date.now(),
            type: selectedType,
            text: "Click to edit",
            x: 50,
            y: 50,
        };
        setBubbles([...bubbles, newBubble]);
    };

    // Delete bubble
    const deleteBubble = (id) => {
        setBubbles(bubbles.filter(bubble => bubble.id !== id));
    };

    return (
        <div className="comic-bubbles-layer">
            {/* Bubble Controls (fixed toolbar) */}
            <div className='bubble-controls'>
                {/* Dropdown menu */}
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    {Object.entries(BUBBLE_TYPES).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>

                <button onClick={addBubble}>Add</button>
            </div>

            {/* Bubble Renderer */}
            {bubbles.map((bubble) => (
                <Draggable key={bubble.id} nodeRef={bubbleRef}>
                    <div
                        className='bubble'
                        ref={bubbleRef}
                        style={{
                            left: `${bubble.x}px`,
                            top: `${bubble.y}px`,
                            ...BubbleStyle[bubble.type]
                        }}>
                        <div
                            className="bubble-content"
                            contentEditable
                            suppressContentEditableWarning

                            onMouseDown={(e) => {
                                // Allow double clicking to select all text
                                if (e.detail >= 2) {
                                    e.stopPropagation();
                                    requestAnimationFrame(() => {
                                        if (!e.currentTarget) return;
                                        const selection = window.getSelection();
                                        const range = document.createRange();
                                        range.selectNodeContents(e.currentTarget);
                                        selection.removeAllRanges();
                                        selection.addRange(range);
                                    });
                                }
                            }}

                            onBlur={(e) => {
                                setBubbles(bubbles.map(b =>
                                    b.id === bubble.id ? { ...b, text: e.target.innerText } : b
                                ));
                            }}
                        >
                            {bubble.text}
                        </div>

                        {/* Delete button (appears on hover) */}
                        <button
                            className='delete-bubble-btn'
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteBubble(bubble.id);
                            }}
                        >X</button>

                        {/* Tail rendering */}
                        <ThoughtBubble
                            style={{ width: 260, height: 180 }}     // scale the cloud
                            stroke={2}
                            fill="white"
                            strokeColor="black"
                        ></ThoughtBubble>


                    </div>
                </Draggable>
            )
            )}
        </div>
    );
}

export default ComicBubbles;