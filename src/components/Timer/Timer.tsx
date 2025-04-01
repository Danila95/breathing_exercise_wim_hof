import React from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cls from './Timer.module.scss'

interface ITimer {
	className?: string
	remainingPathColor?: string
	time: string
	isCounter?: boolean
}

export const Timer = ({
	className,
	remainingPathColor,
	time,
	isCounter
}: ITimer) => {
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
						// eslint-disable-next-line max-len
						className={`${cls['baseTimer__path-remaining']} ${remainingPathColor} ${isCounter && cls['baseTimer__path-remaining--green']}`}
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
