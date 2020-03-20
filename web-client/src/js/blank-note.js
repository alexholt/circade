import React, {useState} from 'react';

export default function ({onClick, className}) {

  return (
    <div
      onClick={onClick}
      className={
        `${className} notepad__hidable-container notepad--item-container notepad--item-container__blank`
      }
    >
      <button className='notepad--type-button'>
        <img
          alt="New Note"
          title="New Note"
          src="/img/note-types/new.svg"
        />
      </button>

      <textarea className='notepad--item notepad--item__blank'/>

      <button className='notepad--type-button notepad--type-button__blank'>
        <img
          alt="Delete the note"
          title="Delete Note"
          src="/img/close.svg"
        />
      </button>
    </div>
  );
}
