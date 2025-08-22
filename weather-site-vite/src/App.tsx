import "./App.css";
import { useState } from "react";

function convertTemp(temp: string) {
  let calculatedTemp = ((Number(temp) - 273.15) * 9) / 5 + 32;
  return Math.round(calculatedTemp * 10) / 10; //left shift the digit after the decimal and remove the rest of the digits
}

function Image(code: { [key: string]: any }) {
  const iconCode = code["0"]?.icon;
  if (!iconCode) return null;

  const url = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  return (
    <div>
      <img
        src={url}
        alt="Weather Icon"
      />
    </div>
  );
}

function Display(weather: { [key: string]: any }) {
  console.log(weather);
  return (
    <>
      {Object.keys(weather).map((data, index) => (
        <div
          key={index}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center shadow-sm"
        >
          <span className="text-sm text-blue-500 font-medium mb-2 uppercase">
            {data}
          </span>
          <span className="text-lg">
            {index <= 3 ? convertTemp(weather[data]) + "°F" : weather[data]}
          </span>
        </div>
      ))}
    </>
  );
}

function Form() {
  const [name, setName] = useState("");
  const [fetched, setFetched] = useState(false);
  const [weather, setWeather] = useState({});
  const [condition, setCondition] = useState({});
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const params = new URLSearchParams();
    params.append("location", name);

    try {
      setFetched(false);
      setError(null);
      const response = await fetch(
        `https://weather-site-t2cg.onrender.com/?${params.toString()}`
      );
      const data = await response.json();
      if (response.ok) {
        setFetched(true);
        setCondition(data.weather);
        setWeather(data.main);
        setLocation(data.name);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setFetched(true);
        setError(error.message);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8 mt-6">
      <form
        className="flex flex-row gap-3 items-center mb-6 justify-center"
        method="get"
        onSubmit={handleSubmit}
      >
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          name="location"
          id="location"
          size={30}
          placeholder="Enter a location here"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded shadow"
        >
          Submit
        </button>
      </form>
      {fetched && error ? (
        <div className="flex w-full justify-center">{error}</div>
      ) : fetched ? (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="row-span-2 col-span-2 border bg-blue-200 border-blue-200 rounded-lg p-4 box-shadow">
              <div className="flex justify-center w-full">
                <Image {...condition} />
              </div>
              <div className="w-full flex flex-col items-center">
                <div className="flex flex-col items-center gap-2 mb-2">
                  <span className=" text-blue-900 uppercase">
                    Weather Type:
                  </span>
                  <span className=" text-blue-700">
                    {condition["0" as keyof typeof condition]["main"]}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 mb-2">
                  <span className="text-blue-900 uppercase">
                    Description:
                  </span>
                  <span className="text-blue-700">
                    {condition["0" as keyof typeof condition]["description"]}
                  </span>
                </div>
              </div>
            </div>
            <Display {...weather}></Display>
          </div>
          <p className="flex justify-center pt-5 text-center text-gray-400 italic">
            Fetched Data From: {location}
          </p>
        </div>
      ) : (
        <div className="text-center text-gray-400 italic">
          Enter a location and submit to see weather data.
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl text-blue-500 mt-10 text-center font-roboto tracking-tight">
          Weather App
        </h1>
        <Form />
      </div>
    </div>
  );
}

export default App;
