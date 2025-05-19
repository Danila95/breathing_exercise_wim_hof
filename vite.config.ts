import path from 'path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { createHtmlPlugin } from 'vite-plugin-html'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(() => {
	// Определяем среду: локальная или продакшн
	const isProd = process.env.NODE_ENV === 'production'

	return {
		base: isProd ? '/projects/breathe/' : './',
		plugins: [
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			svgr({ exportAsDefault: true, include: '**/*.svg' }),
			react(),
			createHtmlPlugin({
				minify: true
			}),
			VitePWA({
				registerType: 'autoUpdate', // Автоматически обновляет сервис-воркер в фоне, если есть новая версия PWA
				includeAssets: ['logo.svg', 'robots.txt'], // Указывает файлы из public/, которые нужно включить в сборку PWA
				manifestFilename: 'manifest.json',
				manifest: {
					name: 'Breathing App', // Полное имя приложения, отображается при установке или в меню приложений.
					short_name: 'Breath', // Короткое имя, отображается под иконкой на домашнем экране.
					description: 'Приложение для дыхательных упражнений',
					theme_color: '#ddd9c2', // Цвет браузерной панели (у Android, Chrome).
					background_color: '#ddd9c2', // Цвет фона загрузочного экрана (splash screen), когда приложение запускается как standalone.
					display: 'standalone', // 'standalone' = как обычное нативное приложение, без адресной строки браузера.
					orientation: 'portrait', // Принудительная ориентация — только вертикальный режим.
					icons: [
						{
							src: '/icons/192x192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: '/icons/512x512.png',
							sizes: '512x512',
							type: 'image/png'
						},
						{
							src: '/icons/512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable'
						}
					]
				},
				workbox: {
					globPatterns: ['**/*.{js,css,html,png,svg,mp3}'], // Указывает, какие файлы автоматически кэшировать
					maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, // 20 МБ
					// Настройка динамического кэширования — во время работы приложения
					runtimeCaching: [
						{
							urlPattern: ({ request }) => request.destination === 'audio', // фильтрует запросы — здесь мы ловим аудио (MP3)
							handler: 'CacheFirst', // сначала пытается загрузить из кэша, если нет — из сети.
							options: {
								cacheName: 'audio-cache', // имя кэша
								expiration: {
									maxEntries: 20, // не больше 20 файлов
									maxAgeSeconds: 60 * 60 * 24 * 30 // срок жизни кэша 30 дней
								}
							}
						}
					]
				}
			})
		],
		resolve: {
			alias: [
				{ find: '@', replacement: path.resolve(__dirname, './src') },
				{ find: '@public', replacement: path.resolve(__dirname, './public') },
				// Подменяем "fs" на пустой модуль для подавления мусорных предупреждений в консоли devTools браузера
				{
					find: 'fs',
					replacement: path.resolve(__dirname, 'src/emptyFsMock.js')
				}
			]
		},
		build: {
			outDir: 'build',
			minify: 'esbuild',
			rollupOptions: {
				output: {
					// Настройка каталога для файлов .js
					entryFileNames: 'js/[name]-[hash].js',
					chunkFileNames: 'js/[name]-[hash].js',
					assetFileNames: ({ names }) => {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						if (/\.css$/.test(names ?? '')) {
							return 'css/[name]-[hash][extname]'
						}
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						if (/\.(gif|jpe?g|png|svg|webp)$/.test(names ?? '')) {
							return 'assets/[name][extname]'
						}
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						if (/\.(woff|woff2|eot|ttf|otf)$/.test(names ?? '')) {
							return 'assets/fonts/[name][extname]'
						}
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						if (/\.(m4a|mp3)$/.test(names ?? '')) {
							return 'assets/[name][extname]'
						}
						return 'assets/[name][extname]'
					}
				}
			}
		},
		server: {
			port: 3000,
			open: true,
			hmr: true
		},
		define: {}
	}
})
