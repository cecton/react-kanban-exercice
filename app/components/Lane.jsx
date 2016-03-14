import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable.jsx';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const laneSource = {
  beginDrag(props) {
    return {id: props.id};
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  }
};

const laneTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(sourceId !== targetId) {
      targetProps.onMove({sourceId, targetId});
    }
  }
};

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(!targetProps.lane.notes.length) {
      LaneActions.attachToLane({
        laneId: targetProps.lane.id,
        noteId: sourceId
      });
    }
  }
};

@DragSource(ItemTypes.LANE, laneSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging() // map isDragging() state to isDragging prop
}))
@DropTarget(ItemTypes.LANE, laneTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectNoteDropTarget: connect.dropTarget()
}))
export default class Lane extends React.Component {
  render() {
    const {connectDragSource, connectDropTarget, connectNoteDropTarget,
      isDragging, lane, editing, onMove, ...props} = this.props;
    const dragSource = editing ? a => a : connectDragSource;

    return dragSource(connectDropTarget(connectNoteDropTarget(
      <div style={{opacity: isDragging ? 0 : 1 }} {...props}>
        <div className="lane-header">
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
          <Editable className="lane-name" editing={lane.editing}
            id={lane.id}
            value={lane.name} onEdit={this.editName}
            onValueClick={this.activateLaneEdit}
            onDelete={this.deleteLane} />
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.getNotesByIds(lane.notes)
          }}
        >
          <Notes
            onValueClick={this.activateNoteEdit}
            onEdit={this.editNote}
            onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    )));
  }
  editNote(id, task) {
    // Don't modify if trying set an empty value
    if(!task.trim()) {
      NoteActions.update({id, editing: false});

      return;
    }

    NoteActions.update({id, task, editing: false});
  }
  addNote = () => {
    const laneId = this.props.lane.id;
    const note = NoteActions.create({
        task: 'New task',
        editing: true
      });

    LaneActions.attachToLane({
      noteId: note.id,
      laneId
    });
  };
  deleteNote = (noteId) => {
    const laneId = this.props.lane.id;

    LaneActions.detachFromLane({laneId, noteId});
    NoteActions.delete(noteId);
  };
  editName = (id, name) => {
    // Don't modify if trying set an empty value
    if(!name.trim()) {
      LaneActions.update({id, editing: false});

      return;
    }

    LaneActions.update({id, name, editing: false});
  };
  deleteLane(id) {
    LaneActions.delete(id);
  }
  activateLaneEdit(id) {
    LaneActions.update({id, editing: true});
  }
  activateNoteEdit(id) {
    NoteActions.update({id, editing: true});
  }
}
