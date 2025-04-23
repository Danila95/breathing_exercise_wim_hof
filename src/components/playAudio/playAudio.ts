import { unlockAudio } from '@/components/unlockAudio'

// Функция по воспроизведению аудио
export const playAudio = async (
	audioElement: HTMLAudioElement | null,
	audioContextUnlocked: boolean,
	setAudioContextUnlocked: React.Dispatch<React.SetStateAction<boolean>>
) => {
	if (!audioElement) return

	try {
		audioElement.currentTime = 0
		await audioElement.play()
	} catch (e) {
		console.error('Audio play failed:', e)
		// Пытаемся разблокировать снова
		if (!audioContextUnlocked) {
			await unlockAudio(audioElement)
			setAudioContextUnlocked(true)
			await playAudio(
				audioElement,
				audioContextUnlocked,
				setAudioContextUnlocked
			)
		}
	}
}
