import React from 'react';
import Editable from './Editable.jsx';
import Note from './Note.jsx';

export default ({notes, onValueClick, onEdit, onDelete}) => {
  return (
    <ul className="notes">{notes.map(note =>
      <Note className="note" id={note.id} key={note.id}>
        <Editable
          id={note.id}
          editing={note.editing}
          value={note.task}
          onValueClick={onValueClick}
          onEdit={onEdit}
          onDelete={onDelete} />
      </Note>
    )}</ul>
  );
}
