import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ApiDocumentation = () => {
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        fetch('/apidocument.md')
            .then((response) => response.text())
            .then((text) => setMarkdown(text));
    }, []);

    return (
        <div className="container">
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
    );
};

export default ApiDocumentation;
