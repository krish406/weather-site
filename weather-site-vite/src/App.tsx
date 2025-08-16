import "./App.css";
import { useState } from "react";

function convertTemp(temp: string) {
  let calculatedTemp = ((Number(temp) - 273.15) * 9) / 5 + 32;
  return Math.round(calculatedTemp * 10) / 10; //left shift the digit after the decimal and remove the rest of the digits
}

function Display(weather : {[key: string]: any}){
  console.log(weather)
  return <>
    {Object.keys(weather).map((data, index) => (
      <div
        key={index}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center shadow-sm"
      >
        <span className="text-sm text-blue-500 font-medium mb-2 uppercase">
          {data}
        </span>
        <span className="text-lg">
          {index <= 3
            ? convertTemp(weather[data]) + "°F"
            : weather[data]}
        </span>
      </div>
    ))}
  </>
}

function Form() {
  const [name, setName] = useState("");
  const [fetched, setFetched] = useState(false);
  const [weather, setWeather] = useState({});
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const params = new URLSearchParams();
    params.append("location", name);

    try {
      setFetched(false);
      const response = await fetch(
        `http://localhost:8080/?${params.toString()}`
      );
      const data = await response.json();
      if (response.ok) {
        setFetched(true);
        setWeather(data.main);
      }
      else{
        throw new Error(response.statusText)
      }
    } catch (error) {
      if (error instanceof Error) {
        setFetched(true)
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {fetched && error ? (
          <div>{error}</div>
        ) : fetched ? (
          <Display {...weather}></Display>
        ) : (
          <div className="col-span-4 text-center text-gray-400 italic">
            Enter a location and submit to see weather data.
          </div>)}
      </div>
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
