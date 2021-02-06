// http://api.openweathermap.org/geo/1.0/reverse?lat=49.8397&lon=24.0297&limit=1&appid=7538c8d3681dbc01187de2b99ba378c3 api geo location
// https://api.openweathermap.org/data/2.5/onecall?lat=49&lon=24&units=metric&exclude=hourly,minutely&appid=7538c8d3681dbc01187de2b99ba378c3 api days

// https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA0go2f13q6DML0s9zBt3UhiQLqpkdYhFg

// 7538c8d3681dbc01187de2b99ba378c3 key api
// AIzaSyA0go2f13q6DML0s9zBt3UhiQLqpkdYhFg key api google geolocation
// 49.842353, 24.028839
// &units=metric

function initSlider() {

    setTimeout(() => {
        $('.slideshow').slick({
            variableWidth: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            adaptiveHeight: true,
            autoplay: true,
            autoplaySpeed: 4000,
            pauseOnHover:true,
            pauseOnFocus:true,
            focusOnSelect: true
        
          });
    }, 300);

};

new Vue({
        el:'#app',
        data:{
            days:['Sun', 'Mon' , 'Tue' , 'Wed' , 'Thu' , 'Fri' , 'Sat'],
            month:['January','February','March','April','May','June','July',
            'August','September','October','November','December'],
            location:{
                currentDate: '',
            },
            dayInfo: {
                temp: '',
                feels: '',
                winds:'',
                humid:'',
                cloudiness:'',
            },
            weatherInfo:{
                icon: '',
                name: '',
            },
            сity: '',

            daysInfo: [],
            errored: false
        },
        mounted(){

            if(navigator.geolocation){

                navigator.geolocation.getCurrentPosition(
                    (position) =>{

                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                    axios
                        .get('http://api.openweathermap.org/geo/1.0/reverse?lat='+latitude+'&lon='+longitude+'&limit=1&appid=7538c8d3681dbc01187de2b99ba378c3')
                        .then(response => {
                            const data = response.data;
                            console.log(data);
                            this.сity = data[0].name;
                        })
                        .catch(error => {
                            console.log('error');
                            this.errored = true;
                        });
                    },
                    () =>{}
                );

            }


            // axios
            //     .get('http://api.openweathermap.org/geo/1.0/reverse?lat=49.8397&lon=24.0297&limit=1&appid=7538c8d3681dbc01187de2b99ba378c3')
            //     .then(response => {
            //         const data = response.data;
            //         console.log(data);
            //         this.сity = data[0].name;
            //     })
    
            //     .catch(error => {
            //         console.log('error');
            //         this.errored = true;
            //     })


             axios
                .get('https://api.openweathermap.org/data/2.5/onecall?lat=49&lon=24&units=metric&exclude=hourly,minutely&appid=7538c8d3681dbc01187de2b99ba378c3')
                .then(response => {
                    const data = response.data;
                    const date = new Date();
                    console.log(data);
                    this.location.currentDate = this.days[date.getDay()] + ' , ' + date.getDate() + ' ' + this.month[date.getMonth()];     
                    this.dayInfo.temp = Math.ceil(data.current.temp);
                    this.dayInfo.feels = Math.ceil(data.current.feels_like);
                    this.dayInfo.winds = data.current.wind_speed;
                    this.dayInfo.humid = data.current.humidity;
                    this.dayInfo.cloudiness = data.current.clouds;
                    this.weatherInfo.name = data.current.weather[0].main;
                    this.weatherInfo.icon = 'http://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png';
                    this.daysInfo = data.daily;

                    initSlider();
                    
                })
                .catch(error => {
                    // console.log('error');
                    this.errored = true;
                }) 
        }
    
    })

