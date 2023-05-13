// /src/App.js

import './App.css';
import React, { useState, useEffect } from 'react';
import Header from './components/header.js';
import Scoreboard from './components/scoreboard.js';
import Main from './components/main.js';
import Footer from './components/footer.js';
import config from './config.js'
import Swal from 'sweetalert2';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [nbImg, setNbImg] = useState(6);
  const [images, setImages] = useState([]);
  const [clickedImages, setClickedImages] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [beginner, setBeginner] = useState(true);

  useEffect(() => {
    fetchImages(nbImg);
  }, [nbImg]);


  async function fetchImages(nbImg) {
    let fetchedImages = [];
    while (fetchedImages.length < nbImg) {
      try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${config.NASA_API_KEY}&count=${nbImg - fetchedImages.length}`);
        const data = await response.json();
        const filteredData = data.filter((image) =>
          !fetchedImages.some((fetchedImage) => fetchedImage.url === image.url) &&
          !image.hasOwnProperty('copyright') &&
          image.media_type === 'image'
        );
        fetchedImages.push(...filteredData);
      } catch (error) {
        console.error(error);
      }
      setLoadPercentage(Math.round((fetchedImages.length / nbImg) * 100));
      if (fetchedImages.length === nbImg) {
        setIsLoading(false);
        setImages(fetchedImages);
        return;
      };
    };
  }


  const handleImageClick = (image) => {
    try {
      if (clickedImages.includes(image)) {
        setScore(0);
        setClickedImages([]);
        Swal.fire({
          icon: 'error',
          title: 'You lost!',
          text: 'Better luck next time.',
          confirmButtonText: 'Restart!',
          confirmButtonColor: '#000000b9',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            resetGame(false);
          }
        });
      } else {
        setScore((prevScore) => prevScore + 1);
        setClickedImages((prevClickedImages) => [...prevClickedImages, image]);
        shuffleImages();
        if (score + 1 > highScore) {
          setHighScore(score + 1);
        }
        if (score + 1 === nbImg) {
          Swal.fire({
            icon: 'success', // or 'error' for losing
            title: 'Congratulations!', // or 'You lost!'
            text: 'You won!', // or 'Better luck next time.'
            confirmButtonText: 'Next round!',
            confirmButtonColor: '#000000b9',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              resetGame(true);
            }
          });
        }

      }
    } catch (error) {
      console.error(error);
    }
  };

  function resetGame(won) {
    setIsLoading(true);
    setScore(0);
    setClickedImages([]);
    setLoadPercentage(0);
    won === true ? setNbImg(nbImg + 3) : fetchImages(6);
  }

  const shuffleImages = () => {
    const shuffledImages = [...images];
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }
    setImages(shuffledImages);
  };

  return (
    <div className="app-wrapper">
      {isLoading ? (
        <div className="loading-popup">
          <img className="loading-logo" src={`${process.env.PUBLIC_URL}/moon.png`} alt="loading" />

          <div className="loading-bar">
            <div className="loading-bar-fill" style={{ width: `${loadPercentage}%` }}></div>
          </div>

        </div>
      ) : (
        <>
          <div className="welcome-popup" style={{ display: (highScore === 0 && beginner) ? "flex" : "none" }}>
            <h1>Welcome!</h1>
            <p>Click on an image to earn points, but don't click on any more than once!</p>
            <button className="primary-btn" onClick={() => setBeginner(false)}>Start</button>
          </div>
          <Header />
          <Scoreboard score={score} highScore={highScore} />
          <Main images={images} handleImageClick={handleImageClick} />
          <Footer />
        </>
      )}
    </div>
  );
}