import React from 'react';
import Note from './note';
import BlankNote from './blank-note';
import CheckPretty from './check-pretty';
import last from 'lodash/last';

export default function ({isLoading, notes, title, onNoteUpdate, onNoteDelete, onNoteAdd}) {

  const blankNoteClass = (notes.length == 0 || last(notes).id != null) ?
    '' :
    'notepad--hidden';

  let i = 0;
  notes.forEach(note => note.key = i++);

  let inner = (
    <>
      {isLoading ? <CheckPretty isHidden={!isLoading}/> : null}

      <div className={`notepad__hidable-container ${isLoading ? 'notepad--hidden' : ''}`}>
        {
          notes.map(note =>
            <Note
              key={note.key}
              onNoteUpdate={onNoteUpdate}
              onNoteDelete={onNoteDelete}
              note={note}
            />
          )
        }

        <BlankNote onClick={onNoteAdd} className={blankNoteClass}/>
      </div>
    </>
  );

  return (
    <div className='notepad'>
      <h1 className='notepad--title'>{title}</h1>
      {inner}
    </div>
  );

}

function loading(isLoading) {
  return (
    <object
      className={`notepad--loading ${isLoading ? '' : 'notepad--hidden'}`}
      type="image/svg+xml"
      data="/img/animated-check.svg"
    />
  );
}
