import React from 'react';
import { Form } from 'react-bootstrap';

const CodeItem = ({number}) => {
    return (
        <Form.Group key={number}>
            <Form.Label>{`deck ${number + 1}`}</Form.Label>
            <Form.Control />
        </Form.Group>
    );
};

export default CodeItem;