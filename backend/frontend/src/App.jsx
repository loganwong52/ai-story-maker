import { useState, useEffect } from 'react';
import './App.css'
import User_prompt from './components/module_1';
import Panel from './components/module_2';
import NumberDropdown from './components/module_3';

function App() {
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [image, setImage] = useState(null)
  const [selectedNumber, setSelectedNumber] = useState(1);

  // A state that's an ARRAY, not a number
  const [columnCounts, setColumnCounts] = useState([1]);
  // columnCounts is an array
  // length of columnCounts == Number of Rows
  // Each index's value is the Number of Columns in that corresponding Row


  // useEffect for the number dropdowns
  // This "listens" for whenever selectedNumber changes to Update columnCounts
  // Basically: columnCounts needs to update whenever the number of columns changes, obviously, 
  // BUT ALSO: whenever the number of rows changes too
  useEffect(() => {
    setColumnCounts(prev => {
      // 1. copy columnCounts
      const newCounts = [...prev];

      // Add new rows with 1 column
      while (newCounts.length < selectedNumber) {
        newCounts.push(1); // Add new rows with 1 column
      }

      // Remove any extra rows
      while (newCounts.length > selectedNumber) {
        newCounts.pop();
      }

      console.log(newCounts)
      // Update columnCounts (NOT selectedNumber)
      return newCounts;
    });
  }, [selectedNumber]);

  return (
    <div className="app-container">
      {/* Left section w/ User Prompts */}
      <div className="left-column">
        {/* Dropdowns to choose Row # and Col #s */}
        <NumberDropdown
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
          label_text={"Number of rows:"}
        />

        {/* Dynamic dropdowns - map is used, not a for loop */}
        {Array.from({ length: selectedNumber }).map((_, index) => (
          <NumberDropdown
            key={index}
            selectedNumber={columnCounts[index]}
            setSelectedNumber={(newValue) => {
              // 1. create a copy of the old array
              const newCounts = [...columnCounts];
              // 2. update the copy
              newCounts[index] = newValue;
              // 3. Replace the entire old array with the new updated version
              setColumnCounts(newCounts);
            }}
            label_text={`Row ${index + 1}; Number of Columns:`}
          />
        ))}


        <User_prompt
          originalPrompt={originalPrompt}
          setOriginalPrompt={setOriginalPrompt}
          refinedPrompt={refinedPrompt}
          setRefinedPrompt={setRefinedPrompt}
          setImage={setImage}
        />
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