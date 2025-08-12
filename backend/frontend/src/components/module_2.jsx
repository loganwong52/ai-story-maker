function Panel({ modules, activePanelId, hasBorder }) {
    /* 
    modules: dictionary 
    activePanelId: int; the panel number of the most recent generated image
    hasBorder: boolean
    */
    const panel_image = modules.find(m => m.panelId === activePanelId).image
    const refinedPrompt = modules.find(m => m.panelId === activePanelId).refinedPrompt

    return (
        <div className="panel-image-container">
            <img src={panel_image}
                alt="AI Generated Image"
                title={refinedPrompt}
                style={{
                    border: hasBorder ? '10px solid black' : 'none',
                }}
                className='panel-image'
            />
        </div>

    );
}

export default Panel