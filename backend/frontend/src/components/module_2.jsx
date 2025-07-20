function Panel(image, refinedPrompt) {
    return (
        <img src={image}
            alt="AI Generated Image"
            title={refinedPrompt}
        />
    );
}


export default Panel