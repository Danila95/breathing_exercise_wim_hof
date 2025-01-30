import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Button, Slider } from 'antd'
import { PlayCircleOutlined, PauseOutlined } from '@ant-design/icons'

function App() {
	const [isPlaying, setIsPlaying] = useState(false) // Состояние для отслеживания воспроизведения
	const [speedAudio, setSpeedAudio] = useState(1) // Скорость дыхания
	const audioRef = useRef<HTMLAudioElement | null>(null) // Референс на аудиоплеер
	const [countBreathes, setCountBreathes] = useState(0)
	// const [lastCount, setLastCount] = useState(0)

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
				audioRef.current.pause()
				audioRef.current.currentTime = 0
				setCountBreathes(0)
			}
			setIsPlaying(false)
		}
	}, [countBreathes])

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.playbackRate = speedAudio
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
		<>
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
				min={0.9}
				max={2}
				step={0.2}
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
		</>
	)
}

export default App
