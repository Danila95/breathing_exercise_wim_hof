import {useEffect, useRef, useState} from 'react'
import './App.css'
import {Button} from "antd";
import { PlayCircleOutlined, PauseOutlined } from '@ant-design/icons'

function App() {
    const [isPlaying, setIsPlaying] = useState(false); // Состояние для отслеживания воспроизведения
    const audioRef = useRef<HTMLAudioElement | null>(null); // Референс на аудиоплеер
    const [countBreathes, setCountBreathes] = useState(0);
    const [lastCount, setLastCount] = useState(0);

    useEffect(() => {
        let intervalId;

        if (isPlaying) {
            intervalId = setInterval(() => {
                setCountBreathes(prevNum => prevNum + 1);
            }, 2500);
        }

        // Очистка эффекта при размонтировании компонента
        return () => {
            clearInterval(intervalId);
            setLastCount(countBreathes);
        };
    }, [isPlaying]);

    useEffect(() => {
        if (countBreathes === 40) {
            if ("pause" in audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setIsPlaying(false);
        }
    }, [countBreathes]);

    // Функция для переключения между воспроизведением и паузой
    const handleStartBreathe = () => {
        if (!isPlaying) {
            if (audioRef.current) {
                // Начинаем воспроизведение
                if ("play" in audioRef.current) {
                    audioRef.current.play();
                }
            }
            setIsPlaying(true);
        } else {
            if (audioRef.current) {
                // Ставим на паузу
                if ("pause" in audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    setCountBreathes(0)
                    setLastCount(0)
                }
            }
            setIsPlaying(false);
        }
    }

    return (
        <>
            <Button
                onClick={handleStartBreathe}
                icon={isPlaying ? <PauseOutlined/> : <PlayCircleOutlined/>}
                size='large'
                iconPosition='end'
            >
                {isPlaying ? 'Stop' : 'Play'}
            </Button>
            <div>
                Количество вдохов/выдохов: {countBreathes}
            </div>

            {/* Аудиоплеер */}
            <audio ref={audioRef} src="/01_Marina1.m4a" hidden/>
        </>
    )
}

export default App
