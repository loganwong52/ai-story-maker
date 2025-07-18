import { useState, useEffect } from 'react';

import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState('')
  const [refinedPrompt, setRefinedPrompt] = useState('')

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  const generateImage = async () => {
    // Disable Generate button
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-image/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await response.json()
      console.log("API Response:", data);

      setRefinedPrompt(data.refined_prompt)
      setImage(`data:image/jpeg;base64,${data.image_base64}`)

    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      // Re-enable button
      setIsLoading(false)

    }

  }

  // Add keypress handler
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && prompt.trim()) {
      generateImage();
    }
  };

  // Set up event listener
  useEffect(() => {
    const input = document.getElementById('prompt-input');
    input.addEventListener('keypress', handleKeyPress);
    return () => input.removeEventListener('keypress', handleKeyPress);
  }, [prompt, isLoading]);  // Re-run when these change


  return (
    <div>
      <input
        id="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="User prompt goes here"
      />
      <button onClick={generateImage}
        disabled={isLoading} // Disable during loading
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </button>

      {refinedPrompt && <p>Refined Prompt: {refinedPrompt}</p>}
      {image && <img src={image} alt="AI Generated" width={512} />}
    </div>
  )
}

export default App