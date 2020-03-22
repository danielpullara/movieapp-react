import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import { Button, ButtonGroup} from 'react-bootstrap'

const FooterPage = () => {
    return (
        <div>
            <footer>              
                        <ButtonToolbar style={{ justifyContent: 'center', alignItems: 'center'}} aria-label="Toolbar with button groups">
                            <ButtonGroup className="mr-2" aria-label="First group">
                                <Button>1</Button> <Button>2</Button> <Button>3</Button> <Button>4</Button>
                            </ButtonGroup>
                            <ButtonGroup className="mr-2" aria-label="Second group">
                                <Button>5</Button> <Button>6</Button> <Button>7</Button>
                            </ButtonGroup>
                            <ButtonGroup aria-label="Third group">
                                <Button>8</Button>
                            </ButtonGroup>
                        </ButtonToolbar> 
                        <Button style={{ marginRight: '10px' }} onClick={() => loadMore()} variant="secondary">View More</Button>               
            </footer>
        </div>
    );
}

export default FooterPage;