const button = document.querySelector('button')
const result = document.querySelector('.result')

button.addEventListener('click', () => {
	navigator.clipboard.readText()
	.then(text => {
		const prices = text.match(/(\d+\d{1,2})/g)

		const total = prices.reduce((prev, curr) => +prev + +curr, 0)

		result.innerHTML = `$${total} ✨`
	})
})