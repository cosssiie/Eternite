import React from 'react';

function TitleHeader({ title }) {
    return (
        <div className="title-container">
            <h1 className="title">{title}</h1>
        </div>
    );
}

export default TitleHeader;