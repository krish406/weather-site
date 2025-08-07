import './App.css'

function Form(){
  return (
    <>
      <form className='flex flex-row gap-2'>
        <input type="text" name="location" id="location" size = {50} placeholder='Enter a location here'/>
        <button type = "submit" className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 border border-blue-700 rounded'>Submit</button>
      </form>
    </>
  )
}

function App() {
  return (
    <>
      <div className = "flex flex-col m-5 justify-center items-center">
        <p className='text-center m-2'>Weather App</p>
        <Form></Form>
      </div>
    </>
  )
}

export default App
