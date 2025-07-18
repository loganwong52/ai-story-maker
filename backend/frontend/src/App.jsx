import { useState, useEffect } from 'react';

import './App.css'

function App() {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [image, setImage] = useState('')


  const [isRefining, setIsRefining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const refinePrompt = async () => {
    // check if user input is empty
    if (!originalPrompt.trim()) return;

    setIsRefining(true);
    try {
      const response = await fetch('/api/refine-prompt/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: originalPrompt })
      });
      const data = await response.json();
      setRefinedPrompt(data.refined_prompt);

    } catch (error) {
      console.error("Refinement failed:", error);
    } finally {
      setIsRefining(false);
    }
  }


  const generateImage = async () => {
    // Check if refined prompt is empty
    if (!refinedPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: refinedPrompt })
      });
      const data = await response.json();
      setImage(`data:image/jpeg;base64,${data.image_base64}`);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="app-container">
      <div className="input-section">
        <h2>Enter you prompt below</h2>
        <textarea
          value={originalPrompt}
          onChange={(e) => setOriginalPrompt(e.target.value)}
          rows={4}
          cols={40}
        />
        <div>
          <button
            onClick={refinePrompt}
            disabled={isRefining || !originalPrompt.trim()}
          >
            {isRefining ? 'Refining...' : 'Refine Prompt'}
          </button>
        </div>
      </div>

      {refinedPrompt && (
        <div className="input-section">
          <h2>Refined Prompt</h2>
          <textarea
            value={refinedPrompt}
            onChange={(e) => setRefinedPrompt(e.target.value)}
            placeholder="Refined prompt will appear here"
            rows={12}
            cols={80}
          />
          <div>
            <button
              onClick={generateImage}
              disabled={isGenerating || !refinedPrompt.trim()}
            >
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </button>
          </div>
        </div>
      )}

      {image && (
        <div className="result-section">
          <h2>Generated Image</h2>
          <img src={image} alt="AI Generated" width={512} />
        </div>
      )}
    </div>
  );
}

export default App