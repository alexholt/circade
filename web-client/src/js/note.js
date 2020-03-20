import React, {useState, useEffect} from 'react';

import startCase from 'lodash/startCase';

const types = [
  'event',
  'task',
  'completed-task',
  'flag',
];

export default function ({note, onNoteUpdate, onNoteDelete}) {

  const [ref, setRef] = useState(null);

  const onChange = function (event) {
    note.entry = event.target.value;
    onNoteUpdate(note);
    note.callback = function () {this.focus()};
  };

  const onRef = function (r) {
    if (r) setRef(r);

    if (!ref) return;

    ref.style.height = '';
    ref.style.height = `${ref.scrollHeight}px`;

    if (note.callback) {
      note.callback.call(ref);
      delete note.callback;
    }
  };

  useEffect(() => {
  });

  const onClick = function (event) {
    const newType = types[(types.indexOf(note.type) + 1) % 4];
    note.type = newType;
    onNoteUpdate(note);
  };

  const deleteNote = function (event) {
    onNoteDelete(note);
  };

  const capitalizedType = startCase(note.type.replace(/-/g, ' '));

  return (
    <div className='notepad--item-container'>

      <button onClick={onClick} className='notepad--type-button'>
        <img
          alt={`${capitalizedType}`}
          title={`${capitalizedType}`}
          src={`/img/note-types/${note.type}.svg`}
        />
      </button>

      <textarea
        ref={onRef} className='notepad--item' value={note.entry} onChange={onChange}
      />

      <button onClick={deleteNote} className='notepad--type-button'>
        <img
          alt="Delete the note"
          title="Delete Note"
          src="/img/close.svg"
        />
      </button>

    </div>
  );
}
