import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig(() => {
	return {
		plugins: [],
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
					entryFileNames: 'js/[name].js',
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
							return 'assets/images/[name][extname]'
						}
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						if (/\.(woff|woff2|eot|ttf|otf)$/.test(names ?? '')) {
							return 'assets/fonts/[name][extname]'
						}
						return 'assets/[name][extname]'
					}
				}
			}
		},
		server: {
			port: 3000,
			open: true
		},
		define: {}
	}
})
