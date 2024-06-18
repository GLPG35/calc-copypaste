const button = document.querySelector('button')
const result = document.querySelector('.result')
const typesContainer = document.querySelector('.types')
const downloads = document.querySelector('.download')
const capture = document.querySelector('.capture')

const currentMonth = Intl.DateTimeFormat('en-US', { month: 'long' }).format(Date.now()).toLocaleLowerCase()
const currentPalette = colorPalettes[currentMonth]
document.documentElement.style.setProperty('--bg-color', currentPalette.bg)
document.documentElement.style.setProperty('--button-color', currentPalette.button)
document.documentElement.style.setProperty('--card-color', currentPalette.card)
document.documentElement.style.setProperty('--text-color', currentPalette.text)

const types = {
	'Láminas': [
		'láminas',
		'lámina',
	],
	'Envíos': [
		'envíos',
		'envío'
	],
	'Discos': [
		'discos',
		'disco'
	],
	'Impresiones': [
		'impresiones',
		'impresión'
	]
}

button.addEventListener('click', () => {
	navigator.clipboard.readText()
	.then(text => {
		const prices = text.split('\n')
		const parsePrices = prices.map(product => {
			const price = Number(product.match(/(?<=\$)(.*)/gi))
			const type = product.split(' - ')[0].split(' ')[1]
			const quantity = product.split(' ')[0]
			const wpp = product.split(' - ')[0].split(' ').length === 3 ? true : false

			return {
				price,
				type,
				quantity,
				wpp
			}
		})

		const total = parsePrices.reduce((prev, curr) => prev + curr.price, 0)
		const parsedTypes = {
			'Láminas': 0,
			'Envíos': 0,
			'Discos': 0,
			'Impresiones': 0
		}
		let savings = 0
		parsePrices.forEach(price => {
			const type = Object.entries(types).find(x => x[1].find(y => y.localeCompare(price.type, undefined, { sensitivity: 'base' }) === 0))
			
			if (type[0] == 'Láminas') {
				savings += price.wpp ? 100 * price.quantity : 58 * price.quantity
			}

			parsedTypes[type[0]] += price.price
		})

		result.innerHTML = `
			<i class="ph-light ph-star-four"></i>
			<div class="content">
				<div class="title">Total Gian</div>
				<span>$${total}</span>
			</div>
		`
		typesContainer.innerHTML = `
			<div class="type">
				<i class="ph-light ph-bank"></i>
				<div class="title">Ahorros</div>
				<span>$${savings}</span>
			</div>
			<div class="type">
				<i class="ph-light ph-file"></i>
				<div class="title">Láminas</div>
				<span>$${parsedTypes['Láminas']}</span>
			</div>
			<div class="type">
				<i class="ph-light ph-truck"></i>
				<div class="title">Envíos</div>
				<span>$${parsedTypes['Envíos']}</span>
			</div>
			<div class="type">
				<i class="ph-light ph-disc"></i>
				<div class="title">Discos</div>
				<span>$${parsedTypes['Discos']}</span>
			</div>
			<div class="type">
				<i class="ph-light ph-printer"></i>
				<div class="title">Impresiones</div>
				<span>$${parsedTypes['Impresiones']}</span>
			</div>
		`

		downloads.innerHTML = `
			<button class="all">
				<div class="icon">
					<i class="ph-bold ph-file-arrow-down"></i>
				</div>
				Descargar todo
			</button>
		`

		const downloadAllButton = document.querySelector('button.all')

		const downloadAll = () => {
			html2canvas(capture).then(canvas => {
				const imgData = canvas.toDataURL('image/png')
				const currentMonth = new Intl.DateTimeFormat('es-UY', { month: 'long' }).format(Date.now())

				const link = document.createElement('a')
				link.download = `Todo Láminas ${currentMonth}.png`
				link.href = imgData
				link.click()
				link.remove()
			})
		}

		downloadAllButton.addEventListener('click', downloadAll)
	})
})