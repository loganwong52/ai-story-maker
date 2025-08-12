import React, { useState } from 'react';
import './Toolbar.css';

const Toolbar = ({ totalPanels, onPanelSelect }) => {
    const [selectedNumber, setSelectedNumber] = useState(1);

    return (
        <div className="toolbar">
            {/* Panel number selector dropdown */}
            <div className="toolbar-section">
                <label>Panel:</label>
                <select
                    value={selectedNumber}
                    onChange={(e) => {
                        const num = Number(e.target.value);
                        console.log("Selected panel number:", num)
                        setSelectedNumber(num);
                        onPanelSelect(num);
                    }}
                >
                    {Array.from({ length: totalPanels }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
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
                <label>Zoom:</label>
                <div className="zoom-controls">
                    <button className="zoom-button" >+</button>
                    <button className="zoom-button" >-</button>
                </div>
            </div>

            {/* Border checkbox */}
            <div className="toolbar-section">
                <label>
                    Border?
                    <br />
                    <input type="checkbox" checked={true}
                    />
                </label>
            </div>


        </div>
    );
};

export default Toolbar;