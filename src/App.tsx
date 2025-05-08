import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'
import { Button, Flex } from 'antd'
import { PlayCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { CountdownTimer } from '@/components/UI/CountdownTimer'
import { Counter } from '@/components/UI/Counter'
import { SettingModal } from '@/components/UI/SettingModal'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import triangleSound from '@public/assets/triangle_sound_effect.mp3'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Marina from '@public/assets/Marina.mp3'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import PrepareSound from '@public/assets/3_seconds_timer_start.mp3'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import MetronomSound from '@public/assets/metronom.mp3'
import { startTimeoutHoldingBreath } from '@/components/startTimeoutHoldingBreath'
import { unlockAudio } from '@/components/unlockAudio'
import { playAudio } from '@/components/playAudio'
import { TitleBlock } from '@/components/TitleBlock'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Stop from '@public/assets/Stop.svg'
import NoSleep from '@zakj/no-sleep'
// scss classes
import './App.css'

function App() {
	const [isPlaying, setIsPlaying] = useState(false) // Состояние для отслеживания воспроизведения
	const [speedAudio, setSpeedAudio] = useState<number | any | void>(
		localStorage.getItem('speedBreath')
			? Number(localStorage.getItem('speedBreath'))
			: localStorage.setItem('speedBreath', '0.8')
	) // Скорость дыхания
	const audioRef = useRef<HTMLAudioElement | null>(null) // Референс на аудиоплеер
	const triangleSoundEffectRef = useRef<HTMLAudioElement | null>(null)
	const PrepareSoundRef = useRef<HTMLAudioElement | null>(null)
	const MetronomSoundRef = useRef<HTMLAudioElement | null>(null)
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
	const [backgroundSound, setBackgroundSound] = useState<boolean | void>(() => {
		const value = localStorage.getItem('backgroundSound')

		if (value === null) {
			localStorage.setItem('backgroundSound', 'false')
			return false
		}

		return value === 'true'
	})

	const [cicleOne, setCicleOne] = useState<boolean>(false)
	const [cicleTwo, setCicleTwo] = useState<boolean>(false)
	const [cicleThree, setCicleThree] = useState<boolean>(false)
	const [cicleFour, setCicleFour] = useState<boolean>(false)
	// Номер цикла по которому мы определяем на каком цикле мы находимся
	const [numberCicle, setNumberCicle] = useState<number>(0)
	const [sessionBreath, setSessionBreath] = useState<boolean>(false)
	const [prepareStartBreath, setPrepareStartBreath] = useState<boolean>(true)
	const [audioContextUnlocked, setAudioContextUnlocked] = useState(false)
	// Ссылки на все таймауты
	const prepareStartBreathTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const triangleSoundEffectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const takingBreatheTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const breakTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const resetAll = useCallback(() => {
		// Очистка всех таймеров
		if (prepareStartBreathTimeoutRef.current)
			clearTimeout(prepareStartBreathTimeoutRef.current)
		if (triangleSoundEffectTimeoutRef.current)
			clearTimeout(triangleSoundEffectTimeoutRef.current)
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		if (takingBreatheTimeoutRef.current)
			clearTimeout(takingBreatheTimeoutRef.current)
		if (breakTimeoutRef.current) clearTimeout(breakTimeoutRef.current)

		prepareStartBreathTimeoutRef.current = null
		triangleSoundEffectTimeoutRef.current = null
		timeoutRef.current = null
		takingBreatheTimeoutRef.current = null
		breakTimeoutRef.current = null

		// Сброс состояний
		setNumberCicle(0)
		setCountBreathes(0)
		setCicleOne(false)
		setCicleTwo(false)
		setCicleThree(false)
		setCicleFour(false)
		setIsTakingBreathe(false)
		setIsPlaying(false)
		setPause(true)
		setPrepareStartBreath(true)

		// Остановка аудио
		if (audioRef.current) {
			audioRef.current.pause()
			audioRef.current.currentTime = 0
		}
		if (PrepareSoundRef.current) {
			PrepareSoundRef.current.pause()
			PrepareSoundRef.current.currentTime = 0
		}
		if (MetronomSoundRef.current) {
			MetronomSoundRef.current.pause()
			MetronomSoundRef.current.currentTime = 0
		}
	}, [])

	useEffect(() => {
		if (!sessionBreath) {
			resetAll()
		}
	}, [resetAll, sessionBreath])

	const openSettingModal = () => {
		setIsOpenModal(true)
	}

	const closeSettingModal = () => {
		setIsOpenModal(false)
	}

	const noSleep = useRef(new NoSleep())

	useEffect(() => {
		if (sessionBreath) {
			// console.log('enable')
			noSleep.current.enable()
		} else {
			// console.log('disable')
			noSleep.current.disable()
		}
	}, [sessionBreath])

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

		// Если принудительно остановили тренировку
		if (!sessionBreath) {
			return () => {
				clearInterval(intervalId)
			}
		}

		// Очистка эффекта при размонтировании компонента
		return () => {
			clearInterval(intervalId)
		}
	}, [countBreathes, isPlaying, sessionBreath, speedAudio])

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
	// autoKey - автоматический ключ по воспроизведению записи в следующем цикле
	const handleStartBreathe = useCallback(
		async (autoKey?: boolean) => {
			setHoldingBreath(false)
			if (!isPlaying || autoKey) {
				await playAudio(
					audioRef.current,
					audioContextUnlocked,
					setAudioContextUnlocked
				)
				setIsPlaying(true)
				setPause(false)
			} else {
				if (audioRef.current) {
					// Ставим на паузу
					if ('pause' in audioRef.current) {
						audioRef.current.pause()
						setPause(true)
					}
				}
				setIsPlaying(false)
			}
		},
		[audioContextUnlocked, isPlaying]
	)

	useEffect(() => {
		if (sessionBreath && prepareStartBreath) {
			if (prepareStartBreath) {
				if (PrepareSoundRef.current) {
					// Начинаем воспроизведение
					if ('play' in PrepareSoundRef.current) {
						PrepareSoundRef.current.play()
					}
				}
				prepareStartBreathTimeoutRef.current = setTimeout(() => {
					setPrepareStartBreath(!prepareStartBreath)
					if (PrepareSoundRef.current) {
						// Начинаем воспроизведение
						if ('pause' in PrepareSoundRef.current) {
							PrepareSoundRef.current.pause()
						}
					}
					// eslint-disable-next-line no-use-before-define
					handleStartBreathe()
				}, 4000)
			}
		}
	}, [handleStartBreathe, prepareStartBreath, sessionBreath])

	// Функция по старту тренировки
	const handleStartSession = async () => {
		if (!sessionBreath) {
			// Разблокируем аудио контекст перед началом
			if (
				audioRef.current &&
				triangleSoundEffectRef.current &&
				PrepareSoundRef.current &&
				MetronomSoundRef.current
			) {
				if (backgroundSound) {
					await Promise.all([
						unlockAudio(audioRef.current),
						unlockAudio(triangleSoundEffectRef.current),
						unlockAudio(PrepareSoundRef.current),
						unlockAudio(MetronomSoundRef.current)
					])
				} else {
					await Promise.all([
						unlockAudio(audioRef.current),
						unlockAudio(triangleSoundEffectRef.current),
						unlockAudio(PrepareSoundRef.current)
					])
				}
				setAudioContextUnlocked(true)
			}
		}
		setSessionBreath(!sessionBreath)
	}

	const playTriangleSoundEffect = useCallback(async () => {
		// Очищаем предыдущий таймер
		if (triangleSoundEffectTimeoutRef.current)
			clearTimeout(triangleSoundEffectTimeoutRef.current)

		if (sessionBreath) {
			await playAudio(
				triangleSoundEffectRef.current,
				audioContextUnlocked,
				setAudioContextUnlocked
			)
		}
		triangleSoundEffectTimeoutRef.current = setTimeout(() => {
			if (triangleSoundEffectRef.current) {
				triangleSoundEffectRef.current.pause()
				triangleSoundEffectRef.current.currentTime = 0
			}
		}, 2500)
	}, [audioContextUnlocked, sessionBreath])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const takeBreakThreeSeconds = (
		setNumberCicle: Dispatch<SetStateAction<number>>
	) => {
		playTriangleSoundEffect()

		// Очищаем предыдущий таймер
		if (breakTimeoutRef.current) clearTimeout(breakTimeoutRef.current)

		breakTimeoutRef.current = setTimeout(() => {
			// Проверяем на последний цикл и в зависимости сколько циклов было выбрано
			if (numberCicle !== cicleBreath?.length) {
				// Запускаем следующий цикл
				setNumberCicle(prev => prev + 1)
				setIsTakingBreathe(false)
				handleStartBreathe(true)
			} else {
				setSessionBreath(false)
			}
		}, 3000)
	}

	// функция по вдоху и задержки дыхания на 15 секунд
	const takingBreathe = useCallback(
		(setNumberCicle: Dispatch<SetStateAction<number>>) => {
			playTriangleSoundEffect()
			setIsTakingBreathe(true)

			if (MetronomSoundRef.current) {
				MetronomSoundRef.current.pause()
				MetronomSoundRef.current.currentTime = 0
			}

			// Очищаем предыдущий таймер
			if (takingBreatheTimeoutRef.current)
				clearTimeout(takingBreatheTimeoutRef.current)

			takingBreatheTimeoutRef.current = setTimeout(() => {
				takeBreakThreeSeconds(setNumberCicle)
			}, takingBreatheTime + 1000)
		},
		[playTriangleSoundEffect, takeBreakThreeSeconds, takingBreatheTime]
	)

	// функция по задержке дыхания на n-секунд
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handlerTimer = (
		time: number,
		setNumberCicle: Dispatch<SetStateAction<number>>,
		setCicle?: Dispatch<SetStateAction<boolean>>
	) => {
		setHoldingBreath(true)

		// Очищаем предыдущий таймер, если он есть
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		if (backgroundSound) {
			if (MetronomSoundRef.current) {
				// Начинаем воспроизведение
				if ('play' in MetronomSoundRef.current) {
					MetronomSoundRef.current.play()
				}
			}
		}

		timeoutRef.current = startTimeoutHoldingBreath(
			time,
			setNumberCicle,
			numberCicle,
			cicleBreath,
			takingBreathe,
			setCicle
		)
	}

	useEffect(() => {
		if (isPlaying) {
			if (!cicleTwo && !cicleThree && !cicleFour) {
				setCicleOne(true)
				setNumberCicle(1)
			}

			if (cicleOne && cicleBreath && cicleBreath[0] === countBreathes) {
				setCicleOne(false)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по первому циклу
				handlerTimer(Number(oneTimeBreathHolding), setNumberCicle, setCicleTwo)
			}
			if (cicleTwo && cicleBreath && cicleBreath[1] === countBreathes) {
				setCicleTwo(false)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по второму циклу
				handlerTimer(
					Number(twoTimeBreathHolding),
					setNumberCicle,
					setCicleThree
				)
			}
			if (cicleThree && cicleBreath && cicleBreath[2] === countBreathes) {
				setCicleThree(false)
				setNumberCicle(3)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по третьему циклу
				handlerTimer(
					Number(threeTimeBreathHolding),
					setNumberCicle,
					setCicleFour
				)
			}
			if (cicleFour && cicleBreath && cicleBreath[3] === countBreathes) {
				setCicleFour(false)
				setNumberCicle(4)

				playTriangleSoundEffect()
				// Запускаем задержку дыхания по четвертому циклу
				handlerTimer(Number(fourTimeBreathHolding), setNumberCicle)
			}
		}

		if (!sessionBreath) {
			resetAll()
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
		handlerTimer,
		sessionBreath,
		playTriangleSoundEffect,
		resetAll
	])

	return (
		<div className='wrapper'>
			<div className='btns'>
				{!sessionBreath && (
					<Button
						className='btn'
						type='link'
						onClick={() => openSettingModal()}
						icon={<SettingOutlined />}
						style={{
							padding: '25px'
						}}
					>
						Настройки
					</Button>
				)}
			</div>
			<div className='container'>
				<div style={{ margin: '50px' }}>
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
						backgroundSound={backgroundSound}
						setBackgroundSound={setBackgroundSound}
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
							<TitleBlock
								sessionBreath={sessionBreath}
								prepareStartBreath={prepareStartBreath}
								numberCicle={numberCicle}
							/>
							{sessionBreath && prepareStartBreath && (
								<CountdownTimer
									otherText='Начнем через'
									timeHoldingBreath={Number('4000')}
								/>
							)}
							{sessionBreath &&
								holdingBreath &&
								!isTakingBreathe &&
								numberCicle === 1 && (
									<CountdownTimer
										timeHoldingBreath={Number(oneTimeBreathHolding)}
									/>
								)}
							{sessionBreath &&
								holdingBreath &&
								!isTakingBreathe &&
								numberCicle === 2 && (
									<CountdownTimer
										timeHoldingBreath={Number(twoTimeBreathHolding)}
									/>
								)}
							{sessionBreath &&
								holdingBreath &&
								!isTakingBreathe &&
								numberCicle === 3 && (
									<CountdownTimer
										timeHoldingBreath={Number(threeTimeBreathHolding)}
									/>
								)}
							{sessionBreath &&
								holdingBreath &&
								!isTakingBreathe &&
								numberCicle === 4 && (
									<CountdownTimer
										timeHoldingBreath={Number(fourTimeBreathHolding)}
									/>
								)}
							{sessionBreath &&
								countBreathes >= 0 &&
								!holdingBreath &&
								isPlaying && (
									<Counter
										countBreathes={countBreathes}
										// eslint-disable-next-line @typescript-eslint/ban-ts-comment
										// @ts-expect-error
										maxBreathes={Number(cicleBreath[numberCicle])}
										speedAudio={speedAudio}
										isPulsing
									/>
								)}
							{sessionBreath && isTakingBreathe && (
								<CountdownTimer
									timeHoldingBreath={Number(takingBreatheTime)}
									isTakingBreathe
								/>
							)}
							<Button
								className='btn'
								onClick={handleStartSession}
								icon={sessionBreath ? <Stop /> : <PlayCircleOutlined />}
								size='large'
								style={{
									padding: '25px',
									marginBottom: '30px'
								}}
							>
								{sessionBreath ? 'Остановить тренировку' : 'Начать тренировку'}
							</Button>
						</Flex>
					</div>
					{/* Аудиоплеер */}
					{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
					<audio
						ref={PrepareSoundRef}
						src={PrepareSound}
						hidden
					/>
					{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
					<audio
						ref={audioRef}
						src={Marina}
						hidden
					/>
					{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
					<audio
						ref={triangleSoundEffectRef}
						src={triangleSound}
						hidden
						preload='auto'
					/>
					{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
					<audio
						ref={MetronomSoundRef}
						src={MetronomSound}
						hidden
						preload='auto'
					/>
				</div>
			</div>
		</div>
	)
}

export default App
