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
const cardIcon = document.getElementById('cardIcon')

function updateUI(data) {
	cardWind.innerHTML = `${Math.round(data.wind.speed)} km/h`
	cardHumidity.innerHTML = `${data.main.humidity} %`
	cardLocation.innerHTML = `${data.name}, ${data.sys.country}`
	cardTemperature.innerHTML = `${Math.round(data.main.temp)}°, ${
		data.weather[0].description
	}`
	cardFeels.innerHTML = `Feels like ${Math.round(data.main.feels_like)}°`
	cardIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
}

if ('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(position => {
		const lat = position.coords.latitude.toFixed(2)
		const lon = position.coords.longitude.toFixed(2)
		getWeatherCoords(lon, lat)
	})
} else {
	console.log(`geolocation is NOT available`)
}
async function getWeatherCoords(lon, lat) {
	try {
		const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
		const res = await fetch(url)

		if (!res.ok) {
			throw new Error(`Location not found.`)
		}

		const data = await res.json()
		updateUI(data)
	} catch (error) {
		console.error('Geo fetch error:', error.message)
	}
}
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
		updateUI(data)
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
