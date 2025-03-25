// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cls from './CountdownTimer.module.scss'

interface ICountdownTimer {
	className?: string
}

export const CountdownTimer = ({ className }: ICountdownTimer) => {
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
			<span>{/* Remaining time label */}</span>
		</div>
	)
}
