new Vue({
    el:'#app',
    data: {
        condition: {
            main: '',
            icon: ''
        },
        city:  {
            name: '',
            img: ''
        },
        date: '',
        tempInfo: {},
        daysWeather: [],
        loader: true,
        notify: ''
    },
    mounted() {

        if(!navigator.geolocation) {
            this.notify = 'Geolocation is not supported by your browser';
        } else {
            this.notify = 'Getting your current location';

            navigator.geolocation.getCurrentPosition(
                (position) => {

                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    const geolocationAPI = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=7538c8d3681dbc01187de2b99ba378c3`;
                    const weatherAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,minutely&appid=7538c8d3681dbc01187de2b99ba378c3`;

                    axios
                        .get(geolocationAPI)
                        .then(response => {
                            const data = response.data;
                            console.log(data);
                            if(!data.length) throw 'error';
                            setTimeout(() => {
                                this.city.name = data[0].name;
                                this.city.img = this.getCityImage(this.city.name);
                                this.loader = false;
                                this.notify = '';
                            }, 1000);
                        })
                        .catch((err) => {
                            this.loader = false;
                            this.notify = 'Something went wrong with getting info about your current location. Please refresh the page';
                        });

                    axios
                        .get(weatherAPI)
                        .then(response => {
                            const data = response.data;
                            console.log(data);
                            
                            const currentData = data.current;
                            const date = new Date();

                            this.condition = currentData.weather[0];
                            this.getConditionImage(date, currentData);

                            this.date = this.getWeekDay(date) + ', ' + this.getDay(date) + ' ' + this.getMonth(date);

                            this.tempInfo.temp = Math.ceil(currentData.temp);
                            this.tempInfo.feels_like =  Math.ceil(currentData.feels_like);
                            this.tempInfo.humidity = currentData.humidity;
                            this.tempInfo.clouds = currentData.clouds;
                            this.tempInfo.wind_speed = currentData.wind_speed;

                            this.daysWeather = data.daily;
                            this.daysWeather.shift();

                        })
                        .catch(err => {
                            this.loader = false;
                            this.notify = 'Something went wrong with getting info about weather for your current location. Please refresh the page';
                        });

                }, 
                () => {
                    this.loader = false;
                    this.notify = 'Unable to retrieve your location';
                }
            );
        }

    },
    methods: {

        getDay(date) {
            return date.getDate();
        },

        getWeekDay(date) {
            const index = date.getDay();
            return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index];
        },

        getMonth(date) {
            const index = date.getMonth();
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index];
        },

        getCityImage(responseCityName) {
            const formattedCityName = responseCityName.replace(/\s/g, '%20');
            return 'image/cities/' + formattedCityName + '.jpg';
        },

        getConditionImage(date, currentData) {
            
            let day = true;

            const sunsetDate = new Date(currentData.sunset);
            const sunsetTime = {
                hours: sunsetDate.getHours(),
                minutes: sunsetDate.getMinutes(),
                seconds: sunsetDate.getSeconds()
            };

            const dateTime = {
                hours: date.getHours(),
                minutes: date.getMinutes(),
                seconds: date.getSeconds()
            };

            if(
                dateTime.hours > sunsetTime.hours ||
                dateTime.hours === sunsetTime.hours && dateTime.minutes > sunsetTime.minutes ||
                dateTime.hours === sunsetTime.hours && dateTime.minutes === sunsetTime.minutes && dateTime.seconds > sunsetTime.seconds
            ) {
                day = false;
            }

            this.condition.icon = 'image/conditions/' + this.condition.main + (day ? '-day.png' : '-night.png');
        }

    }

});