import countryCode from './countryCode.js';

const $autocompleteSuggestList = document.querySelector('.autocomplete-suggest-list');

// do something!
// prettier-ignore
const renderCountryList = (() => {
  $autocompleteSuggestList.innerHTML = countryCode
    .map(country =>
      `<li tabindex="0">
        <span class="country">
          <img src="images/flag/${country[0]}.svg" />
          <span>${country[1]}</span>
        </span>
      </li>`
    ).join('');
})();

const $autocompleteSuggester = document.querySelector('.autocomplete-suggester');
const $autocompleteSearch = document.querySelector('.autocomplete-search');

const toggleSuggester = () => {
  $autocompleteSuggester.classList.toggle('hide');
  $autocompleteSearch.focus();
};

const closeSuggester = () => {
  $autocompleteSuggester.classList.add('hide');
};

const showSelectedCountry = countryHTML => {
  document.querySelector('.autocomplete-toggle-button').innerHTML = `
  ${countryHTML}
  <i class="bx bx-caret-down"></i>
  `;
};

document.querySelector('.autocomplete-toggler').addEventListener('click', toggleSuggester);

document.querySelector('body').addEventListener('click', e => {
  if (e.target.matches('.autocomplete *')) return;
  closeSuggester();
});

$autocompleteSuggestList.addEventListener('keydown', e => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') return;

  e.preventDefault();
  if (e.key === 'ArrowDown') (e.target.nextElementSibling ?? e.target.parentElement.firstElementChild).focus();
  else if (e.key === 'ArrowUp') (e.target.previousElementSibling ?? e.target.parentElement.lastElementChild).focus();
  else if (e.key === 'Enter') showSelectedCountry(e.target.innerHTML);
});

$autocompleteSuggestList.addEventListener('click', e => showSelectedCountry(e.target.innerHTML));

const renderFilteredCoutrtyList = (inputValue, inputValueRegex, filteredCountries) => {
  // prettier-ignore
  $autocompleteSuggestList.innerHTML =
    filteredCountries.length === 0 ? `No result matched '${inputValue}'`
      : filteredCountries.map(country =>
        `<li tabindex="0">
          <span class="country">
            <img src="images/flag/${country[0]}.svg" />
            <span>${country[1].replace(inputValueRegex, '<b>$&</b>')}</span>
          </span>
        </li>`).join('');
};

const filterMatchedCountries = () => {
  const inputValue = $autocompleteSearch.value;
  const inputValueRegex = new RegExp(inputValue, 'gi');
  const filteredCountries = countryCode.filter(country => inputValueRegex.test(country[1]));
  renderFilteredCoutrtyList(inputValue, inputValueRegex, filteredCountries);
};

$autocompleteSearch.addEventListener('keyup', _.debounce(filterMatchedCountries, 100));
