import { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import './Bubble.css';

const BUBBLE_TYPES = {
    SPEECH: "speech",
    THOUGHT: "thought",
    CAPTION: "caption",
    EXCLAMATION: "exclamation"
};

const BubbleStyle = {
    speech: { borderRadius: '10px', tail: '▼' },
    thought: { borderRadius: '50%', tail: '○' },
    caption: { borderRadius: '0', tail: '' },
    exclamation: { borderRadius: '10px', tail: '!' }
};



function ComicBubbles() {
    const [bubbles, setBubbles] = useState([]);
    const [selectedType, setSelectedType] = useState(BUBBLE_TYPES.SPEECH);
    const bubbleRef = useRef(null);

    // Create a new bubble
    const addBubble = () => {
        const newBubble = {
            id: Date.now(),
            type: selectedType,
            text: "Click to edit",
            x: 50,
            y: 50
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
                        }}
                        contentEditable
                        suppressContentEditableWarning

                        // Allow double clicking to highlight all text
                        onClick={(e) => {
                            if (e.detail === 2) {
                                e.stopPropagation();
                                requestAnimationFrame(() => {
                                    if (!bubbleRef.current) return;
                                    const selection = window.getSelection();
                                    const range = document.createRange();
                                    range.selectNodeContents(bubbleRef.current);
                                    selection.removeAllRanges();
                                    selection.addRange(range);
                                });
                            }
                        }}

                    >
                        {bubble.text}
                        <span style={{ fontSize: '10px' }}>{BubbleStyle[bubble.type].tail}</span>


                        {/* Delete button (appears on hover) */}
                        <button
                            onClick={() => deleteBubble(bubble.id)}
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-10px',
                                background: 'red',
                                color: 'red',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer',
                                display: 'none' // Hidden by default
                            }}
                            onMouseEnter={(e) => e.target.style.display = 'block'}
                            onMouseLeave={(e) => e.target.style.display = 'none'}
                        >
                            ×
                        </button>

                    </div>
                </Draggable>
            ))}
        </div>
    );
}

export default ComicBubbles;