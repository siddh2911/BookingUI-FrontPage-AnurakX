import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './BackgroundMusic.css';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="background-music-container">
            <audio
                ref={audioRef}
                src="/background.mp3"
                loop
                preload="auto"
            />

            <button
                className={`music-toggle-btn ${isPlaying ? 'active' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause Music" : "Play Music"}
                type="button"
            >
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                <span className="music-label">{isPlaying ? "Pause Music" : "Play Music"}</span>
            </button>
        </div>
    );
};

export default BackgroundMusic;
