function NumberDropdown({ selectedNumber = 1, setSelectedNumber, label_text }) {

    return (
        <div>
            <label htmlFor="number-select">{label_text} </label>
            <select
                id="number-select"
                value={selectedNumber}
                onChange={(e) => setSelectedNumber(parseInt(e.target.value))}
            >
                {[1, 2, 3].map((num) => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>
        </div>
    );
}

export default NumberDropdown;