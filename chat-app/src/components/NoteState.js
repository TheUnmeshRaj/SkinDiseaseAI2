import React,{useState} from 'react';
import NoteContext from './NoteContext';

const NoteState = (props) => {
    const [userId, setUserId] = useState('');
    return (
        <NoteContext.Provider value={{ userId, setUserId }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
