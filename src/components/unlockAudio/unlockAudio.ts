// Функция для разблокировки аудио (предназначена в основном для работы на мобильных устройствах)
export const unlockAudio = async (audioElement: HTMLAudioElement) => {
	try {
		const previousVolume = audioElement.volume
		audioElement.volume = 0 // Отключаем звук

		await audioElement.play()
		audioElement.pause()
		audioElement.currentTime = 0

		audioElement.volume = previousVolume // Возвращаем прежний уровень громкости
	} catch (e) {
		console.error('Audio unlock failed:', e)
	}
}
