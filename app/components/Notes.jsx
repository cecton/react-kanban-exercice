import React from 'react';
import Editable from './Editable.jsx';
import Note from './Note.jsx';
import LaneActions from '../actions/LaneActions.js';

export default ({notes, onValueClick, onEdit, onDelete}) => {
  return (
    <ul className="notes">{notes.map(note =>
      <Note className="note" id={note.id} key={note.id}
          editing={note.editing} onMove={LaneActions.move}>
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
