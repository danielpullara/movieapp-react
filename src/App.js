import React ,{useEffect,useState}from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Movie from './components/Movie'

let apiKey = process.env.REACT_APP_APIKEY;

function App() {

  let [movies,setMovies] = useState(null);
  let CurrentPlaying =async() =>{
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
    let data = await fetch(url); 
    let result = await data.json();
    console.log("apiKey",apiKey);
    console.log("Data we get",result);
    setMovies(result.results);
  } 

  useEffect(CurrentPlaying,[]);
  if(movies == null){
    return(
      <div>
        loading the movie 
      </div>
    )
  }
  return (
    <div>
      <Movie movieList = {movies}/>
    </div>
  ); 
}

export default App;
