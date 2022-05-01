import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { addCardsById, updateCardsById } from '../http/adminAPI';

const Admin = () => {
    const [addValue, setAddValue] = useState('')
    const [updateValue, setUpdateValue] = useState('')

    const addCards = () => {
        const cardsId = addValue.split(' ')
        addCardsById(cardsId).then(alert('Done!'))
    }

    const updateCards = () => {
        const cardsId = updateValue.split(' ')
        updateCardsById(cardsId).then(alert('Done!'))
    }

    return (
        <div className='p-3'>
            <Form.Group className="mb-3" >
                <Form.Label>ADD</Form.Label>
                <Form.Control
                    value={addValue}
                    onChange={e => setAddValue(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" className="mb-3" onClick={addCards}>
                Add
            </Button>
            <Form.Group className="mb-3" >
                <Form.Label>UPDATE</Form.Label>
                <Form.Control
                    value={updateValue}
                    onChange={e => setUpdateValue(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" onClick={updateCards}>
                Update
            </Button>
        </div>
    );
};

export default Admin;