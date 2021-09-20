const select = document.getElementById('countriesList');
const response = []; //Covid for statistic calculation

//  fetch 1 get country names
const getCountries = () => {
  const countries = fetch('https://api.covid19api.com/countries')
    .then((response) => {
      if (!response.ok) {
        // statuses 400+
        // if(response.status >= 200 && response.status < 300){
        throw new Error(`Response status is ${response.status}`);
      } else {
        return response;
      }
    })
    .then((request) => request.json())
    .then((data) => {
      console.log('fetch 1 country names =>', data);
      return data;
    })
    .catch((error) => console.log('error in 1-st fetch =>', error)); // 500+ statuses
  return countries;
};
// call fetch get country names
function addCountriesList() {
  getCountries().then((countries) =>
    countries.forEach((obj) => {
      const option = document.createElement('option');
      option.value = obj.Slug;
      option.textContent = obj.Country;
      select.appendChild(option);
    })
  );
}

// set country
select.addEventListener('change', () => pullCovidInf(select.value));

// fetch 2
function getCovidInf(country) {
  const countryUrl = 'https://api.covid19api.com/country/' + country;

  const covidInf = fetch(countryUrl)
    .then((request) => request.json())
    .then((covidInf) => {
      console.log('fetch 2 - covid inf from country =>', covidInf);
      return covidInf;
    })
    .catch((error) => console.log('error in 2-nd fetch =>', error));
  return covidInf;
}

function pullCovidInf(country) {
  getCovidInf(country).then((Covid) => {
    // checking country  data for availability inform cov
    const content = clearContent();
    const h2 = document.createElement('h2');
    if (!Covid.length) {
      h2.textContent = "Server hasn't information about covid-19 in this country";
      content.appendChild(h2);
    }
    response.length = 0;

    response.push(...Covid);
    console.log('response -> ', response); //
    creatContent();
  });
}

function creatContent() {
  const content = clearContent();
  const h2 = document.createElement('h2');
  h2.textContent = 'Country - ' + response[response.length - 1].Country;

  const p0 = document.createElement('p');
  p0.textContent = `Date - ${response[response.length - 1].Date}`;

  const p1 = document.createElement('p');
  p1.textContent = `Amount of infected - ${response[response.length - 1].Active}`;

  const p2 = document.createElement('p');
  p2.textContent = `Amount deaths - ${response[response.length - 1].Deaths}`;

  content.appendChild(h2);
  content.appendChild(p0);
  content.appendChild(p1);
  content.appendChild(p2);
  content.classList.add('content');

  //create BUTTON
  const week = document.createElement('button');
  week.textContent = 'Statistics for last week';
  week.addEventListener('click', () => {
    addStatistic(response[response.length - 1], response[response.length - 8], 'week');
  });
  const month = document.createElement('button');
  month.textContent = 'Statistics for last month';
  month.addEventListener('click', () => {
    addStatistic(response[response.length - 1], response[response.length - 31], 'month');
  });
  content.appendChild(week);
  content.appendChild(month);
}

function clearContent() {
  const content = document.getElementById('content');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  return content;
}

function addStatistic(today, dayAgo, time) {
  const cont = clearContent();
  const deaths = document.createElement('p');
  deaths.textContent = 'People DEATHS -' + (today.Deaths - dayAgo.Deaths);
  const confirmed = document.createElement('p');
  confirmed.textContent = 'People CONFIRMED -' + (today.Confirmed - dayAgo.Confirmed);
  const active = document.createElement('p');
  active.textContent = 'People ACTIVE -' + (today.Active - dayAgo.Active);
  const Time = document.createElement('h2');
  Time.textContent = `For last ${time}`;
  const buttonReturn = document.createElement('button');
  buttonReturn.textContent = 'Return';
  buttonReturn.addEventListener('click', () => creatContent());
  cont.appendChild(Time);
  cont.appendChild(active);
  cont.appendChild(confirmed);
  cont.appendChild(deaths);
  cont.appendChild(buttonReturn);
}

//    S   T   A   R    T
document.addEventListener('DOMContentLoaded', () => addCountriesList());
