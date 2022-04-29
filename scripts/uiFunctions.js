checkDayNight = weather => {
    let bodyBack = document.body;
    if (weather.IsDayTime) {
      let sunColour = "linear-gradient(rgb(32, 61, 94),rgb(50, 144, 231))no-repeat fixed";
      let cloudColour = "linear-gradient(rgb(68, 63, 63),gray) no-repeat fixed";
      bodyBack.style.background = weather.WeatherText.toLowerCase().includes("sun") ? 
      bodyBack.style.background = sunColour : bodyBack.style.background = cloudColour;
    }
    else {
      bodyBack.style.background = "black";
      window.innerWidth > 768 ? moon.classList.remove('d-none') : moon.classList.add('d-none');
    }
  }
  
  // Current condition populater
  
  fillCurrentConditions = (cityDetails, weather) => {
    const currentDayTime = timeConversion(weather.LocalObservationDateTime);
    const { month, day, date } = currentDayTime;
    details.innerHTML = `
      <p id="city-day">${day}, ${month} ${date} </p>  
      <p id="city-country">${cityDetails.EnglishName}, ${cityDetails.Country.ID}</p>
      <p id="geo">
            <span>Latitude: ${cityDetails.GeoPosition.Latitude}</span> 
            <span>Longitude: ${cityDetails.GeoPosition.Longitude}</span>
      </p>
      <img src="img/icons/${weather.WeatherIcon}.png" alt="condition icon" class="condition-icon"> 
      <div id="current-condition">${weather.WeatherText}</div>
      <div id="temperature">
              <span id="current-temp">${Math.round(weather.Temperature.Metric.Value)}</span>
              <span id="current-temp-type">&deg;C</span>
      </div>
      `;
    cityForm.classList.toggle("d-none");    
  }
  
  // 12-hour forecast populater

  fill12Hours = day12Hours => {
    let box;
    container12Hours.innerHTML = "";
    day12Hours.forEach((hour, index) => {
      const hours12Forecast = timeConversion(hour.DateTime);
      let { hours12Hour, meridiem12 } = hours12Forecast;
      container12Hours.innerHTML += `
        <div class="hours12-boxes" name="hours12-box" id='h12-${index}'>
          <div class="hours12-image">
            <img src="img/icons/${hour.WeatherIcon}.png" alt="condition icon"> 
          </div>        
          <div class="hours12-time">
            <p id="hours12-time">${hours12Hour}:00 ${meridiem12}</p>
            <span id="hours12-temp">${Math.round(fahToCel(hour.Temperature.Value))}&deg;C</span>
          </div>
          <p id="hours12-condition" class="">${hour.IconPhrase}</p>
        </div>`;
      box = document.getElementById(`h12-${index}`);
      if (hour.IsDaylight) {
        if (hour.IconPhrase.toLowerCase().includes('sun')) box.classList.add('sun');
        else box.classList.add('cloud');
      }
      else box.style.background = 'black';
    })
  }
  
  // 5-Day forecast populater 

  fill5Days = (forecast5Days, weather) => {
    container5Days.innerHTML = "";
    let box;
    forecast5Days.forEach((day, index) => {
      const fiveDayForecast = timeConversion(day.Date);
      let { month, dayShort, date } = fiveDayForecast;
      container5Days.innerHTML += `
        <div class="forecast-boxes" id='fb${index}'>
          <div class="forecast-image">
            <img src="img/icons/${day.Day.Icon}.png" alt="condition icon">
          </div>
          <div class="forecast-date">
            <p id="fiveDayDate">${dayShort} , ${month} ${date}</p>  
          </div>
          <div class="forecast-temps">
            <span id="max-temp">Max: ${Math.round(fahToCel(day.Temperature.Maximum.Value))}&deg;C</span><br>
            <span id="min-temp">Min: ${Math.round(fahToCel(day.Temperature.Minimum.Value))}&deg;C</span>
          </div>
          <button class="days5-expander">
            <img src="img/plus.svg" alt="resize-button">
          </button>
          <div class="expanded-box d-none">
            <p>Day: ${day.Day.IconPhrase}</p>
            <p>Night: ${day.Night.IconPhrase}</p>
          </div>
        </div>`;
      box = document.getElementById(`fb${index}`);
      if (day.Day.IconPhrase.toLowerCase().includes('sun')) {
        box.classList.add('sun');
      }
      else box.classList.add('cloud');
    })
    let expanderButtons = document.querySelectorAll('.days5-expander');
    expanderButtons.forEach(button => button.addEventListener('click', e=>{
      e.target.src = e.target.src.includes('plus')? "img/minus.svg":"img/plus.svg";
      e.target.parentElement.nextElementSibling.classList.toggle('d-none');
    }))
  }

  tempScale = (weather, forecast5Days, day12Hours) => {
    if (tempSwitch.innerHTML == "°C") {
      document.getElementById("current-temp").innerHTML = `${Math.round(weather.Temperature.Imperial.Value)}`;
      document.getElementById("current-temp-type").innerHTML = `&deg;F`;
      document.querySelectorAll("#hours12-temp").forEach((temp, index) => {
        temp.innerHTML = `${day12Hours[index].Temperature.Value}&deg;F`;
      });
      document.querySelectorAll("#max-temp").forEach((temp, index) => {
        temp.innerHTML = `Max: ${forecast5Days[index].Temperature.Maximum.Value}&deg;F`;
      });
      document.querySelectorAll("#min-temp").forEach((temp, index) => {
        temp.innerHTML = `Min: ${forecast5Days[index].Temperature.Minimum.Value}&deg;F`;
      });
    } else {
      document.getElementById("current-temp").innerHTML = `${Math.round(weather.Temperature.Metric.Value)}`;
      document.getElementById("current-temp-type").innerHTML = `&deg;C`;
      document.querySelectorAll("#hours12-temp").forEach((temp, index) => {
        temp.innerHTML = `${Math.round(fahToCel(day12Hours[index].Temperature.Value))}&deg;C`;
      });
      document.querySelectorAll("#max-temp").forEach((temp, index) => {
        temp.innerHTML = `Max: ${Math.round(fahToCel(forecast5Days[index].Temperature.Maximum.Value))}&deg;C`;
      });
      document.querySelectorAll("#min-temp").forEach((temp, index) => {
        temp.innerHTML = `Min: ${Math.round(fahToCel(forecast5Days[index].Temperature.Minimum.Value))}&deg;C`;
      });
    }
  };