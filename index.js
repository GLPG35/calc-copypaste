const button = document.querySelector('button')
const result = document.querySelector('.result')

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
	]
}

button.addEventListener('click', () => {
	navigator.clipboard.readText()
	.then(text => {
		const prices = text.split('\n')
		const parsePrices = prices.map(product => {
			const price = Number(product.match(/(?<=\$)(.*)/gi))
			const type = product.split(' - ')[0].split(' ')[1]

			return {
				price,
				type
			}
		})

		const total = parsePrices.reduce((prev, curr) => prev + curr.price, 0)
		const parsedTypes = {
			'Láminas': 0,
			'Envíos': 0,
			'Discos': 0
		}
		parsePrices.forEach(price => {
			const type = Object.entries(types).find(x => x[1].find(y => y.localeCompare(price.type, undefined, { sensitivity: 'base' }) === 0))

			parsedTypes[type[0]] += price.price
		})

		result.innerHTML = `$${total} ✨`
		result.insertAdjacentHTML('afterend', `
			<div class="types">
				<div class="type">
					<i class="ph-bold ph-file"></i>$${parsedTypes['Láminas']}
				</div>
				<div class="type">
					<i class="ph-bold ph-truck"></i>$${parsedTypes['Envíos']}
				</div>
				<div class="type">
					<i class="ph-bold ph-disc"></i>$${parsedTypes['Discos']}
				</div>
			</div>
		`)
	})
})