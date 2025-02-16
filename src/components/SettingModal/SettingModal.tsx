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
import {createLogger} from "vite";

interface ISettingModal {
	onClose: () => void
	isOpenModal: boolean
	speedAudio: number
	setSpeedAudio: (value: number) => void
	setCicleBreath: React.Dispatch<React.SetStateAction<Array<number> | null>>
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
		localStorage.setItem('speedBreath', newValue)
	}

	const handleCicleBreath = (value: string) => {
		setCicleBreath(value.split('-').map(Number))
		localStorage.setItem('cicleBreath', value)
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
				localStorage.setItem('oneTimeBreathHolding', miliseconds.toString())
				setOneTimeBreathHolding(miliseconds)
			}

			if (name === 'twoTimeBreathHolding') {
				localStorage.setItem('twoTimeBreathHolding', miliseconds.toString())
				setTwoTimeBreathHolding(miliseconds)
			}

			if (name === 'threeTimeBreathHolding') {
				localStorage.setItem('threeTimeBreathHolding', miliseconds.toString())
				setThreeTimeBreathHolding(miliseconds)
			}

			if (name === 'fourTimeBreathHolding') {
				localStorage.setItem('fourTimeBreathHolding', miliseconds.toString())
				setFourTimeBreathHolding(miliseconds)
			}
		}
	}

	const handlerDefaultValueDatePicker = (name: string) => {
		if (localStorage.getItem(name)) {
			const time = localStorage.getItem(name)
			const milliseconds = parseInt(String(time), 10) // Преобразуем строку в число
			const minutes = milliseconds / 1000 / 60 >= 1 ? Math.floor(milliseconds / 1000 / 60) : 0
			const seconds = milliseconds / 1000 % 60

			// Преобразуем время в формат dayjs
			const FormattedMinutes = minutes < 10 && minutes >= 0 ? `0${minutes}` : minutes
			const FormattedSeconds = seconds < 10 && seconds >= 0 ? `0${seconds}` : seconds

			return dayjs(`${FormattedMinutes}:${FormattedSeconds}`, 'mm:ss')
		}

		return dayjs('00:30', 'mm:ss')
	}

	const handlerDefaultCicleBreath = (name: string) => {
		if (localStorage.getItem(name)) {
			return localStorage.getItem(name)
		}

		return '40-40-40-40'
	}

	// const handlerSpeedDefaultAudio = (name: string) => {
	// 	if (localStorage.getItem(name)) {
	// 		console.log(localStorage.getItem(name))
	//
	// 		return setSpeedAudio(Number(localStorage.getItem(name)))
	// 	}
	// 	return 0.8
	// }

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
						defaultValue={speedAudio ? speedAudio : 0.8}
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
						defaultValue={handlerDefaultCicleBreath('cicleBreath')}
						onChange={handleCicleBreath}
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
						defaultValue={handlerDefaultValueDatePicker('oneTimeBreathHolding')}
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
						defaultValue={handlerDefaultValueDatePicker('twoTimeBreathHolding')}
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
						defaultValue={handlerDefaultValueDatePicker(
							'threeTimeBreathHolding'
						)}
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
						defaultValue={handlerDefaultValueDatePicker(
							'fourTimeBreathHolding'
						)}
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
