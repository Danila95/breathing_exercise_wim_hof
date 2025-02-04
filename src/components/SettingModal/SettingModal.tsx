import { Button, Drawer, Flex, Select, Slider, Space, Typography } from 'antd'

interface ISettingModal {
	onClose: () => void
	isOpenModal: boolean
	speedAudio: number
	setSpeedAudio: (value: any) => void
}

export const SettingModal = (props: ISettingModal) => {
	const { onClose, isOpenModal, speedAudio, setSpeedAudio } = props

	const handleSpeedAudio = (newValue: any) => {
		setSpeedAudio(newValue)
	}

	const handleChange = (value: string) => {
		console.log(`selected ${value}`)
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
						min={0.8}
						max={2}
						step={0.1}
						onChange={handleSpeedAudio}
						value={speedAudio}
					/>
				</Space>
				<Space
					direction='vertical'
					size={0}
				>
					<Typography.Text type='secondary'>
						Количество циклов и дыханий в упражнении
					</Typography.Text>
					<Select
						defaultValue='lucy'
						style={{
							width: '100%'
						}}
						onChange={handleChange}
						options={[
							{
								value: 'jack',
								label: 'Jack'
							},
							{
								value: 'lucy',
								label: 'Lucy'
							},
							{
								value: 'Yiminghe',
								label: 'yiminghe'
							},
							{
								value: 'disabled',
								label: 'Disabled',
								disabled: true
							}
						]}
					/>
				</Space>
			</Flex>
		</Drawer>
	)
}
