import React, { useState } from 'react';
import './Toolbar.css';
import ZoomButton from './module_7';

const Toolbar = ({

    // Zoom in/out
    zoomLevel, onZoomIn, onZoomOut,

    // checkbox
    totalPanels,
    selectedPanelNumber,
    onPanelSelect,
    hasBorder,
    onBorderToggle,
}) => {

    const panel_options = [];
    for (let i = 1; i <= totalPanels; i++) {
        let panel_option = <option key={i} value={i}>{i}</option>
        panel_options.push(panel_option);
    }

    return (
        <div className="toolbar">
            {/* Panel number selector dropdown */}
            <div className="toolbar-section">
                <label>Panel:</label>
                <select
                    value={selectedPanelNumber}
                    onChange={(e) => {
                        const num = Number(e.target.value);
                        console.log("Selected panel number:", num)
                        onPanelSelect(num)
                    }}
                >
                    {panel_options}
                </select>
            </div>

            {/* Move arrows */}
            <div className="toolbar-section">
                <label>Position:</label>
                <div className="arrow-buttons">
                    <button className="arrow-button">↑</button>
                    <button className="arrow-button" >↓</button>
                    <button className="arrow-button" >←</button>
                    <button className="arrow-button" >→</button>
                </div>
            </div>

            {/* zoom in/out */}
            <div className="toolbar-section">
                <label>
                    Zoom: {Math.round(zoomLevel * 100)}%
                </label>
                <div className="zoom-controls">
                    {/* <button className="zoom-button" onMouseDown={onZoomIn} >+</button> */}
                    {/* <button className="zoom-button" onMouseDown={onZoomOut} >-</button> */}
                    <ZoomButton action={onZoomIn} direction="in">+</ZoomButton>
                    <ZoomButton action={onZoomOut} direction="out">-</ZoomButton>

                </div>
            </div>

            {/* Border checkbox */}
            <div className="toolbar-section">
                <label>
                    Border?
                    <br />
                    <input
                        type="checkbox"
                        checked={hasBorder}
                        onChange={(e) => onBorderToggle(e.target.checked)}
                    />
                </label>
            </div>


        </div>
    );
};

export default Toolbar;