import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CodeList from '../components/DeckViewForm/CodeList';
import DeckViewForm from '../components/DeckViewForm/DeckViewForm';

const DeckViewPreview = () => {

    const [searchParams] = useSearchParams();
    
    const isCount = searchParams.has('count')
    const params = Object.fromEntries([...searchParams])
    params.count = parseInt(params.count)

    if (!Number.isInteger(params.count)) {
        params.count = 3
    }
    if (!(params.count >= 1 && params.count <= 5)) {
        params.count = 3
    }

    return (
        <div>
            {isCount ?
                <CodeList {...params}/>
                :
                <DeckViewForm/>
            }
        </div>
    );
};

export default DeckViewPreview;