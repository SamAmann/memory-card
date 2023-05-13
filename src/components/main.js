// /src/components/main.js

import React from "react";

export default function Main({ images, handleImageClick }) {
    return (
        <main>
            <div className="grid">
                {images.map((image) => (
                    <div className="card center" key={image.title} onClick={() => handleImageClick(image.url)}>
                        <img className="card-img" src={image.url} alt={image.alt_description} />
                        <h5 className="flex center">{image.title}</h5>
                    </div>
                ))}
            </div>
        </main>
    );
}
