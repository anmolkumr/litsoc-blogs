import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

const ApiDocumentation = () => {
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
      fetch(`${process.env.REACT_APP_API}/uploads/apidocument.md`)
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