import './Panel.css';

function Panel({ modules, activePanelId, hasBorder, zoomLevel = 1 }) {
    /* 
    modules: dictionary 
    activePanelId: int; the panel number of the most recent generated image
    hasBorder: boolean
    */
    const panel_image = modules.find(m => m.panelId === activePanelId).image
    const refinedPrompt = modules.find(m => m.panelId === activePanelId).refinedPrompt

    return (
        <div className="panel-image-container"
            style={{
                border: hasBorder ? '2.5px solid black' : 'none',
            }}
        >
            <img
                src={panel_image}
                alt="AI Generated Image"
                title={refinedPrompt}
                style={{
                    // Zoom in/out
                    transform: `scale(${zoomLevel})`,
                    // changing zoomLevel causes zoom in/out
                }}
                className='panel-image'
            />
        </div>

    );
}

export default Panel