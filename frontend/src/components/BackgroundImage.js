import React from 'react';
import backgroundImage from './FAM.png';

function BackgroundImage() {
  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    width: '500px',
    height: '610px',
    position: 'absolute', // Ändrat från 'fixed' till 'absolute'
    bottom: '-300px',
    right: '5px',
    zIndex: -1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    opacity: 0.8,  // Gör bilden lite genomskinlig
  };

  const textStyle = {
    color: 'white',
    fontSize: '19px',
    marginTop: '80px',  // Minskat ner från 100px för att flytta texten uppåt
    marginLeft: '10px', // Lägg till för att flytta texten lite åt vänster
    textAlign: 'left',
    lineHeight: '1.5',
  
  };

  return (
    <div style={backgroundImageStyle}>
      <p style={textStyle}>
        "Det naturliga ljudet och doften av brinnande ved kan skapa en avkopplande och fridfull miljö som främjar familjens välbefinnande.""
      </p>
    </div>
  );
}

export default BackgroundImage;
