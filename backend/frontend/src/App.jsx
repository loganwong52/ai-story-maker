import { useState, useEffect } from 'react';
import './App.css'
import User_prompt from './components/module_1';
import Panel from './components/module_2';

function App() {
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [image, setImage] = useState(null)



  return (
    <div className="app-container">

      {/* Left section w/ User Prompts */}
      <div className="left-column">
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