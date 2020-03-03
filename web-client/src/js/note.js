import React, {useState} from 'react';

const types = [
  'event',
  'task',
  'completed-task',
  'flag',
];

export default function ({type, content, id, onNoteUpdate}) {

  const [ref, setRef] = useState(null);

  const onChange = function (event) {
    onNoteUpdate({content: event.target.value, id, type});
  };

  const onRef = function (r) {
    if (r) {
      setRef(r);
    }

    if (ref) {
      ref.style.height = '';
      ref.style.height = `${ref.scrollHeight}px`;
    }
  };

  const onClick = function (event) {
    const newType = types[(types.indexOf(type) + 1) % 4];
    onNoteUpdate({content, id, type: newType});
  };

  return (
    <div className='notepad--item-container'>
      <button onClick={onClick} className='notepad--type-button'>
        <img src={`/img/note-types/${type}.svg`}/>
      </button>
      <textarea ref={onRef} className='notepad--item' value={content} onChange={onChange}/>
    </div>
  );
}
