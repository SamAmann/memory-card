// /src/components/scoreboard.js

import React from 'react';

export default function Scoreboard({ score, highScore }) {
    return (
        <div className="scoreboard flex">
            <p>Score: {score}</p>
            <p>High Score: {highScore}</p>
        </div>
    );
}