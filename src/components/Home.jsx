import React, {Component} from 'react';
import { Button, InputGroup, DropdownButton, Dropdown, FormControl, ListGroup, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { PassThrough } from 'stream';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
            activePage: 1,
            numPages: 5,
            searchTerm: ' '
        };
    }

    componentDidMount() {
        this.getItemsByKeyWord();
        this.getNumPages();
    }

    getItemsByKeyWord(page = 1) {
        axios.get('/getItemsByKeyWord', {
            params: {
                searchTerm: this.state.searchTerm,
                page: page
            }
        })
          .then((response) => {
              this.setState({events: response.data})
          })
          .catch((error) => console.log(error))
    }

    handleChange(page) {
        this.setState({
            activePage: page
        }, ()=> this.getItemsByKeyWord(page))
    }

    getNumPages() {
        axios.get('/numPages', {
            params: {
                searchTerm: this.state.searchTerm
            }
        })
          .then(({data}) => this.setState({numPages: Number(data)}));
    }

    termChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    render() {
        let numPages = Math.ceil(this.state.events.length / 2);
        let count = 1;
        let pagesArray = new Array(this.state.numPages).fill('x').map(space => count++);
        return (
            <div id='container'>
                <h1>Historic.ly</h1>
                <p>Welcome to historic.ly, a place to explore history. 
                    Search by keyword below:
                </p>
                <InputGroup className="mb-3">
                    <FormControl 
                    aria-describedby="basic-addon1"
                    id='searchField'
                    onChange={(event) => this.termChange(event)}
                    onKeyUp={(event) => {
                        (event.keyCode === 13) ? this.componentDidMount() : null
                    }}
                    />
                    <InputGroup.Append>
                        <Button variant="primary"
                                onClick={() => {
                                    this.getItemsByKeyWord()
                                    this.getNumPages()
                                    }}
                                >Search</Button>
                    </InputGroup.Append>
                </InputGroup>
                <ListGroup id='event_list'>
                    {
                        this.state.events.map(event => {
                            return <EventItem event={event} key={event._id}/>
                        })
                    }
                </ListGroup>
                <Pagination id='pagination'>
                    {
                        pagesArray.map(page => {
                            return (
                                <Pagination.Item 
                                key={page} 
                                active={this.state.activePage === page}
                                onClick={() => this.handleChange(page)}>{page}
                                </Pagination.Item>
                            )
                        })
                    }
                </Pagination>
            </div>
        )
    }
}

const EventItem = (props) => {
    let rawDescription = props.event.description;
    let cutIndices = [];
    cutIndices.push(rawDescription.indexOf('<'))
    cutIndices.push(rawDescription.indexOf('{'))
    cutIndices.push(rawDescription.indexOf('amp '))
    cutIndices.push(rawDescription.indexOf('.ampamp'))
    cutIndices.push(rawDescription.indexOf('ampref'))
    cutIndices.push(rawDescription.indexOf('ref '))
    let cutIndex = cutIndices.filter(index => index != -1).sort((a,b) => a - b)[0];
    let description = rawDescription.substring(0, cutIndex)
    let date = new Date(props.event.date)
    if(date.getFullYear() < 0 || date.getMilliseconds() === 0) {
        date = Math.abs(date.getFullYear()) + ' BC';
    } else {
        date = date.toDateString();
    }

    return (
        <ListGroup.Item className='event_container'>
            <p className='event_title'><strong>{date}</strong></p>
            <p>{description}</p>
        </ListGroup.Item>
    )
}

export default Home;