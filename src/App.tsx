import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'
import { Button, Flex } from 'antd'
import {
	PlayCircleOutlined,
	PauseOutlined,
	SettingOutlined
} from '@ant-design/icons'
import { CountdownTimer } from '@/components/CountdownTimer'
import { Timer } from '@/components/Timer'
import { Counter } from '@/components/Counter'
import { SettingModal } from './components/SettingModal'

function App() {
	const [isPlaying, setIsPlaying] = useState(false) // Состояние для отслеживания воспроизведения
	const [speedAudio, setSpeedAudio] = useState<number | any | void>(
		localStorage.getItem('speedBreath')
			? Number(localStorage.getItem('speedBreath'))
			: localStorage.setItem('speedBreath', '0.8')
	) // Скорость дыхания
	const audioRef = useRef<HTMLAudioElement | null>(null) // Референс на аудиоплеер
	const triangleSoundEffectRef = useRef<HTMLAudioElement | null>(null) // Референс на аудиоплеер
	const [countBreathes, setCountBreathes] = useState(0)
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
	const [holdingBreath, setHoldingBreath] = useState<boolean>(false)
	const [cicleBreath, setCicleBreath] = useState<Array<number> | void>(
		localStorage.getItem('cicleBreath')
			? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				localStorage.getItem('cicleBreath').split('-').map(Number)
			: localStorage.setItem('cicleBreath', '40-40-40-40')
	)
	const [pause, setPause] = useState<boolean>(false)
	const [timeRemaining, setTimeRemaining] = useState<boolean>(false)
	const [oneTimeBreathHolding, setOneTimeBreathHolding] = useState<
		number | void
	>(() =>
		localStorage.getItem('oneTimeBreathHolding')
			? Number(localStorage.getItem('oneTimeBreathHolding'))
			: localStorage.setItem('oneTimeBreathHolding', '30000')
	)
	const [twoTimeBreathHolding, setTwoTimeBreathHolding] = useState<
		number | void
	>(
		localStorage.getItem('twoTimeBreathHolding')
			? Number(localStorage.getItem('twoTimeBreathHolding'))
			: localStorage.setItem('twoTimeBreathHolding', '30000')
	)
	const [threeTimeBreathHolding, setThreeTimeBreathHolding] = useState<
		number | void
	>(
		localStorage.getItem('threeTimeBreathHolding')
			? Number(localStorage.getItem('threeTimeBreathHolding'))
			: localStorage.setItem('threeTimeBreathHolding', '30000')
	)
	const [fourTimeBreathHolding, setFourTimeBreathHolding] = useState<
		number | void
	>(
		localStorage.getItem('fourTimeBreathHolding')
			? Number(localStorage.getItem('fourTimeBreathHolding'))
			: localStorage.setItem('fourTimeBreathHolding', '30000')
	)

	const [cicleOne, setCicleOne] = useState<boolean>(false)
	const [cicleTwo, setCicleTwo] = useState<boolean>(false)
	const [cicleThree, setCicleThree] = useState<boolean>(false)
	const [cicleFour, setCicleFour] = useState<boolean>(false)
	// Номер цикла по которому мы определяем на каком цикле мы находимся
	const [numberCicle, setNumberCicle] = useState<number>(0)

	const openSettingModal = () => {
		setIsOpenModal(true)
	}

	const closeSettingModal = () => {
		setIsOpenModal(false)
	}

	useEffect(() => {
		let intervalId: ReturnType<typeof setInterval>

		if (isPlaying) {
			intervalId = setInterval(
				() => {
					setCountBreathes(prevNum => prevNum + 1)
				},
				2450 / Number(speedAudio)
			)
		}

		// Очистка эффекта при размонтировании компонента
		return () => {
			clearInterval(intervalId)
		}
	}, [countBreathes, isPlaying, speedAudio])

	useEffect(() => {
		// Если кол-во вдохов === заданному кол-во, то останавливаем воспроизведение записи
		if (
			(countBreathes === (cicleBreath && cicleBreath[0]) && cicleOne) ||
			(countBreathes === (cicleBreath && cicleBreath[1]) && cicleTwo) ||
			(countBreathes === (cicleBreath && cicleBreath[2]) && cicleThree) ||
			(countBreathes === (cicleBreath && cicleBreath[3]) && cicleFour)
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
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
	}, [cicleBreath, cicleFour, cicleOne, cicleThree, cicleTwo, countBreathes])

	useEffect(() => {
		if (audioRef.current) {
			if ('playbackRate' in audioRef.current) {
				audioRef.current.playbackRate = speedAudio
			}
		}
	}, [speedAudio])

	// Функция для переключения между воспроизведением и паузой
	// autoKey - автоматический ключ по воспроизведению записи в след. цикле
	const handleStartBreathe = useCallback(
		(autoKey?: boolean) => {
			setHoldingBreath(false)
			if (!isPlaying || autoKey) {
				if (audioRef.current) {
					// Начинаем воспроизведение
					if ('play' in audioRef.current) {
						audioRef.current.play()
					}
				}
				setIsPlaying(true)
				setPause(false)
			} else {
				if (audioRef.current) {
					// Ставим на паузу
					if ('pause' in audioRef.current) {
						audioRef.current.pause()
						// audioRef.current.currentTime = 0
						// setCountBreathes(0)
						setPause(true)
					}
				}
				setIsPlaying(false)
			}
		},
		[isPlaying]
	)

	const playTriangleSoundEffect = () => {
		if (triangleSoundEffectRef.current) {
			if ('play' in triangleSoundEffectRef.current) {
				triangleSoundEffectRef.current.play()
			}
		}
		setTimeout(() => {
			if (triangleSoundEffectRef.current) {
				triangleSoundEffectRef.current.pause()
				triangleSoundEffectRef.current.currentTime = 0
			}
		}, 2500)
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const takeBreakThreeSeconds = () => {
		playTriangleSoundEffect()
		setTimeout(() => {
			// Проверяем на последний цикл и в зависимости сколько циклов было выбрано
			if (
				(!cicleFour && cicleBreath?.length === 4) ||
				(!cicleThree && cicleBreath?.length === 3)
			) {
				// Запускаем следующий цикл
				handleStartBreathe(true)
			}
		}, 3000)
	}

	// функция по вдоху и задержки дыхания на 15 секунд
	const takingBreathe = useCallback(() => {
		// console.log('takingBreathe')
		playTriangleSoundEffect()

		setTimeout(() => {
			takeBreakThreeSeconds()
		}, 15000)
	}, [takeBreakThreeSeconds])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handlerTimer = (
		time: number,
		setCicle?: Dispatch<SetStateAction<boolean>>
	) => {
		// console.log('handlerTimer')
		setHoldingBreath(true)
		setTimeout(() => {
			if (setCicle) {
				setCicle(true)
				// Запускаем вдох и задержку дыхания на 15 секунд
				takingBreathe()
			}
			// Проверяем на последний цикл
			// console.log('cicleOne: ', cicleOne)
			// console.log('cicleTwo: ', cicleTwo)
			// console.log('cicleThree: ', cicleThree)
			// console.log('cicleFour: ', cicleFour)
			if (!cicleOne && !cicleTwo && !cicleThree && cicleFour) {
				// Запускаем вдох и задержку дыхания на 15 секунд
				takingBreathe()
			}
		}, time + 1000)
	}

	useEffect(() => {
		if (isPlaying) {
			if (!cicleTwo && !cicleThree && !cicleFour) {
				setCicleOne(true)
			}

			if (cicleOne && cicleBreath && cicleBreath[0] === countBreathes) {
				// console.log('cicleOne')
				setCicleOne(false)
				setNumberCicle(1)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по первому циклу
				handlerTimer(Number(oneTimeBreathHolding), setCicleTwo)
			}
			if (cicleTwo && cicleBreath && cicleBreath[1] === countBreathes) {
				// console.log('cicleTwo')
				setCicleTwo(false)
				setNumberCicle(2)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по второму циклу
				handlerTimer(Number(twoTimeBreathHolding), setCicleThree)
			}
			if (cicleThree && cicleBreath && cicleBreath[2] === countBreathes) {
				// console.log('cicleThree')
				setCicleThree(false)
				setNumberCicle(3)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по третьему циклу
				handlerTimer(Number(threeTimeBreathHolding), setCicleFour)
			}
			if (cicleFour && cicleBreath && cicleBreath[3] === countBreathes) {
				// console.log('cicleFour')
				setCicleFour(false)
				setNumberCicle(4)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по четвертому циклу
				handlerTimer(Number(fourTimeBreathHolding))
			}
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
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
		fourTimeBreathHolding,
		handlerTimer
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
				<Flex
					vertical
					justify='space-between'
					align='center'
				>
					{holdingBreath && numberCicle === 1 && (
						<CountdownTimer timeHoldingBreath={Number(oneTimeBreathHolding)} />
					)}
					{holdingBreath && numberCicle === 2 && (
						<CountdownTimer timeHoldingBreath={Number(twoTimeBreathHolding)} />
					)}
					{holdingBreath && numberCicle === 3 && (
						<CountdownTimer
							timeHoldingBreath={Number(threeTimeBreathHolding)}
						/>
					)}
					{holdingBreath && numberCicle === 4 && (
						<CountdownTimer timeHoldingBreath={Number(fourTimeBreathHolding)} />
					)}
					{countBreathes >= 0 && !holdingBreath && isPlaying && (
						<Counter countBreathes={countBreathes} />
					)}
					<Button
						onClick={() => handleStartBreathe()}
						icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
						size='large'
						iconPosition='end'
						style={{
							padding: '25px',
							marginBottom: '30px'
						}}
					>
						{isPlaying ? 'Stop' : 'Play'}
					</Button>
				</Flex>
			</div>
			{/* Аудиоплеер */}
			{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
			<audio
				ref={audioRef}
				src='/01_Marina1.m4a'
				hidden
			/>
			{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
			<audio
				ref={triangleSoundEffectRef}
				src='/triangle_sound_effect.mp3'
				hidden
			/>
		</div>
	)
}

export default App
