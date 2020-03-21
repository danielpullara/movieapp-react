import React, { useEffect, useState } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, NavDropdown, Form, Nav, FormControl, Button } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import bgimage from './background.jpg'
import Movie from './components/Movie'

let apiKey = process.env.REACT_APP_APIKEY;
let keyword = ``
let movieList = [];
let page = 1;


function App() {

  let [movies, setMovies] = useState(null);
  let [genres, setGenres] = useState([]);


  let currentPlaying = async () => {
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${page}`
    let data = await fetch(url);
    let result = await data.json();


    movieList = result.results;
    // manipulate the movies (merge genreID with genre Name) before setState 

    // this following code is to iterate over the movies list and then for each movie, we will iterate over the genre_ids array and find the corresponding genre name
    // JS will try to run 1 ms for each line of code

    movieList.map(movie => {
      movie.genres = movie.genre_ids.map(genre => genres.find(el => el.id === genre))
    })

    setMovies(movieList)
    // it would slow down alot because if you fetch another page (e.g page 2) you will fetch the genre list again.

  }

  let loadMore = () => {
    page = 1 + page;
    currentPlaying();
  };


  console.log("Movie List with Genre & ID", movieList);
  //Filter Movies by Genre
  let filteredMovies = (g) => {
    let genreId = g;
    if (genreId === null) {
      setMovies(movieList)
    } else {
      setMovies(movieList.filter((movie) => movie.genre_ids.includes(genreId)));
    }
  }


  const fetchGenres = async () => {
    let secondUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
    let secondData = await fetch(secondUrl);
    let secondResult = await secondData.json();
    setGenres(secondResult.genres) // will change genres value
  }


  useEffect(() => {
    fetchGenres();
  }, []); // run once after mounted , mounted is different from re-rendered

  // componentDidUpdate(previous, current){
  //   if(previous.genres !== current.genres) {
  //     currentPlaying();
  //   }
  // }

  useEffect(() => {
    currentPlaying();
    // my problem right now is that setGenres hasn't finished running, that's why genres list empty
  }, [genres]); // put genres inside the array here meaning: hey, if genres is changed, then execute the  currentPlaying();


  if (movies == null) {
    return (
      <div>
        loading the movie
      </div>
    )
  }
  let searchByKeyword = (e) => {
    keyword = e.target.value;
    if (keyword === '') {
      setMovies(movieList)
    } else {
      setMovies(movies.filter((movie) => movie.title.toLowerCase().includes(keyword.toLocaleLowerCase())));
    }
    console.log("")

  }
  let sortByPopularity = () => {
    let sortedMovie = [...movies].sort((a, b) => b.popularity - a.popularity);
    setMovies(sortedMovie);
  };

  let sortByLeastPopularity = () => {
    let sortedLeastMovie = [...movies].sort((a, b) => a.popularity - b.popularity);
    setMovies(sortedLeastMovie);
  };

  let sortByHighestRating = () => {
    let sortedHighestRating = [...movies].sort((a, b) => b.vote_average - a.vote_average);
    setMovies(sortedHighestRating);
  };




  // 2 options: 
  // 1: WHen you render the genreID, you use a function to return the corresponding name for that ID : it's slow (run slow)
  // 2: Manipulate the array movies first (right after you fetch from API). (it's faster, much faster) movies = [{title:"dsadasdas", genres:[{id:28, name:"Action"},{},{}]}, {},{}]
  return (
    <div>
      <Navbar sticky="top" bg="dark" expand="lg">
        <Navbar.Brand href="">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">           
            <NavDropdown title="Genres" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => filteredMovies(12)} href="#action/3.2">Adventure</NavDropdown.Item>
              <NavDropdown.Item onClick={() => filteredMovies(35)} href="#action/3.1">Comedy</NavDropdown.Item>
              <NavDropdown.Item onClick={() => filteredMovies(80)} href="#action/3.2">Crime</NavDropdown.Item>
              <NavDropdown.Item onClick={() => filteredMovies(99)} href="#action/3.3">Documentary</NavDropdown.Item>
              <NavDropdown.Item onClick={() => filteredMovies(18)} href="#action/3.2">Drama</NavDropdown.Item>
              <NavDropdown.Item onClick={() => filteredMovies(36)} href="#action/3.2">Fantasy</NavDropdown.Item>
              <NavDropdown.Item onClick={() => filteredMovies(36)} href="#action/3.2">History</NavDropdown.Item>
              <NavDropdown.Item onClick={() => filteredMovies(27)} href="#action/3.2">Horror</NavDropdown.Item>
              <NavDropdown.Item onClick={() => filteredMovies(10749)} href="#action/3.2">Romance</NavDropdown.Item>
              <NavDropdown.Item onClick={() => filteredMovies(878)} href="#action/3.2">Science Fiction</NavDropdown.Item>
              <NavDropdown.Item onClick={() => filteredMovies(53)} href="#action/3.2">Thriller</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>          
          </Form>
          <Button onClick={() => sortByPopularity()} variant="outline-success">Most Popular</Button>
          <Button onClick={() => sortByLeastPopularity()} variant="outline-success">Least Popular</Button>
          <Button onClick={() => sortByHighestRating()} variant="outline-success">Top Rated</Button>
          <Button onClick={() => loadMore()} variant="outline-success">See More</Button>
        </Navbar.Collapse>
      </Navbar>
      <Jumbotron style={{ backgroundImage: `url(${bgimage})`, backgroundSize: 'cover' }}>
        <Container>
          <h1 class="TextColor">Unlimited movies, TV shows, and more.</h1>
          <Row>
          <FormControl fluid type="text" placeholder="Search" className="mr-sm-2 col-md-6"  onChange={(e) => { searchByKeyword(e) }}/>
          <Button onClick={() => searchByKeyword()} className="mr-sm-2 col-md-2" variant="danger">Search</Button>         
          </Row>         
        </Container>
      </Jumbotron>
      <Movie movieList={movies} genres={genres} />
    </div>
  );
}

export default App;

