import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(evt) {
  if (!evt.target.value) {
    resetInput();
    Notiflix.Notify.warning('Please enter country name');
    return;
  }
  return fetchCountries(evt.target.value.trim())
    .then(showCountry)
    .catch(showError);
}

function showCountry(countries) {
  if (countries.length > 10) {
    resetInput();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (countries.length > 1 && countries.length <= 10) {
    resetInput();
    countryList.innerHTML = countryListMarkup(countries);
    return;
  }
  resetInput();
  countryInfo.innerHTML = countryInfoMarkup(countries);
}

function countryInfoMarkup(countries) {
  return countries
    .map(({ flags, name, capital, population, languages }) => {
      return `<img src="${flags.svg}" alt="${
        name.official
      }" width="60" height="40" />
        <h1>${name.official}</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages)}</p>`;
    })
    .join('');
}

function countryListMarkup(countries) {
  return countries
    .map(({ flags, name }) => {
      return `<li>
        <img src="${flags.svg}" alt="${name.official}" width="50" height="30" />
        <p>${name.official}</p>
        </li>`;
    })
    .join('');
}

function showError() {
  resetInput();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function resetInput() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
