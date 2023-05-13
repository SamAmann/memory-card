// /src/App.js

import './App.css';
import React, { useState, useEffect } from 'react';
import Header from './components/header.js';
import Scoreboard from './components/scoreboard.js';
import Main from './components/main.js';
import Footer from './components/footer.js';
import { NASA_API_KEY } from './config.js';
import Swal from 'sweetalert2';



export default function App() {
  const [isLoading, setIsLoading] = useState();
  const [nbImg, setNbImg] = useState(8);
  const [images, setImages] = useState([]);
  const [clickedImages, setClickedImages] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    fetchImages(nbImg);
  }, [nbImg]);

  const handleImageClick = (image) => {
    try {
      if (clickedImages.includes(image)) {
        setScore(0);
        setClickedImages([]);
        Swal.fire({
          icon: 'error',
          title: 'You lost!',
          text: 'Better luck next time.',
          confirmButtonText: 'Play again',
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
    (won === true) ? setNbImg(nbImg + 2) : setNbImg(nbImg);
    fetchImages(nbImg);
  }

  async function fetchImages(nbImg) {
    setIsLoading(true);
    const fetchedImages = [];
    while (fetchedImages.length < nbImg) {
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=${nbImg - fetchedImages.length}`);
      const data = await response.json();
      const filteredData = data.filter((image) =>
        !fetchedImages.some((fetchedImage) => fetchedImage.url === image.url) &&
        !image.hasOwnProperty('copyright') &&
        image.media_type === 'image'
      );
      fetchedImages.push(...filteredData);
    }
    setImages(fetchedImages);
    setIsLoading(false);
  };

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
        <div className="loading-popup">Loading...</div>
      ) : (
        <>
          <Header />
          <Scoreboard score={score} highScore={highScore} />
          <Main images={images} handleImageClick={handleImageClick} />
          <Footer />
        </>
      )}
    </div>
  );
}

