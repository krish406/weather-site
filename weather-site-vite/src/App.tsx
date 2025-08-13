import "./App.css";
import { useState } from "react";

function convertTemp(temp: string) {
  let calculatedTemp = ((Number(temp) - 273.15) * 9) / 5 + 32;
  console.log(calculatedTemp)
  return calculatedTemp;
}

function Form() {
  const [name, setName] = useState("");
  const [fetched, setFetched] = useState(false);
  const [weather, setWeather] = useState({});

  const fetchData = async () => {
    const params = new URLSearchParams();
    params.append("location", name);
    console.log(params.get("location"));

    try {
      setFetched(false);
      const response = await fetch(
        `http://localhost:8080/?${params.toString()}`
      );
      const data = await response.json();
      if (data) {
        setFetched(true);
        console.log(data);
        setWeather(data.main);
        console.log(weather);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <>
      <form
        className="flex flex-row gap-2 items-center"
        method="get"
        onSubmit={handleSubmit}
      >
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          name="location"
          id="location"
          size={50}
          placeholder="Enter a location here"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 border border-blue-700 rounded"
        >
          Submit
        </button>
      </form>
      <div className="grid grid-cols-4 grid-rows-2 gap-2">
        {fetched
          ? Object.keys(weather).map((data, index) => {
              if(index <= 3){
                return <div key={index} className="grid col-span-2">
                  {data} : {convertTemp(weather[data as keyof typeof weather])}
                </div>
              }
              else{
                return (
                  <div key={index} className="grid col-span-2">
                    {data} : {weather[data as keyof typeof weather]}
                  </div>
                );
              }
            })
          : null}
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <div className="flex flex-col m-5 justify-center items-center">
        <p className="text-center m-2">Weather App</p>
        <Form></Form>
      </div>
    </>
  );
}

export default App;
