import React from 'react'
import Title from 'antd/es/typography/Title'

interface TitleBlockProps {
	sessionBreath: boolean
	prepareStartBreath: boolean
	numberCicle: number
}

export const TitleBlock: React.FC<TitleBlockProps> = ({
	sessionBreath,
	prepareStartBreath,
	numberCicle
}) => {
	return (
		<>
			{sessionBreath && prepareStartBreath && (
				<Title level={2}>Приготовьтесь к дыханию</Title>
			)}
			{sessionBreath && numberCicle === 1 && (
				<Title level={2}>Первый подход</Title>
			)}
			{sessionBreath && numberCicle === 2 && (
				<Title level={2}>Второй подход</Title>
			)}
			{sessionBreath && numberCicle === 3 && (
				<Title level={2}>Третий подход</Title>
			)}
			{sessionBreath && numberCicle === 4 && (
				<Title level={2}>Четвертый подход</Title>
			)}
		</>
	)
}
