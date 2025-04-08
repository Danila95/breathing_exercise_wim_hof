import React, { useCallback, useEffect, useState } from 'react'
import { Timer } from '@/components/Timer'
import Title from 'antd/es/typography/Title'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cls from '../CountdownTimer/CountdownTimer.module.scss'

interface ICounter {
	className?: string
	countBreathes: number
	maxBreathes: number
	speedAudio: number
}

export const Counter = ({
	className,
	countBreathes,
	maxBreathes,
	speedAudio
}: ICounter) => {
	const FULL_DASH_ARRAY = 283
	const WARNING_THRESHOLD = 10
	const ALERT_THRESHOLD = 5

	const [count, setCount] = useState<number>(countBreathes)
	const [displayTime, setDisplayTime] = useState<string>('0')

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

	const calculateTimeFraction = useCallback(() => {
		// Инвертируем прогресс, так как у нас счет увеличивается, а прогресс бар должен уменьшаться
		const progress = (maxBreathes - count) / maxBreathes
		return progress - (1 / maxBreathes) * (1 - progress)
	}, [maxBreathes, count])

	const setCircleDasharray = useCallback(() => {
		const circleDasharray = `${Math.abs(
			calculateTimeFraction() * FULL_DASH_ARRAY
		).toFixed(0)} 283`
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		document
			.getElementById('base-timer-path-remaining')
			.setAttribute('stroke-dasharray', circleDasharray)
	}, [calculateTimeFraction])

	const setRemainingPathColor = useCallback(
		(timeLeft: number) => {
			const { alert, warning, info } = COLOR_CODES
			const pathElement = document.getElementById('base-timer-path-remaining')

			if (pathElement) {
				pathElement.classList.remove(
					cls['baseTimer__path-remaining--green'],
					cls['baseTimer__path-remaining--orange'],
					cls['baseTimer__path-remaining--red']
				)

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
		if (count >= maxBreathes) return

		const timerInterval = setInterval(
			() => {
				setCount(() => {
					const newCount = countBreathes
					setDisplayTime(String(newCount))

					// Для прогресс-бара используем "оставшееся время" (countBreathes - newCount)
					const remaining = maxBreathes - newCount
					setCircleDasharray()
					setRemainingPathColor(remaining)

					return newCount
				})
			},
			2450 / Number(speedAudio)
		)

		return () => clearInterval(timerInterval)
	}, [
		maxBreathes,
		count,
		setCircleDasharray,
		setRemainingPathColor,
		speedAudio,
		countBreathes
	])

	return (
		<>
			<Timer
				time={displayTime}
				remainingPathColor={remainingPathColor}
				isCounter
			/>
		</>
	)
}
