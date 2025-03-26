import { useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cls from './CountdownTimer.module.scss'

interface ICountdownTimer {
	className?: string
}

export const CountdownTimer = ({ className }: ICountdownTimer) => {
	// Start with an initial value of 20 seconds
	const TIME_LIMIT = 5
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

	useEffect(() => {
		if (timeLeft !== -1) {
			const timerInterval = setInterval(() => {
				setTimePassed(prev => prev + 1)
				setTimeLeft(TIME_LIMIT - timePassed)

				setTime(formatTime(timeLeft))
			}, 1000)

			return () => clearInterval(timerInterval)
		}
	}, [time, timeLeft, timePassed])

	return (
		<div className={cls.baseTimer}>
			<svg
				className='base-timer__svg'
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
