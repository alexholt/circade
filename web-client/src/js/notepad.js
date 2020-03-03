import React from 'react';
import Note from './note';

export default function ({notes, title, onNoteUpdate}) {

  return (
    <div className='notepad'>
      <h1 className='notepad--title'>{title}</h1>
      {notes.map(props => <Note key={props.id} onNoteUpdate={onNoteUpdate} {...props}/>)}

    </div>
  );

}
