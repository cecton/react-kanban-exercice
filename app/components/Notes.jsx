import React from 'react';
import Editable from './Editable.jsx';

export default ({notes, onValueClick, onEdit, onDelete}) => {
  return (
    <ul className="notes">{notes.map(note =>
      <li className="note" key={note.id}>
        <Editable
          id={note.id}
          editing={note.editing}
          value={note.task}
          onValueClick={onValueClick}
          onEdit={onEdit}
          onDelete={onDelete} />
      </li>
    )}</ul>
  );
}
