import React, { useEffect, useState } from "react";
import './App.css';
import { Navbar, NavDropdown, Form, Nav, } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormControl, Button, } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import bgimage from './background.jpg'
import Movie from './components/Movie'
import Slider from './components/Slider'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import logo from './netflix.png'
import ReactModal from 'react-modal';
import YouTube from '@u-wave/react-youtube';
// import Pagination from "react-js-pagination";

let apiKey = process.env.REACT_APP_APIKEY;
let keyword = ``
let movieList = [];
let page = 1;


function App() {

  let [movies, setMovies] = useState(null);
  let [genres, setGenres] = useState([]);
  let [modal, setModal] = useState(false)
  let [trailer, setTrailer] = useState('')
  // let [pageNumber, setPageNumber] = useState(1)

  let currentPlaying = async () => {
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${page}`
    let data = await fetch(url);
    let result = await data.json();
    console.log('currentplaying run')

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
  console.log("page number", page)

  let goBack = () => {
    if (page === 1) {
      page = 1;
    } else {
      page = page - 1;
      currentPlaying();
    }
  };

  console.log("Movie List with Genre & ID", movieList);

  // Filter Movies by Genre
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


  let onShowTrailer = async (e, movieId) => {
    e.preventDefault()
    console.log('movieId:', movieId)
    let url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`
    let data = await fetch(url)
    let respones = await data.json()
    console.log(respones.results)
    setModal(true)
    if (respones.results.length > 0) {
      setTrailer(respones.results[0].key)
    }
  }

  let onFilterRating = (inputValue) => {
    console.log(inputValue)
    setMovies(movieList.filter(movie => movie.vote_average >= inputValue.min && movie.vote_average <= inputValue.max))
  }

  // let handlePageChange = async (pageNumber) => {
  //   console.log('pageNum:', pageNumber)
  //   setPageNumber(pageNumber)
  //   let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${pageNumber}`
  //   let data = await fetch(url);
  //   let result = await data.json();
  //   console.log('currentplaying run')

  //   setMovies(result.results);

  // }




  // 2 options: 
  // 1: WHen you render the genreID, you use a function to return the corresponding name for that ID : it's slow (run slow)
  // 2: Manipulate the array movies first (right after you fetch from API). (it's faster, much faster) movies = [{title:"dsadasdas", genres:[{id:28, name:"Action"},{},{}]}, {},{}]
  return (
    <div id="main" >
      <Navbar sticky="top" variant="dark" bg="dark" >
        <Navbar.Brand><img src={logo} width="90px" ></img></Navbar.Brand>
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
          <Button style={{ marginRight: '10px' }} onClick={() => sortByPopularity()} variant="secondary" >Most Popular</Button>
          <Button style={{ marginRight: '10px' }} onClick={() => sortByLeastPopularity()} variant="secondary">Least Popular</Button>
          <Button style={{ marginRight: '10px' }} onClick={() => sortByHighestRating()} variant="secondary" >Top Rated</Button>
        </Navbar.Collapse>
      </Navbar>
      <Jumbotron style={{ backgroundImage: `url(${bgimage})`, backgroundSize: 'cover' }}>
        <Container>
          <h1 class="TextColor">Unlimited movies, TV shows, and more.</h1>
          <Row>
            <FormControl fluid type="text" placeholder="Search" className="mr-sm-2 col-md-6" onChange={(e) => searchByKeyword(e)} />
            <Button onClick={(e) => searchByKeyword(e)} className="mr-sm-2 col-md-2" variant="danger">Search</Button>
          </Row>
        </Container>
      </Jumbotron>
      <div className="d-flex justify-content-center">
        <Slider onFilterRating={onFilterRating} />
      </div>
      <Movie movieList={movies} genres={genres} onShowTrailer={onShowTrailer} />
      <ReactModal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={{ overlay: { display: "flex", justifyContent: "center" }, content: { width: "70%", height: "70%", position: "relative" } }}
      >
        <YouTube className="w-100 h-100"
          video={trailer}
          autoplay
        />
      </ReactModal>

      <footer>
        <ButtonToolbar style={{ justifyContent: 'center', alignItems: 'center' }} aria-label="Toolbar with button groups">
          <Button style={{ marginRight: '10px' }} onClick={() => goBack()} variant="secondary">Go Back</Button>
          {/* <ButtonGroup className="mr-2" aria-label="First group">
            <Button variant="secondary">1</Button> <Button variant="secondary">2</Button> <Button variant="secondary">3</Button> <Button variant="secondary" >4</Button>            
          </ButtonGroup> */}
          <Button style={{ marginLeft: '2px' }} onClick={() => loadMore()} variant="secondary">View More</Button>
        </ButtonToolbar>
        {/* <div>
          <Pagination
            activePage={pageNumber}
            itemClass="page-item"
            linkClass="page-link"
            itemsCountPerPage={20}
            totalItemsCount={450}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </div> */}
      </footer>
    </div>
  );
}

export default App;

