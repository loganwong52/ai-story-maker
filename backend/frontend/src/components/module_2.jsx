import './Panel.css';

function Panel({ modules, activePanelId, hasBorder, zoomLevel = 1, position }) {
    /* 
    modules: dictionary 
    activePanelId: int; the panel number of the most recent generated image
    hasBorder: boolean
    zoomLevel: int; amount to zoom in/out on image
    */
    const panel_image = modules.find(m => m.panelId === activePanelId).image
    const refinedPrompt = modules.find(m => m.panelId === activePanelId).refinedPrompt

    return (
        <div className="panel-image-container"
            style={{
                border: hasBorder ? '2.5px solid black' : 'none',
                background: hasBorder ? 'black' : 'transparent'
            }}
        >
            <img
                className='panel-image'
                src={panel_image}
                alt="AI Generated Image"
                title={refinedPrompt}
                style={{
                    // Zoom in/out
                    transform: `
                        translate(${position.x}px, ${position.y}px)
                        scale(${zoomLevel})`,
                    // changing zoomLevel causes zoom in/out
                }}
            />
        </div>

    );
}

export default Panel