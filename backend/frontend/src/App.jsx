import { useState, useEffect, useMemo } from 'react';
import './App.css'
import User_prompt from './components/module_1';
import Panel from './components/module_2';
import NumberDropdown from './components/module_3';

function App() {
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [image, setImage] = useState(null)
  const [numOfRows, setNumOfRows] = useState(1);

  // A state that's an ARRAY, not a number
  const [columnCounts, setColumnCounts] = useState([1]);
  // columnCounts is an array
  // length of columnCounts == Number of Rows
  // Each index's value is the Number of Columns in that corresponding Row

  // useEffect for the number dropdowns
  // This "listens" for whenever numOfRows changes to Update columnCounts
  // Basically: columnCounts needs to update whenever the number of columns changes, obviously, 
  // BUT ALSO: whenever the number of rows changes too
  useEffect(() => {
    setColumnCounts(originalColumnCounts => {
      // 1. copy columnCounts
      const newCounts = [...originalColumnCounts];

      // Add new rows with 1 column
      while (newCounts.length < numOfRows) {
        newCounts.push(1); // Add new rows with 1 column
      }

      // Remove any extra rows
      while (newCounts.length > numOfRows) {
        newCounts.pop();
      }

      console.log(newCounts)
      // Update columnCounts (NOT numOfRows)
      return newCounts;
    });
  }, [numOfRows]);

  // Panel
  const [columnsPerRow, setColumnsPerRow] = useState([1]); // Array of columns for each row

  useEffect(() => {
    setColumnsPerRow(prev => {
      const newColumns = [...prev.slice(0, numOfRows)];
      while (newColumns.length < numOfRows) newColumns.push(1);
      return newColumns;
    });
  }, [numOfRows]);

  // useMemo lets you reuse the RESULTS of a function, not the function itself.
  const panelLabels = useMemo(() => {
    let counter = 0;
    return columnCounts.map(colsInRow =>
      Array(colsInRow).fill().map(() => `Panel ${++counter}`)
    );
  }, [columnCounts]);


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
              console.log(newCounts)
              setColumnCounts(newCounts);
            }}
            label_text={`Row ${index + 1}; Number of Columns:`}
          />
        ))}


        {/* GRID */}
        <div className="grid">
          {columnCounts.map((colsInRow, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid-row">
              {Array.from({ length: colsInRow }).map((_, colIndex) => {
                // Calculate cell number (1-9)
                const cellNumber = rowIndex * 3 + colIndex + 1;
                return (
                  <div className="cell-container">
                    <h3 className="panel-header">Panel {cellNumber}</h3>

                    <div key={`cell-${colIndex}`} className="grid-cell">
                      <p>
                        stuff will go here
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* <User_prompt
          originalPrompt={originalPrompt}
          setOriginalPrompt={setOriginalPrompt}
          refinedPrompt={refinedPrompt}
          setRefinedPrompt={setRefinedPrompt}
          setImage={setImage}
        /> */}
      </div>


      {/* Right White Section */}
      <div className='right-column'>
        <div className="result-section">
          <h2>Generated Image</h2>

          <div className="image-bleed">
            <div className="trim-line"></div>
            <div className="safe-area">

              {/* Where the image actually appears */}
              {image &&
                <Panel
                  image={image}
                  refinedPrompt={refinedPrompt}
                />
              }

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