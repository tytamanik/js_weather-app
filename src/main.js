import './style.scss'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const searchInput = document.querySelector('.card__search-input')

let timer
const delay = 1500

const cardLocation = document.querySelector('.card__location')
const cardTemperature = document.querySelector('.card__temp')
const cardHumidity = document.getElementById('humidityValue')
const cardWind = document.getElementById('windValue')
const cardFeels = document.getElementById('feelsValue')

async function getWeather(city) {
	if (!city.trim()) return
	try {
		const url = `${BASE_URL}?q=${encodeURIComponent(
			city
		)}&appid=${API_KEY}&units=metric`
		const res = await fetch(url)
		if (!res.ok) {
			throw new Error(`Location not found.`)
		}
		const data = await res.json()
		console.log(data)
		cardWind.innerHTML = `${data.wind.speed} km/h`
		cardHumidity.innerHTML = `${data.main.humidity} %`
		cardLocation.innerHTML = `${data.name}, ${data.sys.country}`
		cardTemperature.innerHTML = `${Math.round(data.main.temp)}°`
		cardFeels.innerHTML = `Feels like ${Math.round(data.main.feels_like)}°`
	} catch (error) {
		console.error('Error:', error.message)
	}
}

searchInput.addEventListener('input', e => {
	clearTimeout(timer)
	timer = setTimeout(() => {
		getWeather(e.target.value)
	}, delay)
})

searchInput.addEventListener('blur', e => {
	clearTimeout(timer)
	getWeather(e.target.value)
})
