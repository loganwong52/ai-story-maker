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

        {/* Dynamic dropdowns - using map instead of for loop */}
        {Array.from({ length: selectedNumber }).map((_, index) => (
          <NumberDropdown
            key={index}  // Important for React's reconciliation
            selectedNumber={1}  // Temporary static value
            setSelectedNumber={() => { }}  // Temporary empty function
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