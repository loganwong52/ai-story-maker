import { useState, useRef } from 'react';
import Draggable from 'react-draggable';

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
    const bubbleRef = useRef(null);

    const [bubbles, setBubbles] = useState([]);
    const [selectedType, setSelectedType] = useState(BUBBLE_TYPES.SPEECH);

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

    return (
        <div className="comic-bubbles-layer" style={{ position: 'fixed', top: 0, zIndex: 1000 }}>
            {/* Bubble Controls (fixed toolbar) */}
            <div style={{ padding: '10px', background: 'lightgrey' }}>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    {Object.entries(BUBBLE_TYPES).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
                <button onClick={addBubble}>Add</button>
            </div>

            {/* Render Bubbles */}
            {bubbles.map((bubble) => (
                <Draggable nodeRef={bubbleRef}>
                    <div ref={bubbleRef}
                        style={{
                            position: 'absolute',
                            left: `${bubble.x}px`,
                            top: `${bubble.y}px`,
                            padding: '10px',
                            background: 'white',
                            color: 'black',
                            border: '2px solid black',
                            ...BubbleStyle[bubble.type]
                        }}
                        contentEditable
                        suppressContentEditableWarning
                    >
                        {bubble.text}
                        <span style={{ fontSize: '10px' }}>{BubbleStyle[bubble.type].tail}</span>
                    </div>
                </Draggable>
            ))}
        </div>
    );
}

export default ComicBubbles;