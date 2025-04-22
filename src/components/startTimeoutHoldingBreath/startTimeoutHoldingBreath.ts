import { Dispatch, SetStateAction } from 'react'

export const startTimeoutHoldingBreath = (
	time: number,
	setNumberCicle: Dispatch<SetStateAction<number>>,
	numberCicle: number,
	cicleBreath: Array<number> | void,
	takingBreathe: (setNumberCicle: Dispatch<SetStateAction<number>>) => void,
	setCicle?: Dispatch<SetStateAction<boolean>>
): ReturnType<typeof setTimeout> => {
	return setTimeout(() => {
		if (setCicle) {
			setCicle(true)
			// Запускаем вдох и задержку дыхания на 15 секунд
			takingBreathe(setNumberCicle)
		}
		// Проверяем на последний цикл
		// if (!cicleOne && !cicleTwo && !cicleThree && cicleFour) {
		if (numberCicle === cicleBreath?.length) {
			// Запускаем вдох и задержку дыхания на 15 секунд
			takingBreathe(setNumberCicle)
		}
	}, time + 1000)
}
