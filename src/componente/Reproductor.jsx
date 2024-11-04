import { useState, useEffect, useRef } from 'react';

import './Reproductor.css';

const Reproductor = ({ onClose, paragraphs, setCurrentParagraphIndex, currentParagraphIndex }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [volume, setVolume] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const sintesis = window.speechSynthesis;
  const intervalRef = useRef(null);
  const [rate, setRate] = useState(1); // Nuevo estado para la velocidad
  const remainingTextRef = useRef('');
  const currentCharIndexRef = useRef(0);

  // Calcular la duración total de la lectura
  const calculateTotalDuration = () => {
    return paragraphs.reduce((total, paragraph) => total + (paragraph.split(' ').length * 0.75), 0); // Ajustando a 0.75 segundos por palabra para mayor precisión
  };

  const startReadingFromParagraph = (index, charIndex = 0) => {
    if (index >= paragraphs.length) return;

    const selectedText = paragraphs[index].slice(charIndex);
    const newUtterance = new SpeechSynthesisUtterance(selectedText);
    newUtterance.lang = 'es-MX';
    newUtterance.volume = volume;
    newUtterance.rate = rate;
    newUtterance.pitch = 1;

    let cumulativeDuration = paragraphs.slice(0, index).reduce((total, paragraph) => total + (paragraph.split(' ').length * 0.75), 0);

    newUtterance.onboundary = (event) => {
      if (event.name === "word") {
        const wordsSoFar = selectedText.slice(0, event.charIndex).split(" ").length;
        const elapsedTimeForCurrentParagraph = wordsSoFar * 0.75; // Aproximación de 0.75s por palabra
        setElapsedTime(cumulativeDuration + elapsedTimeForCurrentParagraph);
        currentCharIndexRef.current = event.charIndex;
      }
    };

    newUtterance.onend = () => {
      const nextIndex = index + 1;
      if (nextIndex < paragraphs.length) {
        setCurrentParagraphIndex(nextIndex);
        startReadingFromParagraph(nextIndex);
      } else {
        setIsPlaying(false);
        setElapsedTime(totalDuration);
      }
    };

    setUtterance(newUtterance);
    sintesis.cancel();
    sintesis.speak(newUtterance);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!paragraphs || paragraphs.length === 0 || !('speechSynthesis' in window)) {
      console.error("No hay párrafos o síntesis de voz no soportada.");
      return;
    }

    const totalDur = calculateTotalDuration();
    setTotalDuration(totalDur);

    startReadingFromParagraph(currentParagraphIndex);

    return () => {
      sintesis.cancel();
      clearInterval(intervalRef.current);
    };
  }, [paragraphs, currentParagraphIndex, volume]);

  useEffect(() => {
    if (utterance) {
      utterance.volume = volume;
    }
  }, [volume, utterance]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (!utterance) return;
    if (isPlaying) {
      sintesis.pause();
      setIsPlaying(false);
    } else {
      sintesis.resume();
      setIsPlaying(true);
    }
  };

  const toggleOnClose = () => {
    sintesis.cancel();
    onClose();
  };

  const handleSliderChange = (event) => {
    const newTime = parseFloat(event.target.value);
    setElapsedTime(newTime);

    sintesis.cancel();

    let cumulativeTime = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraphDuration = paragraphs[i].split(' ').length * 0.75; // Ajustando a 0.75 segundos por palabra
      cumulativeTime += paragraphDuration;

      if (newTime <= cumulativeTime) {
        setCurrentParagraphIndex(i);
        startReadingFromParagraph(i);
        break;
      }
    }
  };

  const handleParagraphChange = (direction) => {
    const newIndex = direction === 'forward' ? currentParagraphIndex + 1 : currentParagraphIndex - 1;
    if (newIndex >= 0 && newIndex < paragraphs.length) {
      setCurrentParagraphIndex(newIndex);
      sintesis.cancel();
      startReadingFromParagraph(newIndex);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (utterance) {
      utterance.volume = newVolume;
    }
  };

  const handleRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    setRate(newRate);

    if (utterance) {
      sintesis.cancel();
      startReadingFromParagraph(currentParagraphIndex, currentCharIndexRef.current);
    }
  };

  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <div className="player-container">

      <div className="player-header">
        <i className="bi bi-x-square" onClick={toggleOnClose}></i>
      </div>


      <div className='contenedor-de-controles'>

        {/* control  de velocidad*/}
        <div className="rate-control">
          <label htmlFor="rate-select" style={{ color: 'white' }}>Velocidad: </label>
          <select id="rate-select" value={rate} onChange={handleRateChange}>
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2">2x</option>
          </select>
        </div>



        {/* control  de   play/pause */}
        <div className="player-controls">
          <i className="bi bi-rewind" onClick={() => handleParagraphChange('backward')}></i>
          {isPlaying ? (
            <i className="bi bi-pause" onClick={togglePlay}></i>
          ) : (
            <i className="bi bi-play-circle" onClick={togglePlay}></i>
          )}
          <i className="bi bi-fast-forward" onClick={() => handleParagraphChange('forward')}></i>
        </div>



        {/* control  de volumen*/}
        <div className="volume-control">
          <i className="bi bi-volume-up-fill"></i>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: '100%' }}
          />
        </div>

      </div>



      <div className="progress-container">
        <div style={{ color: 'white' }}>
          {formatTime(elapsedTime)}
        </div>
        <input
          type="range"
          min="0"
          max={totalDuration}
          value={elapsedTime}
          onChange={handleSliderChange}
          style={{ width: '90%', margin: '0 1%' }}
        />


        <div style={{ color: 'white' }}>
          {formatTime(totalDuration - elapsedTime)}
        </div>
      </div>



    </div>
  );
};

export default Reproductor;
