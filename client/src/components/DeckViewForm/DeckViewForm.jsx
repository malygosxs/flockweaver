import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';

const DeckViewForm = () => {

    const [ , setSearchParams] = useSearchParams({});
    const [count, setCount] = useState(4);
    // const [isFull, setIsFull] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSearchParams({count, lng: 'en'})
    }

    return (
        <Form className='d-flex flex-column p-4 preform' onSubmit={handleSubmit}>
            <Helmet>
                <title>Deckviewer</title>
                <meta name='description' content='View several skyweaver decks and share with others'></meta>
            </Helmet>
            <Form.Group className="mb-4">
                <Form.Label>Amount of decks (between 1 and 5)</Form.Label>
                <Form.Control type='number'
                    max={5} min={1}
                    required
                    value={count}
                    onChange={(e) => setCount(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label>Select language</Form.Label>
                <Form.Select>
                    <option>en</option>
                </Form.Select>
            </Form.Group>
            {/* <Form.Group className="mb-4">
                <Form.Check 
                type="checkbox" 
                label="full decks only" 
                defaultChecked="true"
                value={isFull}
                onChange={(e) => {setIsFull(e.target.value)}}
                 />
            </Form.Group> */}
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default DeckViewForm;