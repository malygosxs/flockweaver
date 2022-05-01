import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const Admin = () => {
    const [addValue, setAddValue] = useState('')
    const [updateValue, setUpdateValue] = useState('')

    return (
        <div className='p-3'>
            <Form>
                <Form.Group className="mb-3" >
                    <Form.Label>ADD</Form.Label>
                    <Form.Control 
                    value={addValue}
                    onChange={e => setAddValue(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" className="mb-3">
                    Add
                </Button>
            </Form>
            <Form>
                <Form.Group className="mb-3" >
                    <Form.Label>UPDATE</Form.Label>
                    <Form.Control 
                    value={updateValue}
                    onChange={e => setUpdateValue(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary">
                    Update
                </Button>
            </Form>
        </div>
    );
};

export default Admin;