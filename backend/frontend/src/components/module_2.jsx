import { useState } from 'react';

// function Panel(image, refinedPrompt) {
function Panel({ modules, activePanelId }) {
    // console.log(typeof modules)
    // console.log(modules)
    // console.log(activePanelId)

    const panel_image = modules.find(m => m.panelId === activePanelId).image
    const refinedPrompt = modules.find(m => m.panelId === activePanelId).refinedPrompt

    const [hasBorder, setHasBorder] = useState(true);

    const toggleBorder = () => {
        setHasBorder(!hasBorder);
    };

    // console.log(refinedPrompt)

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={panel_image}
                alt="AI Generated Image"
                title={refinedPrompt}
                style={{
                    border: hasBorder ? '3px solid black' : 'none',
                }}
                className='panel-image'
            />

            <label style={{ color: 'black' }}>
                <input
                    type="checkbox"
                    checked={hasBorder}
                    onChange={toggleBorder}
                />
                Border on/off
            </label>
        </div>

    );
}

export default Panel