import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from 'react-bootstrap'
import './codeList.css'
import { createUuid, validateCodes } from "../../http/deckviewAPI";

function Codelist({ count = 3, lng = 'en', full = true }) {
    const [codes, setCodes] = useState([...Array(count)].fill(''))
    const [errors, setErrors] = useState([])
    const history = useNavigate()

    function handleChange(i, e) {
        const newCodes = [...codes];
        newCodes[i] = e.target.value;
        setCodes(newCodes)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const newErrors = await validateCodes(codes, lng)
        if (!newErrors.every(err => err === '')) {
            setErrors(newErrors)
            return
        }
        const newUrl = await createUuid(codes);
        //TODO: IMPORTANT: createUuid inside another function!!
        history(newUrl)
    }

    return (
        <Form className="d-flex flex-column postform" onSubmit={handleSubmit}>
            {
                [...Array(count)].map((item, index) =>
                    <Form.Group key={`group${index + 1}`} className='mb-3'>
                        <Form.Label>{`Deck ${index + 1}`}</Form.Label>
                        <Form.Control
                            required
                            value={codes[index]}
                            autoComplete={'off'}
                            onChange={(e) => handleChange(index, e)} />
                        {errors[index] && <span className="text-white">{errors[index]}</span>}
                    </Form.Group>
                )
            }
            <Button style={{ width: '155px' }} type="submit">{`View deck${count === 1 ? '' : 's'}`}</Button>
        </Form >
    );
}

export default Codelist