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
  fetchCountries(e.target.value).then(data => {
    if (data.length > 10) {
      moreThanTenCountries();
    } else if (data.length === 1) {
      oneCountry(data[0]);
    } else if (data.length > 1 || data.length <= 10) {
      countriesMarkup(data);
    }
  });
}

function oneCountry({ flags, name, capital, population, languages }) {
  clearForm();
  const oneCountryMarkup = `
    <h1><img src="${flags.svg}" width="60" />${name.official}</h1>
    <ul>
    <li>Capital: ${capital}</li>
    <li>Population: ${population}</li>
    <li>Languages: ${languages}</li>
    </ul>`;

  refs.countryInfo.innerHTML = oneCountryMarkup;
}

function countriesMarkup(countries) {
  clearForm();
  countries.map(({ flags, name }) => {
    const multipleMarkup = `
    <p><img src="${flags.svg}" width="60" />${name.official}</p>`;
    refs.countryList.innerHTML = multipleMarkup;
  });
}

function moreThanTenCountries() {
  clearForm();
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function clearForm() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
