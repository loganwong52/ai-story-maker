import { useState } from 'react';

function Panel(image, refinedPrompt) {
    const [hasBorder, setHasBorder] = useState(true);

    const toggleBorder = () => {
        setHasBorder(!hasBorder);
    };

    return (
        <div>
            <img src={image}
                alt="AI Generated Image"
                title={refinedPrompt}
                style={{
                    border: hasBorder ? '3px solid black' : 'none',
                }}
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