const URL = 'https://restcountries.com/v3.1/name/';
const options = 'fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
  return fetch(`${URL}${name}?${options}`).then(response => response.json());
}
