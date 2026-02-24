import React from 'react';

function TitleHeader({ title }) {
    return (
        <div className="title-container">
            <div className="grid-col-1">
                <h1 className="title">{title}</h1>
            </div>
        </div>
    );
}

export default TitleHeader;