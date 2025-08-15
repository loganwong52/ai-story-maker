// https://github.com/BloomBooks/comical-js/tree/master

import React, { useEffect, useRef } from 'react';
import { Comical } from 'comicaljs';

const ComicBubbles = ({ panelId, text = "Sample text" }) => {
    const bubbleContainerRef = useRef(null);
    const comicalInstance = useRef(null);

    useEffect(() => {
        if (!bubbleContainerRef.current) return;

        // Initialize Comical on this specific panel
        comicalInstance.current = new Comical(bubbleContainerRef.current, {
            panels: [{
                bubbles: [{
                    text: text,
                    position: { x: 50, y: 50 }, // Center position
                    direction: "right"
                }]
            }],
            enableDrag: true // Allow bubble dragging
        });

        return () => {
            comicalInstance.current?.destroy();
        };
    }, [panelId, text]);

    return (
        <div
            ref={bubbleContainerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none' // Allows clicks to pass through to underlying panel
            }}
        />
    );
};

export default ComicBubbles;