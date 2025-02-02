import {Button, Drawer, Flex, Space} from 'antd'
import { Typography } from 'antd'

interface ISettingModal {
	onClose: () => void,
	isOpenModal: boolean
}

export const SettingModal = (props: ISettingModal) => {
	const {
		onClose,
		isOpenModal
	} = props

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
					<Typography.Text type='secondary'>Test</Typography.Text>
					<Typography.Text>123</Typography.Text>
				</Space>
			</Flex>
		</Drawer>
	)
}
