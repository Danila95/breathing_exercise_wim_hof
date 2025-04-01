import React from 'react'
import { Timer } from '@/components/Timer'
import Title from 'antd/es/typography/Title'

interface ICounter {
	className?: string
	countBreathes: number
}

export const Counter = ({ className, countBreathes }: ICounter) => {
	return (
		<>
			<Title level={4}>Количество вдохов/выдохов</Title>
			<Timer
				time={String(countBreathes)}
				remainingPathColor='baseTimer__path-remaining--green'
				isCounter
			/>
		</>
	)
}
