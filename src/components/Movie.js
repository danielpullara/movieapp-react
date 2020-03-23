import React from "react";
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Movie(props) {

    const renderGenres = genres => {
        if (!genres.some(genres => genres === undefined)) {
            return genres.map(el => <span><a>{el.name}</a>, </span>)
        }
        return ""
    }


    let htmlMovie = props.movieList.map((movie) => {
    let descriptionLength = (movie.overview.split('.')[0]);


        return (
                <Card id="transparant" border="light" className="col-md-3">
                    <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}`} />
                    <Card.Body>
                        <Card.Title style={{ color: 'blue' }} >{movie.title}</Card.Title>
                        <Card.Text style={{ color: '#343A40' }} >
                            {descriptionLength}
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem style={{ color: '#343A40' }} >Rated {movie.vote_average}/10</ListGroupItem>
                        <ListGroupItem style={{ color: '#343A40' }} >{renderGenres(movie.genres)}</ListGroupItem>

                    </ListGroup>
                    <Card.Body>
                        <Card.Link onClick={(e) => props.onShowTrailer(e,movie.id)} style={{ color: 'blue' }} href="#">Watch Trailor</Card.Link>
                        <Card.Link style={{ color: 'blue' }} href="#">View More</Card.Link>
                    </Card.Body>
                </Card>
           
        )
    })

    return (
        <div className="row">
            {htmlMovie}
        </div>
    )
}

