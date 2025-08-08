import { useState } from 'react';

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
        // console.log(refinedPrompt)

        // Check if refined prompt is empty
        if (!refinedPrompt.trim()) return;

        setIsGenerating(true);
        try {

            // Generate image temporary URL
            const generateResponse = await fetch('/api/generate-image/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: refinedPrompt })
            });
            const generate_data = await generateResponse.json();
            const image_url = generate_data.image_url;
            console.log("image_url:", image_url)

            // Turn temp URL to permanent URL
            const uploadResponse = await fetch('/api/upload-image/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: image_url }) // Your temp URL
            });
            const upload_data = await uploadResponse.json();
            const permanent_url = upload_data.image_url;
            console.log("Permanent URL:", permanent_url);

            updateModule('image', permanent_url);


            // let data;
            // try {
            //     data = await response.json();
            // } catch {
            //     throw new Error("Server returned invalid JSON");
            // }

            // if (!response.ok) {
            //     throw new Error(data.error || "Image generation failed");
            // }

            // // 2. Upload to Supabase
            // console.log("Supabase instance:", supabase)
            // // Get the URL
            // const imageUrl = data.image_url;
            // console.log("Generate Image URL:", imageUrl)
            // // Make an HTTP request to the URL
            // const imageResponse = await fetch(imageUrl);
            // // Convert response to a binary large object
            // const blob = await imageResponse.blob();

            // const blob = await response.blob();


            // // Get a reference to the Supabase storage bucket
            // const storageBucket = supabase.storage.from('ai-story-maker');
            // // Generate a unique filename (timestamp + .jpg)
            // const fileName = `generated/${Date.now()}.jpg`;
            // // Upload the blob to Supabase Storage
            // const uploadResult = await storageBucket.upload(fileName, blob);
            // // Destructure the result into `data` (renamed to supabaseData) and `error`
            // const { data: supabaseData, error } = uploadResult;
            // if (error) throw error;


            // // Upload to Supabase
            // const fileName = `generated/${Date.now()}.jpg`;

            // // Get a reference to the storage bucket
            // const imageBucket = supabase.storage.from('ai-story-maker');
            // // Define the upload options
            // const uploadOptions = {
            //     contentType: 'image/jpeg',  // Explicitly set the MIME type
            //     upsert: false              // Don't overwrite if file exists
            // };
            // // Execute the upload
            // const { error } = await imageBucket.upload(fileName, blob, uploadOptions);
            // // Handle errors
            // if (error) {
            //     console.error('Upload failed:', error);
            //     throw new Error(`Image upload failed: ${error.message}`);
            // }


            // // Get permanent URL
            // // Get the storage bucket reference (unique variable name)
            // const aiStoryMakerBucket = supabase.storage.from('ai-story-maker');
            // // Generate the public URL (store response in a separate variable)
            // const publicUrlResult = aiStoryMakerBucket.getPublicUrl(supabaseData.path);
            // // Destructure the nested `publicUrl` from the response
            // const publicUrl = publicUrlResult.data.publicUrl;

            // // Get permanent URL
            // const { data: { publicUrl } } = supabase.storage
            //     .from('ai-story-maker')
            //     .getPublicUrl(fileName);

            // Success
            // Add image to dictionary in list
            // updateModule('image', `data:image/jpeg;base64,${data.image_base64}`);
            // updateModule('image', publicUrl);

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