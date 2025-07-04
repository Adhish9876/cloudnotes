import React from 'react'
import noteContext from '../context/notes/noteContext';
import { useContext, useState } from 'react';

const AddNote  = () => {
  const [warning, setWarning] = useState("");

  const context = useContext(noteContext);
  const { notes, addNote } = context;
  const [note, setNote] = useState({title: "", description: "", tag: "personal"});

  const handleClick = (e) => {
    e.preventDefault();
    if (note.title.length < 3 || note.description.length < 5) {
      setWarning("Title must be at least 3 characters and description at least 5 characters.");
      return;
    }
    setWarning("");
    addNote(note.title, note.description, note.tag);
    setNote({title: "", description: "", tag: "personal"});
  }

  const onChange = (e) => {
    setNote({...note, [e.target.name]: e.target.value});
  }

  return (
    <div>
      <div className="container">
        <h1>Add a note</h1>

        {warning && (
          <div className="alert alert-warning" role="alert">
            {warning}
          </div>
        )}

        <form>
          <div className="mb-3 my-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title" aria-describedby="titlehelp" name="title" value={note.title} onChange={onChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea className="form-control" id="description" name="description" value={note.description} onChange={onChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="tag" className="form-label">Tag</label>
            <select className="form-select" id="tag" name="tag" value={note.tag} onChange={onChange}>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="todo">todo</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" onClick={handleClick}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddNote;
