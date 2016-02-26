import React from 'react';
import Note from './Note.jsx';

export default ({notes, onEdit, onDelete}) => {
  return (
    <ul>{notes.map(note =>
      <li key={note.id}>
        <Note id={note.id}
          task={note.task}
          onEdit={onEdit}
          onDelete={onDelete} />
      </li>
    )}</ul>
  );
};
