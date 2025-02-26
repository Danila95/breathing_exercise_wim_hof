import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState
} from 'react'
import { Button } from 'antd'
import {
	PlayCircleOutlined,
	PauseOutlined,
	SettingOutlined
} from '@ant-design/icons'
import { SettingModal } from './components/SettingModal'

function App() {
	const [isPlaying, setIsPlaying] = useState(false) // Состояние для отслеживания воспроизведения
	const [speedAudio, setSpeedAudio] = useState(
		localStorage.getItem('speedBreath')
			? Number(localStorage.getItem('speedBreath'))
			: 0.8
	) // Скорость дыхания
	const audioRef = useRef<HTMLAudioElement | null>(null) // Референс на аудиоплеер
	const [countBreathes, setCountBreathes] = useState(0)
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
	const [cicleBreath, setCicleBreath] = useState<Array<number> | null>(
		localStorage.getItem('cicleBreath')
			? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				localStorage.getItem('cicleBreath').split('-').map(Number)
			: null
	)
	const [session, setSession] = useState<boolean>(false)
	const [oneTimeBreathHolding, setOneTimeBreathHolding] = useState<
		number | null
	>(() =>
		localStorage.getItem('oneTimeBreathHolding')
			? Number(localStorage.getItem('oneTimeBreathHolding'))
			: null
	)
	const [twoTimeBreathHolding, setTwoTimeBreathHolding] = useState<
		number | null
	>(
		localStorage.getItem('twoTimeBreathHolding')
			? Number(localStorage.getItem('twoTimeBreathHolding'))
			: null
	)
	const [threeTimeBreathHolding, setThreeTimeBreathHolding] = useState<
		number | null
	>(
		localStorage.getItem('threeTimeBreathHolding')
			? Number(localStorage.getItem('threeTimeBreathHolding'))
			: null
	)
	const [fourTimeBreathHolding, setFourTimeBreathHolding] = useState<
		number | null
	>(
		localStorage.getItem('fourTimeBreathHolding')
			? Number(localStorage.getItem('fourTimeBreathHolding'))
			: null
	)

	const [cicleOne, setCicleOne] = useState<boolean>(false)
	const [cicleTwo, setCicleTwo] = useState<boolean>(false)
	const [cicleThree, setCicleThree] = useState<boolean>(false)
	const [cicleFour, setCicleFour] = useState<boolean>(false)

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
		if (
			countBreathes === (cicleBreath && cicleBreath[0]) ||
			countBreathes === (cicleBreath && cicleBreath[1]) ||
			countBreathes === (cicleBreath && cicleBreath[2]) ||
			countBreathes === (cicleBreath && cicleBreath[3])
		) {
			if (audioRef.current) {
				if ('pause' in audioRef.current) {
					audioRef.current.pause()
				}
				if ('currentTime' in audioRef.current) {
					audioRef.current.currentTime = 0
				}
				setCountBreathes(0)
			}
			setIsPlaying(false)
		}
	}, [countBreathes])

	useEffect(() => {
		if (audioRef.current) {
			if ('playbackRate' in audioRef.current) {
				audioRef.current.playbackRate = speedAudio
			}
		}
	}, [speedAudio])

	// Функция для переключения между воспроизведением и паузой
	// autoKey - автоматический ключ по воспроизведению записи в след. цикле
	const handleStartBreathe = (autoKey?: boolean) => {
		if (!isPlaying || autoKey) {
			if (audioRef.current) {
				// Начинаем воспроизведение
				if ('play' in audioRef.current) {
					audioRef.current.play()
				}
			}
			setIsPlaying(true)
			// setSession(true)
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

	const handlerTimer = (
		time: number,
		setCicle?: Dispatch<SetStateAction<boolean>>
	) => {
		setTimeout(() => {
			console.log('handlerTimer work')
			if (setCicle) {
				setCicle(true)
				handleStartBreathe(true)
			}
		}, time)
	}

	useEffect(() => {
		if (isPlaying) {
			if (!cicleTwo && !cicleThree && !cicleFour) {
				setCicleOne(true)
			}

			if (cicleOne && cicleBreath && cicleBreath[0] === countBreathes) {
				handlerTimer(Number(oneTimeBreathHolding), setCicleTwo)
				setCicleOne(false)
				console.log('cicleOne')
			}
			if (cicleTwo && cicleBreath && cicleBreath[1] === countBreathes) {
				handlerTimer(Number(twoTimeBreathHolding), setCicleThree)
				setCicleTwo(false)
				console.log('cicleTwo')
			}
			if (cicleThree && cicleBreath && cicleBreath[2] === countBreathes) {
				handlerTimer(Number(threeTimeBreathHolding), setCicleFour)
				setCicleThree(false)
				console.log('cicleThree')
			}
			if (cicleFour && cicleBreath && cicleBreath[3] === countBreathes) {
				handlerTimer(Number(fourTimeBreathHolding))
				setCicleFour(false)
				console.log('cicleFour')
			}

			// если упражнение всего на 3 цикла
			// if (cicleBreath && cicleBreath[3] === undefined) {
			// 	setSession(false)
			// }
		}
	}, [
		isPlaying,
		cicleOne,
		countBreathes,
		cicleBreath,
		cicleTwo,
		cicleThree,
		cicleFour,
		oneTimeBreathHolding,
		twoTimeBreathHolding,
		threeTimeBreathHolding,
		fourTimeBreathHolding
	])

	return (
		<div style={{ margin: '50px' }}>
			{!isPlaying && (
				<Button
					type='link'
					onClick={() => openSettingModal()}
					icon={<SettingOutlined />}
				>
					Настройки
				</Button>
			)}
			<SettingModal
				isOpenModal={isOpenModal}
				onClose={() => closeSettingModal()}
				speedAudio={speedAudio}
				setSpeedAudio={setSpeedAudio}
				setCicleBreath={setCicleBreath}
				setOneTimeBreathHolding={setOneTimeBreathHolding}
				setTwoTimeBreathHolding={setTwoTimeBreathHolding}
				setThreeTimeBreathHolding={setThreeTimeBreathHolding}
				setFourTimeBreathHolding={setFourTimeBreathHolding}
			/>
			<div
				style={{
					margin: '50px',
					padding: '50px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center'
				}}
			>
				<Button
					onClick={() => handleStartBreathe()}
					icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
					size='large'
					iconPosition='end'
				>
					{isPlaying ? 'Stop' : 'Play'}
				</Button>
				<div
					style={{
						marginTop: '50px'
					}}
				>
					Количество вдохов/выдохов: {countBreathes}
				</div>
			</div>

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
