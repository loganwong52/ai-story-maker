// import { useState } from 'react';

// function User_prompt({ originalPrompt = "", setOriginalPrompt, refinedPrompt = "", setRefinedPrompt, setImage }) {
//     const [isRefining, setIsRefining] = useState(false);
//     const [isGenerating, setIsGenerating] = useState(false);


//     const handleFileUpload = async (e) => {
//         // Get file if it exists
//         const file = e.target.files[0];
//         if (!file) return;

//         // Append file to FormData
//         const formData = new FormData();
//         formData.append('file', file);

//         try {
//             // Send file to Django
//             const response = await fetch('/api/extract-text/', {
//                 method: 'POST',
//                 body: formData,
//             });

//             const data = await response.json();
//             if (data.error) throw new Error(data.error);

//             // Update textarea with extracted text
//             setOriginalPrompt(data.text);

//         } catch (error) {
//             alert(`Error: ${error.message}`);
//         }
//     };

//     const refinePrompt = async () => {
//         // check if user input is empty
//         if (!originalPrompt.trim()) return;

//         setIsRefining(true);
//         try {
//             const response = await fetch('/api/refine-prompt/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ prompt: originalPrompt })
//             });
//             const data = await response.json();
//             setRefinedPrompt(data.refined_prompt);

//         } catch (error) {
//             console.error("Refinement failed:", error);
//         } finally {
//             setIsRefining(false);
//         }
//     };

//     const generateImage = async () => {
//         // Check if refined prompt is empty
//         if (!refinedPrompt.trim()) return;

//         setIsGenerating(true);
//         try {
//             const response = await fetch('/api/generate-image/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ prompt: refinedPrompt })
//             });
//             const data = await response.json();
//             setImage(`data:image/jpeg;base64,${data.image_base64}`);
//         } catch (error) {
//             console.error("Generation failed:", error);
//         } finally {
//             setIsGenerating(false);
//         }
//     };

//     return (
//         <div>
//             <div className="input-section">
//                 <h2>Original prompt</h2>
//                 <textarea
//                     value={originalPrompt}
//                     onChange={(e) => setOriginalPrompt(e.target.value)}
//                     placeholder="Enter your prompt here"
//                     rows={4}
//                     cols={40}
//                 />

//                 <div className='upload-text-file-functionality'>
//                     <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileUpload} />
//                 </div>

//                 <div className='refine-prompt-div'>
//                     <button
//                         onClick={refinePrompt}
//                         disabled={isRefining || !originalPrompt.trim()}
//                     >
//                         {isRefining ? 'Refining...' : 'Refine Prompt'}
//                     </button>
//                 </div>
//             </div>

//             <div className="input-section refined-section">
//                 <h2>Refined Prompt</h2>
//                 <textarea
//                     value={refinedPrompt}
//                     onChange={(e) => setRefinedPrompt(e.target.value)}
//                     placeholder="Refined prompt will appear here"
//                     rows={12}
//                     cols={80}
//                     disabled={!originalPrompt}
//                 />

//                 <div className='generate-img-div'>
//                     <button
//                         onClick={generateImage}
//                         disabled={isGenerating || !refinedPrompt.trim()}
//                     >
//                         {isGenerating ? 'Generating...' : 'Generate Image'}
//                     </button>
//                 </div>
//             </div>

//             {/* End of Left column */}
//         </div>
//     );
// }

// export default User_prompt;

import { useState } from 'react';
// setOriginalPrompt, setRefinedPrompt, setImage
function User_prompt({ panelId = 0, modules = [], setModules, setActivePanelId }) {
    const module = modules.find((m) => m.panelId === panelId);

    const originalPrompt = module.originalPrompt
    const refinedPrompt = module.refinedPrompt

    const [isRefining, setIsRefining] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);


    const updateModule = (key, value) => {
        setModules(oldModules =>
            oldModules.map(module => {
                if (module.panelId !== panelId)
                    // The panelId is NOT in the list; no changes made
                    return module;

                // Create a copy
                const shallowCopy = { ...module };
                // Update key-value pair
                shallowCopy[key] = value;
                return shallowCopy;
            })
        );
    };

    const handleFileUpload = async (e) => {
        // Get file if it exists
        const file = e.target.files[0];
        if (!file) return;

        // Append file to FormData
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Send file to Django
            const response = await fetch('/api/extract-text/', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // Update textarea with extracted text
            updateModule('originalPrompt', data.text);

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

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
            updateModule('refinedPrompt', data.refined_prompt);

        } catch (error) {
            console.error("Refinement failed:", error);
        } finally {
            setIsRefining(false);
        }
    };

    const generateImage = async () => {
        console.log(refinedPrompt)

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
            // Add image to dictionary in list
            updateModule('image', `data:image/jpeg;base64,${data.image_base64}`);
            // set boolean in the dictionary in the list
            updateModule('visible', true);

            // Successful API call:
            setActivePanelId(panelId);

        } catch (error) {
            console.error("Generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="input-section">
            <div className="original-prompt-section">
                <h5>Original prompt</h5>
                <textarea
                    value={originalPrompt}
                    onChange={(e) => updateModule('originalPrompt', e.target.value)}
                    placeholder="Enter your prompt here"
                    rows={3}
                // cols={4}
                />

                <div className='upload-text-file-functionality'>
                    <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileUpload} />
                </div>

                <div className='refine-prompt-div'>
                    <button
                        onClick={refinePrompt}
                        disabled={isRefining || !originalPrompt.trim()}
                    >
                        {isRefining ? 'Refining...' : 'Refine Prompt'}
                    </button>
                </div>
            </div>

            <div className="refined-prompt-section">
                <h5>Refined Prompt</h5>
                <textarea
                    value={refinedPrompt}
                    onChange={(e) => updateModule('refinedPrompt', e.target.value)}
                    placeholder="Refined prompt will appear here"
                    rows={8}
                    disabled={!originalPrompt}
                />

                <div className='generate-img-div'>
                    <button
                        onClick={generateImage}
                        disabled={isGenerating || !refinedPrompt.trim()}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Image'}
                    </button>
                </div>
            </div>

            {/* End of Left column */}
        </div>
    );
}

export default User_prompt;