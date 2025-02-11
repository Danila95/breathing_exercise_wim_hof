import {
	Button,
	DatePicker,
	Drawer,
	Flex,
	Select,
	Slider,
	Space,
	Typography
} from 'antd'
import dayjs from 'dayjs'

interface ISettingModal {
	onClose: () => void
	isOpenModal: boolean
	speedAudio: number
	setSpeedAudio: (value: number) => void
	setCicleBreath: React.Dispatch<React.SetStateAction<number[]>>
	setOneTimeBreathHolding: React.Dispatch<React.SetStateAction<number | null>>
	setTwoTimeBreathHolding: React.Dispatch<React.SetStateAction<number | null>>
	setThreeTimeBreathHolding: React.Dispatch<React.SetStateAction<number | null>>
	setFourTimeBreathHolding: React.Dispatch<React.SetStateAction<number | null>>
}

export const SettingModal = (props: ISettingModal) => {
	const {
		onClose,
		isOpenModal,
		speedAudio,
		setSpeedAudio,
		setCicleBreath,
		setOneTimeBreathHolding,
		setTwoTimeBreathHolding,
		setThreeTimeBreathHolding,
		setFourTimeBreathHolding
	} = props

	const handleSpeedAudio = (newValue: any) => {
		setSpeedAudio(newValue)
	}

	const handleChange = (value: string) => {
		localStorage.setItem('cicleBreath', value)
		// setCicleBreath(value)
	}

	const range = (start: number, end: number) => {
		const result = []
		for (let i = start; i < end; i++) {
			result.push(i)
		}
		return result
	}

	// Функция для отключения выбора минут больше 10
	const disabledRangeTime = () => ({
		disabledMinutes: () => range(11, 60)
	})

	const handleTimeChangeBreathHolding = (time: dayjs.Dayjs, name: string) => {
		if (time) {
			const minutes = time.minute() * 60 * 1000
			const seconds = time.second() * 1000
			const miliseconds = minutes + seconds

			if (name === 'oneTimeBreathHolding') {
				// if (!localStorage.getItem('oneTimeBreathHolding')) {
				// 	localStorage.setItem('oneTimeBreathHolding', miliseconds.toString())
				// }
				localStorage.setItem('oneTimeBreathHolding', miliseconds.toString())
				setOneTimeBreathHolding(miliseconds)
			}

			if (name === 'twoTimeBreathHolding') {
				// if (!localStorage.getItem('twoTimeBreathHolding')) {
				// 	localStorage.setItem('twoTimeBreathHolding', miliseconds.toString())
				// }
				localStorage.setItem('twoTimeBreathHolding', miliseconds.toString())
				setTwoTimeBreathHolding(miliseconds)
			}

			if (name === 'threeTimeBreathHolding') {
				// if (!localStorage.getItem('threeTimeBreathHolding')) {
				// 	localStorage.setItem('threeTimeBreathHolding', miliseconds.toString())
				// }
				localStorage.setItem('threeTimeBreathHolding', miliseconds.toString())
				setThreeTimeBreathHolding(miliseconds)
			}

			if (name === 'fourTimeBreathHolding') {
				// if (!localStorage.getItem('fourTimeBreathHolding')) {
				// 	localStorage.setItem('fourTimeBreathHolding', miliseconds.toString())
				// }
				localStorage.setItem('fourTimeBreathHolding', miliseconds.toString())
				setFourTimeBreathHolding(miliseconds)
			}
		}
	}

	return (
		<Drawer
			className=''
			destroyOnClose
			open={isOpenModal}
			onClose={onClose}
			title='Настройки'
			placement='left'
			footer={
				<Flex justify='space-between'>
					<Button onClick={onClose}>Закрыть</Button>
				</Flex>
			}
		>
			<Flex
				vertical
				gap={10}
			>
				<Space
					direction='vertical'
					size={0}
				>
					<Typography.Text type='secondary'>Скорость дыхания</Typography.Text>
					<Slider
						min={0.7}
						max={2}
						step={0.1}
						onChange={handleSpeedAudio}
						value={speedAudio}
					/>
				</Space>

				<Flex
					vertical
					gap={5}
				>
					<Space
						direction='vertical'
						size={0}
					>
						<Typography.Text type='secondary'>
							Количество циклов и дыханий в упражнении
						</Typography.Text>
					</Space>
					<Select
						defaultValue='40-40-40-40'
						onChange={handleChange}
						options={[
							{
								value: '30-30-30',
								label: '30-30-30'
							},
							{
								value: '40-40-40-40',
								label: '40-40-40-40'
							},
							{
								value: '40-50-60-70',
								label: '40-50-60-70'
							}
						]}
					/>
				</Flex>

				<Flex
					vertical
					gap={5}
				>
					<Space
						direction='vertical'
						size={0}
					>
						<Typography.Text type='secondary'>
							Время задержки дыхания на первом цикле
						</Typography.Text>
					</Space>
					<DatePicker
						picker='time'
						format='mm:ss'
						showNow={false}
						defaultValue={dayjs('00:30', 'mm:ss')}
						disabledTime={disabledRangeTime} // Отключаем выбор минут больше 10
						onChange={time =>
							handleTimeChangeBreathHolding(time, 'oneTimeBreathHolding')
						}
					/>
				</Flex>

				<Flex
					vertical
					gap={5}
				>
					<Space
						direction='vertical'
						size={0}
					>
						<Typography.Text type='secondary'>
							Время задержки дыхания на втором цикле
						</Typography.Text>
					</Space>
					<DatePicker
						picker='time'
						format='mm:ss'
						showNow={false}
						defaultValue={dayjs('00:30', 'mm:ss')}
						disabledTime={disabledRangeTime} // Отключаем выбор минут больше 10
						onChange={time =>
							handleTimeChangeBreathHolding(time, 'twoTimeBreathHolding')
						}
					/>
				</Flex>

				<Flex
					vertical
					gap={5}
				>
					<Space
						direction='vertical'
						size={0}
					>
						<Typography.Text type='secondary'>
							Время задержки дыхания на третьем цикле
						</Typography.Text>
					</Space>
					<DatePicker
						picker='time'
						format='mm:ss'
						showNow={false}
						defaultValue={dayjs('00:30', 'mm:ss')}
						disabledTime={disabledRangeTime} // Отключаем выбор минут больше 10
						onChange={time =>
							handleTimeChangeBreathHolding(time, 'threeTimeBreathHolding')
						}
					/>
				</Flex>

				<Flex
					vertical
					gap={5}
				>
					<Space
						direction='vertical'
						size={0}
					>
						<Typography.Text type='secondary'>
							Время задержки дыхания на четвертом цикле
						</Typography.Text>
					</Space>
					<DatePicker
						picker='time'
						format='mm:ss'
						showNow={false}
						defaultValue={dayjs('00:30', 'mm:ss')}
						disabledTime={disabledRangeTime} // Отключаем выбор минут больше 10
						onChange={time =>
							handleTimeChangeBreathHolding(time, 'fourTimeBreathHolding')
						}
					/>
				</Flex>
			</Flex>
		</Drawer>
	)
}
