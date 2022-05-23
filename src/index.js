import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSubmit, DEBOUNCE_DELAY));

function onInputSubmit(e) {
  e.preventDefault();

  if (e.target.value === '') {
    clearForm();
    return;
  }

  fetchCountries(e.target.value)
    .then(data => {
      if (data.length > 10) {
        moreThanTenCountries();
      } else if (data.length === 1) {
        oneCountry(data[0]);
      } else if (data.length > 1 || data.length <= 10) {
        countriesMarkup(data);
      }
    })
    .catch(() => {
      clearForm();
      Notify.failure('Oops, there is no country with that name');
    });
}

function oneCountry(country) {
  clearForm();
  makeCountryMarkup(country);
}

function countriesMarkup(countries) {
  clearForm();
  makeCountriesMarkup(countries);
}

function moreThanTenCountries() {
  clearForm();
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function clearForm() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function makeCountryMarkup({ flags, name, capital, population, languages }) {
  const oneCountryMarkup = `
  <h1 class="header"><img src="${flags.svg}" width="60" />${name.official}</h1>
  <ul class="list">
  <li class="list__item"><b>Capital</b>: ${capital}</li>
  <li class="list__item"><b>Population</b>: ${population.toLocaleString()}</li>
  <li class="list__item"><b>Languages</b>: ${Object.values(languages)}</li>
  </ul>`;

  refs.countryInfo.innerHTML = oneCountryMarkup;
}

function makeCountriesMarkup(countries) {
  countries.map(({ flags, name }) => {
    const multipleMarkup = `
    <p class="country"><img src="${flags.svg}" width="60" />${name.official}</p>`;
    refs.countryList.insertAdjacentHTML('beforeend', multipleMarkup);
  });
}
