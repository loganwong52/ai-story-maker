import Resizable from 'react-resizable-layout';
// https://www.npmjs.com/package/react-resizable-layout#react-resizable-layout

import { useState, useEffect, useRef } from 'react';
import { useResizable } from 'react-resizable-layout';

import './ResizableComponents.css';

// const ResizableComponents = ({ image }) => {
//     // position: pixel width of LEFT panel
//     // separatorProps: All drag events and accessibility props
//     // isDragging: Boolean if user is dragging or not
//     const { position, separatorProps, isDragging } = useResizable({
//         axis: 'x', initial: 200, min: 100, max: 800,
//     });

//     return (
//         <div className="resizable-wrapper debug-border">
//             <div className="left-block" style={{ width: position }}>
//                 <h2>Left Panel</h2>
//             </div>

//             <div className="separator" {...separatorProps} />

//             <div className="right-block">
//                 <h2>Right Panel</h2>
//             </div>
//         </div>
//     )
// };


const ResizableComponents = () => {
    // Each row has INDEPENDENT controls for:
    // - Left panel width (horizontal resize)
    // - Row height (vertical resize)

    // Row 1 controls
    const row1Horizontal = useResizable({ axis: 'x', initial: 200, min: 100, max: 500 });
    const row1Vertical = useResizable({ axis: 'y', initial: 150, min: 50, max: 400 });

    // Row 2 controls
    const row2Horizontal = useResizable({ axis: 'x', initial: 200, min: 100, max: 500 });
    const row2Vertical = useResizable({ axis: 'y', initial: 150, min: 50, max: 400 });

    // Row 3 controls
    const row3Horizontal = useResizable({ axis: 'x', initial: 200, min: 100, max: 500 });
    const row3Vertical = useResizable({ axis: 'y', initial: 150, min: 50, max: 400 });

    return (
        <div className="resizable-container">
            {/* Row 1 - Can resize both width and height independently */}
            <div className="row" style={{ height: row1Vertical.position }}>
                <div className="left-panel" style={{ width: row1Horizontal.position }}>
                    <h3>Row 1 Left</h3>
                </div>
                <div
                    className="vertical-separator"
                    style={{ left: row1Horizontal.position }}
                    {...row1Horizontal.separatorProps}
                />
                <div className="right-panel">
                    <h3>Row 1 Right</h3>
                </div>
            </div>

            <div
                className="horizontal-separator"
                {...row1Vertical.separatorProps}
            />

            {/* Row 2 - Independent controls */}
            <div className="row" style={{ height: row2Vertical.position }}>
                <div className="left-panel" style={{ width: row2Horizontal.position }}>
                    <h3>Row 2 Left</h3>
                </div>
                <div
                    className="vertical-separator"
                    style={{ left: row2Horizontal.position }}
                    {...row2Horizontal.separatorProps}
                />
                <div className="right-panel">
                    <h3>Row 2 Right</h3>
                </div>
            </div>

            <div
                className="horizontal-separator"
                {...row2Vertical.separatorProps}
            />

            {/* Row 3 - Independent controls */}
            <div className="row" style={{ height: row3Vertical.position }}>
                <div className="left-panel" style={{ width: row3Horizontal.position }}>
                    <h3>Row 3 Left</h3>
                </div>
                <div
                    className="vertical-separator"
                    style={{ left: row3Horizontal.position }}
                    {...row3Horizontal.separatorProps}
                />
                <div className="right-panel">
                    <h3>Row 3 Right</h3>
                </div>
            </div>
        </div>
    );
};

export default ResizableComponents;
