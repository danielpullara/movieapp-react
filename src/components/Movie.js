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
    // const renderTest = genre_ids => {
    //     console.log(props.genres)
    //     return 1
    //     // return genre_ids.map(genre => props.genres.find(el=>{
    //     //     if(el.id === genre) 
    //     //     return el.name
    //     // }))
    // }

    let htmlMovie = props.movieList.map((movie) => {
        let descriptionLength = (movie.overview.split('.')[0]);
        return (
            <Card className="col-md-4" style={{ width: "18rem" }}>
                <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}`} />
                <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text>
                        {descriptionLength}
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>{movie.vote_average}/10</ListGroupItem>
                    <ListGroupItem>{renderGenres(movie.genres)}</ListGroupItem>
                </ListGroup>
                <Card.Body>
                    <Card.Link href="#">Card Link</Card.Link>
                    <Card.Link href="#">Another Link</Card.Link>
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

