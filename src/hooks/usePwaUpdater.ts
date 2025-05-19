import { useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { registerSW } from 'virtual:pwa-register'

export function usePwaUpdater() {
	const [updateAvailable, setUpdateAvailable] = useState(false)

	const updateSW = registerSW({
		onNeedRefresh() {
			setUpdateAvailable(true)
		},
		onOfflineReady() {
			console.log('PWA готово к оффлайн-режиму')
		}
	})

	return {
		updateAvailable,
		update: () => updateSW(true)
	}
}
