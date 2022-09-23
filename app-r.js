import countryCode from './countryCode.js';

const $autocompleteToggleButton = document.querySelector('.autocomplete-toggle-button');
const $autocompleteSearch = document.querySelector('.autocomplete-search');
const $autocompleteSuggester = document.querySelector('.autocomplete-suggester');
const $autocompleteSuggestList = document.querySelector('.autocomplete-suggest-list');

// do something!
// prettier-ignore
const renderCountryList = (countryList, filterRegex) => {
  $autocompleteSuggestList.innerHTML = countryList.length === 0
      ? `No result matched '${$autocompleteSearch.value}'`: countryList.map(([code, country]) => `
    <li tabindex="0">
      <span class="country">
        <img src="images/flag/${code}.svg" />
        <span>${filterRegex === undefined ? country :country.replace(filterRegex, '<b>$&</b>')}</span>
      </span>
    </li>`).join('');
};

const toggleSuggester = () => {
  $autocompleteSuggester.classList.toggle('hide');
  $autocompleteSearch.focus();
};

const closeSuggester = () => {
  $autocompleteSuggester.classList.add('hide');
};

const showSelectedCountry = countryHTML => {
  $autocompleteToggleButton.innerHTML = `
  ${countryHTML}
  <i class="bx bx-caret-down"></i>`;
};

const renderFilteredCountryList = () => {
  const inputValue = $autocompleteSearch.value;
  const inputValueRegex = new RegExp(inputValue, 'gi');
  const filteredCountries = countryCode.filter(([, country]) => country.match(inputValueRegex));

  renderCountryList(filteredCountries, inputValueRegex);
};

window.addEventListener('DOMContentLoaded', renderCountryList(countryCode));

$autocompleteToggleButton.addEventListener('click', toggleSuggester);

document.body.addEventListener('click', e => {
  if (e.target.matches('.autocomplete *')) return;
  closeSuggester();
});

$autocompleteSearch.addEventListener('keyup', _.debounce(renderFilteredCountryList, 100));

$autocompleteSuggestList.addEventListener('keydown', e => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') return;

  e.preventDefault();
  if (e.key === 'ArrowDown') (e.target.nextElementSibling ?? $autocompleteSuggestList.firstElementChild).focus();
  else if (e.key === 'ArrowUp') (e.target.previousElementSibling ?? $autocompleteSuggestList.lastElementChild).focus();
  else if (e.key === 'Enter') showSelectedCountry(e.target.innerHTML);
});

$autocompleteSuggestList.addEventListener('click', e => showSelectedCountry(e.target.innerHTML));

// [변경사항]
// - RegExp.prototype.test() 메서드 대신 String.prototype.match() 메서드를 사용하여
// test() 메서드 반복 호출 시 검색 결과를 이전 일치 이후부터 탐색하는 버그 해결
// - 디스트럭쳐링 할당으로 countryList를 code와 country로 분리해 할당하여 가독성을 높임
// - renderCountryList, toggleSuggester, closeSuggester, showSelectedCountry, renderFilteredCountryList의
// 함수를 생성하여 event listener 내부 코드 간소화
// - 반복되는 렌더링 코드를 통합함
