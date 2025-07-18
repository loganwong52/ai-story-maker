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

  // // Add keypress handler
  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter' && !isLoading && prompt.trim()) {
  //     generateImage();
  //   }
  // };

  // // Set up event listener
  // useEffect(() => {
  //   const input = document.getElementById('prompt-input');
  //   input.addEventListener('keypress', handleKeyPress);
  //   return () => input.removeEventListener('keypress', handleKeyPress);
  // }, [prompt, isLoading]);  // Re-run when these change


  return (
    <div className="app-container">
      <div className="input-section">
        <h2>Original Prompt</h2>
        <input
          value={originalPrompt}
          onChange={(e) => setOriginalPrompt(e.target.value)}
          placeholder="Enter your initial prompt here"
        />
        <button
          onClick={refinePrompt}
          disabled={isRefining || !originalPrompt.trim()}
        >
          {isRefining ? 'Refining...' : 'Refine Prompt'}
        </button>
      </div>

      {refinedPrompt && (
        <div className="input-section">
          <h2>Refined Prompt</h2>
          <textarea
            value={refinedPrompt}
            onChange={(e) => setRefinedPrompt(e.target.value)}
            placeholder="Refined prompt will appear here"
            rows={4}
          />
          <button
            onClick={generateImage}
            disabled={isGenerating || !refinedPrompt.trim()}
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
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