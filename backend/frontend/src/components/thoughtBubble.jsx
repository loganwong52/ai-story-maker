// ThoughtBubble.jsx (inline styles only)
function ThoughtBubble({
    style,
    stroke = 2,
    fill = 'white',
    strokeColor = 'black',
    children,
}) {
    // viewBox is 300x200; scale by setting width/height in `style`
    return (
        <svg
            viewBox="0 0 300 200"
            style={{ display: 'block', position: 'absolute', ...style }}
        >
            {/* One continuous cloud outline */}
            <path
                d="
                    M 80 165
                    C 60 165, 45 145, 55 125

                    C 30 115, 30 90, 50 80
                    C 40 60, 55 40, 75 50
                    C 70 35, 85 25, 100 30
                    C 110 15, 140 15, 150 30
                    C 165 20, 190 20, 200 35
                    C 220 30, 235 45, 230 60
                    C 250 60, 265 80, 255 100
                    C 275 110, 270 140, 245 145
                    C 250 160, 230 175, 210 170
                    C 200 185, 170 185, 160 170
                    C 160 170, 140 190, 110 170
                    C 110 170, 90 180, 80 165
                    "
                fill={fill}
                stroke={strokeColor}
                strokeWidth={stroke}
            />


        </svg>
    );
}


export default ThoughtBubble