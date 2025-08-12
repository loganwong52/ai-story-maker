import { useState, useEffect, useMemo } from 'react';
import './App.css'
import User_prompt from './components/module_1';
import Panel from './components/module_2';
import NumberDropdown from './components/module_3';
import ResizablePanel from './components/module_4';
import Toolbar from './components/module_6';

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


function App() {
  // list of dictionaries
  // Init with all modules
  const [modules, setModules] = useState(() => {
    const initialModules = [];
    for (let row = 1; row <= 3; row++) {
      for (let col = 1; col <= 3; col++) {
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
  const [columnCounts, setColumnCounts] = useState([1]);
  // columnCounts is an array
  // length of columnCounts == Number of Rows
  // Each index's value is the Number of Columns in that corresponding Row

  // The number dropdowns
  // columnCounts updates when the number of rows changes
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


  // Nested function, only to be used inside App()
  const getPanelIdFromNumber = (targetNumber) => {
    /* Converts an int into row-?-col-? */

    let count = 0;
    for (let row = 0; row < panelLabels.length; row++) {
      for (let col = 0; col < panelLabels[row].length; col++) {
        count++;
        if (count === targetNumber) {
          return `row-${row + 1}-col-${col + 1}`;
        }
      }
    }
    return activePanelId;
  };

  // Nested function, only to be used inside App()
  const getPanelNumberFromId = (panelId) => {
    /* Converts "row-x-col-y" into an int */

    // Convert panelID to list: [row, x, col, y]
    const panelId_chunks = panelId.split('-');

    // Cast all elements in panelId_chunks to be Numbers: [NaN, x, NaN, y]
    const numeric_panelId_chunks = panelId_chunks.map(Number);

    // Extract only x and y
    const row = Number(numeric_panelId_chunks[1]);
    const col = Number(numeric_panelId_chunks[3]);

    // Sum panels in all rows above
    let number = 0;
    for (let r = 1; r < row; r++) {
      let row_of_panels = panelLabels[r - 1]
      let row_len = row_of_panels.length
      number += row_len;
    }
    let panel_position = number + col

    return panel_position;
  };



  // STUFF FOR TOOLBAR
  const totalPanels = panelLabels.flat().length;
  console.log("Total Panels:", totalPanels)

  // Global state for Toolbar's Panel Selector Dropdown
  const [selectedPanelId, setSelectedPanelId] = useState("row-1-col-1");

  // Toolbar handlers
  const handlePanelSelect = (panelNumber) => {
    const newPanelId = getPanelIdFromNumber(panelNumber);
    setSelectedPanelId(newPanelId);
  };

  // Panel borders
  const [panelBorders, setPanelBorders] = useState(() => {
    const borders = {};
    modules.forEach(module => {
      borders[module.panelId] = true; // Default to bordered
    });
    return borders;
  });

  // Toolbar's checkbox
  const handleBorderToggle = (isChecked) => {
    setPanelBorders(prev => ({
      ...prev,
      [selectedPanelId]: isChecked
    }));
  };

  return (
    <div className="app-container">
      {/* Left section w/ User Prompts */}
      <div className="left-column">
        {/* Dropdowns to choose Row # and Col #s */}
        <NumberDropdown
          selectedNumber={numOfRows}
          setSelectedNumber={setNumOfRows}
          label_text={"Number of rows:"}
        />

        {/* Dynamic dropdowns - map is used, not a for loop */}
        {Array.from({ length: numOfRows }).map((_, index) => (
          <NumberDropdown
            key={index}
            selectedNumber={columnCounts[index]}
            setSelectedNumber={(numOfCols) => {
              // 1. create a copy of the old array
              const newCounts = [...columnCounts];
              // 2. update the copy
              newCounts[index] = numOfCols;
              // 3. Replace the entire old array with the new updated version
              setColumnCounts(newCounts);
            }}
            label_text={`Row ${index + 1}; Number of Columns:`}
          />
        ))}


        {/* LEFT GRID */}
        <div className="grid">
          {columnCounts.map((colsInRow, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid-row">
              {Array.from({ length: colsInRow }).map((_, colIndex) => {
                // Extract the Panel label given the row and col indices
                const panelLabel = panelLabels[rowIndex][colIndex]

                // Create the "key"
                const panelId = `row-${rowIndex + 1}-col-${colIndex + 1}`;
                // Find module by ID; .find searches array, finds 1st module whose panelID is panelId
                // module is a dict, since modules is a list of dicts
                const module = modules.find((m) => m.panelId === panelId);

                return (
                  <div key={`cell-${rowIndex}, ${colIndex}`} className="cell-container">
                    <h3 className="panel-header">{panelLabel}</h3>

                    <div key={`cell-${rowIndex}, ${colIndex}`} className="grid-cell">
                      <User_prompt
                        panelId={panelId}
                        modules={modules}
                        setModules={setModules}
                        setActivePanelId={setActivePanelId}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* End of Left column */}
      </div>


      {/* Right White Section */}
      <div className='right-column'>
        <div className="result-section">

          <Toolbar
            totalPanels={totalPanels}
            selectedPanelNumber={getPanelNumberFromId(selectedPanelId)}
            onPanelSelect={handlePanelSelect}
            hasBorder={panelBorders[selectedPanelId] ?? true}
            onBorderToggle={handleBorderToggle}
          />
          <br />

          <div className="image-bleed">
            <div className="trim-line"></div>
            <div className="safe-area">

              {/* Where the image actually appears */}
              {/* {console.log("activePanelId:" + activePanelId)} */}
              {/* {console.log("Module:" + modules.find(m => m.panelId === activePanelId))} */}
              {/* {console.log(modules.find(m => m.panelId === activePanelId)?.image)} */}

              {modules.find(m => m.panelId === activePanelId)?.image && (
                <div>
                  {/* RIGHT GRID */}
                  <div className="grid">
                    {columnCounts.map((colsInRow, rowIndex) => (
                      <div key={`row-${rowIndex}`} className="grid-row">
                        {Array.from({ length: colsInRow }).map((_, colIndex) => {
                          // Extract the Panel label given the row and col indices
                          const panelLabel = panelLabels[rowIndex][colIndex]

                          // Create the "key"
                          const panelId = `row-${rowIndex + 1}-col-${colIndex + 1}`;
                          // Find module by ID; .find searches array, finds 1st module whose panelID is panelId
                          // module is a dict, since modules is a list of dicts
                          const module = modules.find((m) => m.panelId === panelId);

                          return (
                            module?.visible && module?.image &&
                            <div key={`cell-${rowIndex}, ${colIndex}`} className="cell-container">
                              {/* <h3 style={{ color: 'black' }} className="panel-header">{panelLabel} </h3> */}
                              {/* <ResizablePanel
                                image={modules.find(m => m.panelId === panelId)?.image}
                              /> */}
                              < Panel
                                modules={modules}
                                activePanelId={panelId}
                                hasBorder={panelBorders[panelId] ?? true}

                              />
                              {/* <h3 style={{ color: 'black' }}>
                                {panelId}
                              </h3> */}
                              {/* <h3 style={{ color: 'black' }}>
                                {modules.find(m => m.panelId === activePanelId).originalPrompt}
                              </h3> */}
                              {/* <h6 style={{ color: 'black' }}>
                                {modules.find(m => m.panelId === activePanelId).refinedPrompt}
                              </h6> */}

                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
        {/* End of Right column */}
      </div>

      {/* The end div of app-container */}
    </div >
  );
}

export default App