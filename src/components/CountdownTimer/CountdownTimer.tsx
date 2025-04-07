import React, { useCallback, useEffect, useState } from 'react'
import { Timer } from '@/components/Timer'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cls from './CountdownTimer.module.scss'

interface ICountdownTimer {
	className?: string
	timeHoldingBreath: number
	isTakingBreathe?: boolean | undefined
}

export const CountdownTimer = ({
	className,
	timeHoldingBreath,
	isTakingBreathe
}: ICountdownTimer) => {
	// Start with an initial value
	const TIME_LIMIT = timeHoldingBreath / 1000 // Таймаут на время задержки дыхания в секундах
	const FULL_DASH_ARRAY = 283
	// Warning occurs at 10s
	const WARNING_THRESHOLD = 10
	// Alert occurs at 5s
	const ALERT_THRESHOLD = 5

	const [time, setTime] = useState<string>('')
	// Initially, no time has passed, but this will count up
	// const [timePassed, setTimePassed] = useState<number>(0)
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
		const rawTimeFraction = timeLeft / TIME_LIMIT
		return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction)
	}, [TIME_LIMIT, timeLeft])

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
		// Сбрасываем таймер при изменении timeHoldingBreath
		setTimeLeft(TIME_LIMIT)
		setTime(formatTime(TIME_LIMIT))
	}, [TIME_LIMIT, timeHoldingBreath])

	useEffect(() => {
		if (timeLeft <= 0) return

		const timerInterval = setInterval(() => {
			setTimeLeft(prev => {
				const newTime = prev - 1
				setTime(formatTime(newTime))
				setCircleDasharray()
				setRemainingPathColor(newTime)
				return newTime
			})
		}, 1000)

		return () => clearInterval(timerInterval)
	}, [TIME_LIMIT, setCircleDasharray, setRemainingPathColor, time, timeLeft])

	return (
		<Timer
			time={time}
			remainingPathColor={remainingPathColor}
			isHoldingBreath
			isTakingBreathe={isTakingBreathe}
		/>
	)
}
