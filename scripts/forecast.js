// API Interaction
class Forecast {
    constructor() {
        this.key = 'GRM14XNEjtHzTjsKOMATpE6USlFICu5O';
        //this.key = 'slOdXF6hDYlBwdAXABY8k4PgzS1PDe9Y';
        this.weatherURI = 'http://dataservice.accuweather.com/currentconditions/v1/';
        this.cityURI = 'http://dataservice.accuweather.com/locations/v1/cities/search';
        this.days5URI = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
        this.day12HoursURI = 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/';
    }
    async updateCity(city) {
        const cityDetails = await this.getCity(city);
        const queryDetails = `${cityDetails.Key}?apikey=${this.key}`;
        const weather = await this.getWeather(queryDetails);
        const forecast5Days = await this.get5Days(queryDetails);
        const day12Hours = await this.get12Hours(queryDetails);
        
        return { cityDetails, weather, forecast5Days, day12Hours };
    }
    async getCity(city){
        const query = `?apikey=${this.key}&q=${city}`;
        //Query parameters are 'apikey' and 'q'(city)
        const response = await fetch (this.cityURI + query);
        const data = await response.json();
        return data[0];
    }
    async getWeather(queryDetails){
        const response = await fetch(this.weatherURI + queryDetails);
        const data = await response.json();
        return data[0];
    }
    async get5Days(queryDetails){
        const response = await fetch(this.days5URI + queryDetails);
        const data = await response.json();
        return data.DailyForecasts;
    }
    async get12Hours(queryDetails){
        const response = await fetch(this.day12HoursURI + queryDetails);
        const data = await response.json();
        return data;
    }
}