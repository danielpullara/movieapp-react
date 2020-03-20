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
  let CurrentPlaying = async () => {
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
    let data = await fetch(url);
    let result = await data.json();
    console.log("apiKey", apiKey);
    console.log("Data we get", result);
    movieList= result.results;
    setMovies(result.results);
  }

  useEffect(CurrentPlaying, []);
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
      <Movie movieList={movies} />
    </div>
  );
}

export default App;
