import { useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState('')
  const [refinedPrompt, setRefinedPrompt] = useState('')

  const generateImage = async () => {
    const response = await fetch('/api/generate-image/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    const data = await response.json()
    setRefinedPrompt(data.refined_prompt)
    setImage(`data:image/jpeg;base64,${data.image_base64}`)
  }

  return (
    <div>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="User prompt goes here"
      />
      <button onClick={generateImage}>Generate</button>

      {refinedPrompt && <p>Refined: {refinedPrompt}</p>}
      {image && <img src={image} alt="AI Generated" width={512} />}
    </div>
  )
}

export default App