// /src/components/scoreboard.js

import React from 'react';

export default function Scoreboard({ score, highScore }) {
    return (
        <div className="content scoreboard flex">
            <div className='score-panel'>Score: {score}</div>
            <div className='score-panel'>High Score: {highScore}</div>
        </div>
    );
}