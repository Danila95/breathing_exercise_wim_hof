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
import { Counter } from '@/components/Counter'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { breatheSound } from '@public/assets/01_Marina1.m4a'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import triangleSound from '@public/assets/triangle_sound_effect.mp3'
import { SettingModal } from './components/SettingModal'
import Title from 'antd/es/typography/Title'

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
	const [takingBreatheTime, setTakingBreatheTime] = useState<number>(15000)
	const [isTakingBreathe, setIsTakingBreathe] = useState<boolean>(false)
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
				// triangleSoundEffectRef.current.play()

				// Сбросить текущее время и попытаться воспроизвести
				triangleSoundEffectRef.current.currentTime = 0
				triangleSoundEffectRef.current
					.play()
					.catch(e => console.error('Play failed:', e))
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
	const takeBreakThreeSeconds = (
		setNumberCicle: Dispatch<SetStateAction<number>>
	) => {
		playTriangleSoundEffect()
		setTimeout(() => {
			// Проверяем на последний цикл и в зависимости сколько циклов было выбрано
			if (
				(!cicleFour && cicleBreath?.length === 4) ||
				(!cicleThree && cicleBreath?.length === 3)
			) {
				// Запускаем следующий цикл
				setNumberCicle(prev => prev + 1)
				setIsTakingBreathe(false)
				handleStartBreathe(true)
			}
		}, 3000)
	}

	// функция по вдоху и задержки дыхания на 15 секунд
	const takingBreathe = useCallback((
		setNumberCicle: Dispatch<SetStateAction<number>>
	) => {
		// console.log('takingBreathe')
		playTriangleSoundEffect()
		setIsTakingBreathe(true)

		setTimeout(() => {
			takeBreakThreeSeconds(setNumberCicle)
		}, takingBreatheTime + 1000)
	}, [takeBreakThreeSeconds, takingBreatheTime])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handlerTimer = (
		time: number,
		setNumberCicle: Dispatch<SetStateAction<number>>,
		setCicle?: Dispatch<SetStateAction<boolean>>
	) => {
		// console.log('handlerTimer')
		setHoldingBreath(true)
		setTimeout(() => {
			if (setCicle) {
				setCicle(true)
				// Запускаем вдох и задержку дыхания на 15 секунд
				takingBreathe(setNumberCicle)
			}
			// Проверяем на последний цикл
			// console.log('cicleOne: ', cicleOne)
			// console.log('cicleTwo: ', cicleTwo)
			// console.log('cicleThree: ', cicleThree)
			// console.log('cicleFour: ', cicleFour)
			if (!cicleOne && !cicleTwo && !cicleThree && cicleFour) {
				// Запускаем вдох и задержку дыхания на 15 секунд
				takingBreathe(setNumberCicle)
			}
		}, time + 1000)
	}

	useEffect(() => {
		if (isPlaying) {
			if (!cicleTwo && !cicleThree && !cicleFour) {
				setCicleOne(true)
				setNumberCicle(1)
			}

			if (cicleOne && cicleBreath && cicleBreath[0] === countBreathes) {
				// console.log('cicleOne')
				setCicleOne(false)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по первому циклу
				handlerTimer(Number(oneTimeBreathHolding), setNumberCicle, setCicleTwo)
			}
			if (cicleTwo && cicleBreath && cicleBreath[1] === countBreathes) {
				// console.log('cicleTwo')
				setCicleTwo(false)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по второму циклу
				handlerTimer(Number(twoTimeBreathHolding), setNumberCicle, setCicleThree)
			}
			if (cicleThree && cicleBreath && cicleBreath[2] === countBreathes) {
				// console.log('cicleThree')
				setCicleThree(false)
				setNumberCicle(3)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по третьему циклу
				handlerTimer(Number(threeTimeBreathHolding), setNumberCicle, setCicleFour)
			}
			if (cicleFour && cicleBreath && cicleBreath[3] === countBreathes) {
				// console.log('cicleFour')
				setCicleFour(false)
				setNumberCicle(4)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по четвертому циклу
				handlerTimer(Number(fourTimeBreathHolding), setNumberCicle)
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
					{numberCicle === 1 &&
						<Title level={2}>Первый подход</Title>
					}
					{numberCicle === 2 &&
						<Title level={2}>Второй подход</Title>
					}
					{numberCicle === 3 &&
						<Title level={2}>Третий подход</Title>
					}
					{numberCicle === 4 &&
						<Title level={2}>Четвертый подход</Title>
					}
					{holdingBreath && !isTakingBreathe && numberCicle === 1 && (
						<CountdownTimer timeHoldingBreath={Number(oneTimeBreathHolding)} />
					)}
					{holdingBreath && !isTakingBreathe && numberCicle === 2 && (
						<CountdownTimer timeHoldingBreath={Number(twoTimeBreathHolding)} />
					)}
					{holdingBreath && !isTakingBreathe && numberCicle === 3 && (
						<CountdownTimer
							timeHoldingBreath={Number(threeTimeBreathHolding)}
						/>
					)}
					{holdingBreath && !isTakingBreathe && numberCicle === 4 && (
						<CountdownTimer timeHoldingBreath={Number(fourTimeBreathHolding)} />
					)}
					{countBreathes >= 0 && !holdingBreath && isPlaying && (
						<Counter
							countBreathes={countBreathes}
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-expect-error
							maxBreathes={Number(cicleBreath[numberCicle])}
							speedAudio={speedAudio}
						/>
					)}
					{isTakingBreathe && (
						<CountdownTimer
							timeHoldingBreath={Number(takingBreatheTime)}
							isTakingBreathe
						/>
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
				src='./assets/01_Marina1.m4a'
				hidden
			/>
			{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
			<audio
				ref={triangleSoundEffectRef}
				src={triangleSound}
				hidden
				preload='auto'
			/>
		</div>
	)
}

export default App
