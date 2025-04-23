// Функция для разблокировки аудио (предназначена в основном для работы на мобильных устройствах)
export const unlockAudio = async (audioElement: HTMLAudioElement) => {
	try {
		await audioElement.play()
		audioElement.pause()
		audioElement.currentTime = 0
	} catch (e) {
		console.error('Audio unlock failed:', e)
	}
}
