import Resizable from 'react-resizable-layout';

const ResizablePanel = ({ image }) => {
    return (
        <Resizable axis="both">
            {({ position, separatorProps }) => (  // Destructure the render props
                <div
                    style={{
                        width: position.width,
                        height: position.height,
                        position: 'relative'
                    }}
                    {...separatorProps}  // Attach resize handles
                >
                    <img
                        src={image}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: 20,
                            height: 20,
                            background: 'blue',
                            cursor: 'se-resize'
                        }}
                        {...separatorProps}  // Visual resize handle
                    />
                </div>
            )}
        </Resizable>
    );
};

export default ResizablePanel;