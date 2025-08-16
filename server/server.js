import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 8080;
const GeocodingAPIKey = "689a7c3ac6e06176779337jtu0b52ce";
const WeatherAPIKey = "b1774f5021deae419c5e02b4304e7a3d";

let corsOptions = {
  origin: "http://localhost:5173",
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.get("/", async (req, res) => {
  console.log("received request");
  const loc = req.query.location;

  if (!loc) {
    console.log("error");
    return res.status(404).send({ message: "Location was not entered" });
  }

  try {
    let url = `https://geocode.maps.co/search?q=${loc}&api_key=${GeocodingAPIKey}`;
    let response = await axios.get(url);
    console.log(response.data.length);
    console.log(response.data.length === 0);

    if (!response.data || response.data.length === 0) {
      return res.status(404).send({ message: "Could not find location" });
    }

    let latitude = response.data[0].lat;
    let longitude = response.data[0].lon;

    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WeatherAPIKey}`;
    response = await axios.get(url);
    
    if (!(response && response.status === 200 && response.statusText === 'OK')){
      return res.status(404).send({message: "Could not get weather"});
    }

    res.json({ weather: response.data.weather, main: response.data.main });

  } catch (error) {
    console.log(error.message);
    res.status(404).send({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
