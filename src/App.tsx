import {useEffect, useRef, useState} from 'react'
import { Button, Slider } from 'antd'
import {PlayCircleOutlined, PauseOutlined, SettingOutlined} from '@ant-design/icons'
import { SettingModal } from './components/SettingModal'

function App() {
    const [isPlaying, setIsPlaying] = useState(false); // Состояние для отслеживания воспроизведения
    const [speedAudio, setSpeedAudio] = useState(0.8) // Скорость дыхания
    const audioRef = useRef<HTMLAudioElement | null>(null); // Референс на аудиоплеер
    const [countBreathes, setCountBreathes] = useState(0);
    const [isOpenModal, setIsOpenModal] = useState(false)
    // const [lastCount, setLastCount] = useState(0);

    const openSettingModal = () => {
        setIsOpenModal(true)
    }

    const closeSettingModal = () => {
        setIsOpenModal(false)
    }

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>

        if (isPlaying) {
            intervalId = setInterval(() => {
                setCountBreathes(prevNum => prevNum + 1)
            }, 2450 / speedAudio)
        }

        // Очистка эффекта при размонтировании компонента
        return () => {
            clearInterval(intervalId)
            // setLastCount(countBreathes)
        }
    }, [countBreathes, isPlaying, speedAudio])

    useEffect(() => {
        if (countBreathes === 40) {
            if (audioRef.current) {
                if ("pause" in audioRef.current) {
                    audioRef.current.pause()
                }
                if ("currentTime" in audioRef.current) {
                    audioRef.current.currentTime = 0
                }
                setCountBreathes(0)
            }
            setIsPlaying(false)
        }
    }, [countBreathes])

    useEffect(() => {
        if (audioRef.current) {
            if ("playbackRate" in audioRef.current) {
                audioRef.current.playbackRate = speedAudio
            }
        }
    }, [speedAudio])


	// Функция для переключения между воспроизведением и паузой
    const handleStartBreathe = () => {
        if (!isPlaying) {
            if (audioRef.current) {
                // Начинаем воспроизведение
                if ('play' in audioRef.current) {
                    audioRef.current.play()
                }
            }
            setIsPlaying(true)
        } else {
            if (audioRef.current) {
                // Ставим на паузу
                if ('pause' in audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.currentTime = 0
                    setCountBreathes(0)
                    // setLastCount(0)
                }
            }
            setIsPlaying(false)
        }
    }

    const handleSpeedAudio = (newValue: number) => {
        setSpeedAudio(newValue)
    }

    return (
        <div style={{margin: '50px'}}>
            <Button
                type="link"
                onClick={() => openSettingModal()}
                icon={<SettingOutlined />}
            >
                Настройки
            </Button>
            <SettingModal
                isOpenModal={isOpenModal}
                onClose={() => closeSettingModal()}
            />
            <Button
                onClick={handleStartBreathe}
                icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
                size='large'
                iconPosition='end'
            >
                {isPlaying ? 'Stop' : 'Play'}
            </Button>
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <div>Количество вдохов/выдохов: {countBreathes}</div>
            <Slider
                min={0.8}
                max={2}
                step={0.1}
                onChange={handleSpeedAudio}
                value={speedAudio}
            />

            {/* Аудиоплеер */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio
                ref={audioRef}
                src='/01_Marina1.m4a'
                hidden
            />
        </div>
    )
}

export default App
