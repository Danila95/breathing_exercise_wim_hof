import { useState, useEffect, useRef } from 'react'

const UseBreathingTimer = (delay: number, onComplete: () => void) => {
	const [timeLeft, setTimeLeft] = useState(delay) // оставшееся время
	const startTimeRef = useRef<null | number>(null) // время старта таймера
	const timerRef = useRef<null | number>(null) // идентификатор таймера

	useEffect(() => {
		startTimeRef.current = Date.now() // запоминаем время старта

		const updateTimeLeft = () => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			const elapsed = Date.now() - startTimeRef.current // прошедшее время
			const remaining = Math.max(0, delay - elapsed) // оставшееся время
			setTimeLeft(remaining)

			if (remaining > 0) {
				// Если время не истекло, продолжаем обновлять
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				timerRef.current = setTimeout(updateTimeLeft, 100)
			} else {
				// Если время истекло, вызываем onComplete
				onComplete()
			}
		}

		// Запускаем таймер
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		timerRef.current = setTimeout(updateTimeLeft, 100)

		// Очистка таймера при размонтировании
		return () => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			clearTimeout(timerRef.current)
		}
	}, [delay, onComplete]) // зависимости useEffect

	return timeLeft // возвращаем оставшееся время
}

export default UseBreathingTimer
