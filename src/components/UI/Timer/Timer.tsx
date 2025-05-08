import React from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cls from './Timer.module.scss'

interface ITimer {
	otherText?: string
	className?: string
	remainingPathColor?: string
	time: string
	isCounter?: boolean
	isHoldingBreath?: boolean
	isTakingBreathe?: boolean | undefined
	pulseStyle?: object
}

export const Timer = ({
	otherText,
	className,
	remainingPathColor,
	time,
	isCounter,
	isHoldingBreath,
	isTakingBreathe,
	pulseStyle
}: ITimer) => {
	return (
		<div
			className={cls.baseTimer}
			style={pulseStyle}
		>
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
						// eslint-disable-next-line max-len
						className={`${cls['baseTimer__path-remaining']} ${remainingPathColor} ${cls['baseTimer__path-remaining--green']}`}
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
				{isCounter && (
					<span className={cls.baseTimer__labelSubtitle}>
						Кол-во вдохов/выдохов
					</span>
				)}
				{isTakingBreathe && (
					<>
						<span
							className={cls.baseTimer__labelSubtitle}
							style={{ marginBottom: '0px' }}
						>
							Глубокий вдох и
						</span>
						<span className={cls.baseTimer__labelSubtitle}>
							задержите дыхание на
						</span>
					</>
				)}
				{isHoldingBreath && !isTakingBreathe && !otherText && (
					<span className={cls.baseTimer__labelSubtitle}>
						Задержите дыхание на
					</span>
				)}
				{otherText && (
					<span className={cls.baseTimer__labelSubtitle}>{otherText}</span>
				)}
				{time}
			</span>
		</div>
	)
}
