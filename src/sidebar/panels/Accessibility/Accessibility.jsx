import { useState } from 'react';

function Accessibility () {
    const [sitename, setSite] = useState('');

    return (
        <>
            <h1>Block Sites: </h1>
            <input type = "text" placeholder = "Enter site here" className = "input text" />
        </>
    )
}

export default Accessibility;