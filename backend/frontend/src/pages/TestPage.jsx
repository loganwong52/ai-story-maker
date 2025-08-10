import { useState, useEffect, useMemo, useRef } from 'react';
import '../App.css'
import User_prompt from '../components/module_1';
import Panel from '../components/module_2';
import NumberDropdown from '../components/module_3';

import ResizableComponents from '../components/module_5';
import { useResizable } from 'react-resizable-layout';

function TestPage() {
    // list of dictionaries
    // Initialize with all possible modules (e.g., 3x3 grid = 9 modules)
    const [modules, setModules] = useState(() => {
        const initialModules = [];
        for (let row = 1; row <= 3; row++) { // Adjust max rows as needed
            for (let col = 1; col <= 3; col++) { // Adjust max columns as needed
                initialModules.push({
                    panelId: `row-${row}-col-${col}`,
                    originalPrompt: "",
                    refinedPrompt: "",
                    image: null,
                    visible: false
                });
            }
        }
        return initialModules;
    });


    const [numOfRows, setNumOfRows] = useState(1);
    // A state that's an ARRAY, not a number
    const [columnCounts, setColumnCounts] = useState([1]);
    // columnCounts is an array
    // length of columnCounts == Number of Rows
    // Each index's value is the Number of Columns in that corresponding Row

    // The number dropdowns
    // This "listens" for whenever numOfRows changes to Update columnCounts
    // Basically: columnCounts needs to update whenever the number of columns changes, obviously, 
    // BUT ALSO: whenever the number of rows changes too
    useEffect(() => {
        setColumnCounts(originalColumnCounts => updateColumnCounts(originalColumnCounts, numOfRows));
    }, [numOfRows]);

    // Panel
    // useMemo lets you reuse the RESULTS of a function, not the function itself.
    const panelLabels = useMemo(() => updatePanelLayout(columnCounts), [columnCounts]);


    // Track the "active" panel
    // store which panel's (panelId) image should be shown in the right column
    const [activePanelId, setActivePanelId] = useState("row-1-col-1");

    // Initialize activePanelId to the first module's ID on first render
    useEffect(() => {
        if (modules.length > 0 && !activePanelId) {
            // Activate the first module
            setActivePanelId(modules[0].panelId);
        }
    }, [modules]);





    const rightColumnRef = useRef(null);

    const [maxWidth, setMaxWidth] = useState(800); // placeholder until measured

    useEffect(() => {
        if (rightColumnRef.current) {
            setMaxWidth(rightColumnRef.current.offsetWidth - 10); // 10px separator
        }
    }, []);

    const { position, separatorProps, isDragging } = useResizable({
        axis: 'x',
        initial: 200,
        min: 100,
        max: maxWidth,
    });



    return (
        <div className="app-container">

            <div className='right-column'>
                <div className="result-section">
                    <h2>Generated Image</h2>

                    <div className="image-bleed">
                        <div className="trim-line"></div>
                        <div className="safe-area" ref={rightColumnRef}>

                            {/* Where the image actually appears */}
                            <ResizableComponents />


                        </div>
                    </div>
                </div>
                {/* End of Right column */}
            </div>

            {/* The end div of app-container */}
        </div >
    );
}

function updateColumnCounts(originalColumnCounts, numOfRows) {
    // Copy columnCounts
    const newCounts = [...originalColumnCounts];

    // Add new rows with 1 column
    while (newCounts.length < numOfRows) {
        newCounts.push(1);
    }

    // Remove any extra rows
    while (newCounts.length > numOfRows) {
        newCounts.pop();
    }

    // Update columnCounts (NOT numOfRows)
    return newCounts;
}

function updatePanelLayout(columnCounts) {
    // Nested for loop to count/label panels 1 thru 9 appropriately
    var panelCounter = 0;
    var panelLayout = [];

    for (var i = 0; i < columnCounts.length; i++) {
        var columnsInRow = columnCounts[i];
        var rowPanels = [];

        for (var j = 0; j < columnsInRow; j++) {
            panelCounter++;
            rowPanels.push("Panel " + panelCounter);
        }
        panelLayout.push(rowPanels);
    }
    return panelLayout;
}

export default TestPage

// Simplest possible page component
// export default function TestPage() {
//     return <h1 style={{ color: 'red' }}>This is the Test Page!</h1>
// }