import { useCallback, useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cls from './CountdownTimer.module.scss'

interface ICountdownTimer {
	className?: string
}

export const CountdownTimer = ({ className }: ICountdownTimer) => {
	// Start with an initial value
	const TIME_LIMIT = 20
	const FULL_DASH_ARRAY = 283
	// Warning occurs at 10s
	const WARNING_THRESHOLD = 10
	// Alert occurs at 5s
	const ALERT_THRESHOLD = 5

	const [time, setTime] = useState<string>('')
	// Initially, no time has passed, but this will count up
	const [timePassed, setTimePassed] = useState<number>(0)
	const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT)

	const formatTime = (time: number) => {
		// The largest round integer less than or equal to the result of time divided being by 60.
		const minutes = Math.floor(time / 60)

		// Seconds are the remainder of the time divided by 60 (modulus operator)
		let seconds: number | string = time % 60

		// If the value of seconds is less than 10, then display seconds with a leading zero
		if (seconds < 10) {
			seconds = `0${seconds}`
		}

		// The output in MM:SS format
		return `${minutes}:${seconds}`
	}

	// Divides time left by the defined time limit.
	const calculateTimeFraction = useCallback(() => {
		const rawTimeFraction = timeLeft / TIME_LIMIT;
		return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
	}, [timeLeft])

	// Update the dasharray value as time passes, starting with 283
	const setCircleDasharray = useCallback(() => {
		const circleDasharray = `${(
			calculateTimeFraction() * FULL_DASH_ARRAY
		).toFixed(0)} 283`
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		document
			.getElementById('base-timer-path-remaining')
			.setAttribute('stroke-dasharray', circleDasharray)
	}, [calculateTimeFraction])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const COLOR_CODES = {
		info: {
			color: 'green'
		},
		warning: {
			color: 'orange',
			threshold: WARNING_THRESHOLD
		},
		alert: {
			color: 'red',
			threshold: ALERT_THRESHOLD
		}
	}

	const remainingPathColor = COLOR_CODES.info.color

	const setRemainingPathColor = useCallback(
		(timeLeft: number) => {
			const { alert, warning, info } = COLOR_CODES
			const pathElement = document.getElementById('base-timer-path-remaining')

			if (pathElement) {
				// Удаляем все цветные классы
				pathElement.classList.remove(
					cls['baseTimer__path-remaining--green'],
					cls['baseTimer__path-remaining--orange'],
					cls['baseTimer__path-remaining--red']
				)

				// Добавляем нужный
				if (timeLeft <= alert.threshold) {
					pathElement.classList.add(cls['baseTimer__path-remaining--red'])
				} else if (timeLeft <= warning.threshold) {
					pathElement.classList.add(cls['baseTimer__path-remaining--orange'])
				} else {
					pathElement.classList.add(cls['baseTimer__path-remaining--green'])
				}
			}
		},
		[COLOR_CODES]
	)

	useEffect(() => {
		if (timeLeft !== -1) {
			const timerInterval = setInterval(() => {
				setTimePassed(prev => prev + 1)
				setTimeLeft(TIME_LIMIT - timePassed)

				setTime(formatTime(timeLeft))
				setCircleDasharray()
				setRemainingPathColor(timeLeft)
			}, 1000)

			return () => clearInterval(timerInterval)
		}
	}, [setCircleDasharray, setRemainingPathColor, time, timeLeft, timePassed])

	return (
		<div className={cls.baseTimer}>
			<svg
				className={cls.baseTimer__svg}
				viewBox='0 0 100 100'
				xmlns='http://www.w3.org/2000/svg'
			>
				<g className={cls.baseTimer__circle}>
					<circle
						className={cls.baseTimer__pathElapsed}
						cx='50'
						cy='50'
						r='45'
					/>
					<path
						id='base-timer-path-remaining'
						strokeDasharray='283'
						className={`${cls['baseTimer__path-remaining']} ${remainingPathColor}`}
						d='
							  M 50, 50
							  m -45, 0
							  a 45,45 0 1,0 90,0
							  a 45,45 0 1,0 -90,0
							'
					/>
				</g>
			</svg>
			<span
				id='base-timer-label'
				className={cls.baseTimer__label}
			>
				{time}
			</span>
		</div>
	)
}
