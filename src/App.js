import React, { useEffect, useState } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar ,NavDropdown,Form,Nav,FormControl,Button} from 'react-bootstrap'

import Movie from './components/Movie'

let apiKey = process.env.REACT_APP_APIKEY;
let keyword = ``
let movieList= [];


function App() {

  let [movies, setMovies] = useState(null);
  const [genres, setGenres] = useState([]);


  let currentPlaying = async () => {
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
    let data = await fetch(url);
    let result = await data.json();
    

    movieList= result.results;
    // manipulate the movies (merge genreID with genre Name) before setState 

    // this following code is to iterate over the movies list and then for each movie, we will iterate over the genre_ids array and find the corresponding genre name
    // JS will try to run 1 ms for each line of code

    movieList.map(movie => { 
      movie.genres = movie.genre_ids.map(genre => genres.find(el=>el.id === genre))
    })

    setMovies(movieList);
    // it would slow down alot because if you fetch another page (e.g page 2) you will fetch the genre list again.

  }

  const fetchGenres = async () => {
    let secondUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
    let secondData = await fetch(secondUrl);
    let secondResult = await secondData.json();
    setGenres(secondResult.genres) // will change genres value
  }


  useEffect(()=> {
    fetchGenres(); 
  }, []); // run once after mounted , mounted is different from re-rendered

  // componentDidUpdate(previous, current){
  //   if(previous.genres !== current.genres) {
  //     currentPlaying();
  //   }
  // }

  useEffect(()=> {
    currentPlaying();
    // my problem right now is that setGenres hasn't finished running, that's why genres list empty
  }, [genres]); // put genres inside the array here meaning: hey, if genres is changed, then execute the  currentPlaying();
  
  
  console.log(movies)



  if (movies == null) {
    return (
      <div>
        loading the movie
      </div>
    )
  }
  let searchByKeyword = (e) =>{
    keyword=e.target.value;
    if (keyword === '' ){
      setMovies(movieList)
    }else{
      setMovies(movies.filter((movie)=>movie.title.toLowerCase().includes(keyword.toLocaleLowerCase())));
    } 
    console.log ("")
  
  }
  let sortByPopularity = () => {
    let sortedMovie = [...movies].sort((a, b) => b.popularity - a.popularity);
    setMovies(sortedMovie);
  };
  
// 2 options: 
// 1: WHen you render the genreID, you use a function to return the corresponding name for that ID : it's slow (run slow)
// 2: Manipulate the array movies first (right after you fetch from API). (it's faster, much faster) movies = [{title:"dsadasdas", genres:[{id:28, name:"Action"},{},{}]}, {},{}]
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={(e)=> {searchByKeyword(e)}} />
            <Button onClick={()=>searchByKeyword()} variant="outline-success">Search</Button>
          </Form>
          <Button onClick={()=>sortByPopularity ()} variant="outline-success">Most Popular</Button>
        </Navbar.Collapse>
      </Navbar>
      <Movie movieList={movies}  genres = {genres} />
    </div>
  );
}

export default App;

