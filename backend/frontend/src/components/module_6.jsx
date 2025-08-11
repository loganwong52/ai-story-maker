import React, { useState } from 'react';
import './Toolbar.css';

const Toolbar = ({ totalPanels = 1 }) => {
    const [selectedNumber, setSelectedNumber] = useState(1);

    return (
        <div className="toolbar">
            {/* Panel number selector dropdown */}
            <div className="toolbar-section">
                <div>
                    <label>Select<br />Panel:</label>
                </div>
                <select
                    value={selectedNumber}
                    onChange={(e) => setSelectedNumber(Number(e.target.value))}
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
                    <div className="arrow-row">
                        <button className="arrow-button" >←</button>
                        <button className="arrow-button" >→</button>
                    </div>
                    <button className="arrow-button" >↓</button>
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
                    <input type="checkbox" />
                </label>
            </div>


        </div>
    );
};

export default Toolbar;