const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support geolocation API");
  }
});

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=6c88959511f248066cfc920b9afff80e`;
  fetchData();
}

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=6c88959511f248066cfc920b9afff80e`;
  fetchData();
}


function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((res) => res.json())
    .then((result) => {
      console.log(result); // Log the response
      weatherDetails(result);
    })
    .catch((error) => {
      console.error("Fetch error:", error); // Log the fetch error
      infoTxt.innerText = "Something went wrong";
      infoTxt.classList.replace("pending", "error");
    });
}
function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys && info.sys.country; // Check if info.sys is defined
    const weatherArray = info.weather || []; // Ensure info.weather is defined or use an empty array
    const { description, id } = weatherArray[0] || {}; // Access the first element or use an empty object
    const mainInfo = info.main || {}; // Ensure info.main is defined or use an empty object
    const { temp, feels_like, humidity } = mainInfo; // Destructure properties from mainInfo

    if (id == 800) {
      wIcon.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "icons/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "icons/rain.svg";
    }

    if (temp !== undefined) {
      // Check if temp is defined before using it
      weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    }

    weatherPart.querySelector(".weather").innerText = description || "Unknown";
    weatherPart.querySelector(".location span").innerText = country ? `${city}, ${country}` : city;
    
    if (feels_like !== undefined) {
      // Check if feels_like is defined before using it
      weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    }

    if (humidity !== undefined) {
      // Check if humidity is defined before using it
      weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
    }

    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}



arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
