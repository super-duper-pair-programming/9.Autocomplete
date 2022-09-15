import countryCode from './countryCode.js';

// do something!

document.querySelector('.autocomplete-suggest-list').innerHTML = countryCode
  .map(
    country =>
      `<li tabindex="0">
        <span class="country">
          <img src="images/flag/${country[0]}.svg" />
          <span>${country[1]}</span>
        </span>
      </li>`
  )
  .join('');

document.querySelector('.autocomplete-toggler').addEventListener('click', () => {
  document.querySelector('.autocomplete-suggester').classList.toggle('hide');
  document.querySelector('.autocomplete-search').focus();
});

document.querySelector('body').addEventListener('click', e => {
  if (e.target.matches('.autocomplete *')) return;
  document.querySelector('.autocomplete-suggester').classList.add('hide');
});

document.querySelector('.autocomplete-suggest-list').addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    (e.target.nextElementSibling ?? e.target.parentElement.firstElementChild).focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    (e.target.previousElementSibling ?? e.target.parentElement.lastElementChild).focus();
  } else if (e.key === 'Enter') {
    document.querySelector('.autocomplete-toggle-button').innerHTML = `
    ${e.target.innerHTML}
    <i class="bx bx-caret-down"></i>
    `;
  }
});

document.querySelector('.autocomplete-suggest-list').addEventListener('click', e => {
  document.querySelector('.autocomplete-toggle-button').innerHTML = `
    ${e.target.closest('li').innerHTML}
    <i class="bx bx-caret-down"></i>
    `;
});

const $autocompleteSearch = document.querySelector('.autocomplete-search');
$autocompleteSearch.addEventListener(
  'keyup',
  _.debounce(() => {
    const inputValue = $autocompleteSearch.value;
    const inputValueRegex = new RegExp(inputValue, 'gi');

    const filteredCountries = countryCode.filter(country =>
      country[1].toLowerCase().includes(inputValue.toLowerCase())
    );

    document.querySelector('.autocomplete-suggest-list').innerHTML =
      filteredCountries.length === 0
        ? `No result matched '${inputValue}'`
        : filteredCountries
            .map(
              country =>
                `<li tabindex="0">
            <span class="country">
              <img src="images/flag/${country[0]}.svg" />
              <span>${country[1].replace(inputValueRegex, '<b>$&</b>')}</span>
            </span>
          </li>`
            )
            .join('');
  }, 100)
);
