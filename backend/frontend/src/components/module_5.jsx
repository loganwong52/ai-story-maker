import Resizable from 'react-resizable-layout';
// https://www.npmjs.com/package/react-resizable-layout#react-resizable-layout

import { useState, useEffect, useRef } from 'react';
import { useResizable } from 'react-resizable-layout';

import './ResizableComponents.css';

const ResizableComponents = ({ image }) => {
    // position: pixel width of LEFT panel
    // separatorProps: All drag events and accessibility props
    // isDragging: Boolean if user is dragging or not
    const { position, separatorProps, isDragging } = useResizable({
        axis: 'x', initial: 200, min: 100, max: maxWidth,
    });

    return (
        <div className="resizable-wrapper debug-border">
            <div className="left-block" style={{ width: position }}>
                <h2>Left Panel</h2>
            </div>

            <div className="separator" {...separatorProps} />

            <div className="right-block">
                <h2>Right Panel</h2>
            </div>
        </div>
    )
};

export default ResizableComponents