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
      <div className="max-w-xl w-full mx-auto bg-[#23243a] rounded-2xl shadow-lg p-8 mt-8">
        <h1 className="text-white font-bold text-2xl mb-4">Add a note</h1>

        {warning && (
          <div className="bg-[#ff5c35] text-white rounded-lg px-4 py-2 mb-4 flex items-center" role="alert">
            {warning}
          </div>
        )}

        <form>
          <div className="mb-3 my-3">
            <label htmlFor="title" className="block text-white font-semibold mb-2">Title</label>
            <input type="text" className="bg-white text-[#191A23] rounded-lg px-4 py-2 w-full mb-4 border border-[#23243a] focus:border-[#ff5c35] focus:outline-none" id="title" aria-describedby="titlehelp" name="title" value={note.title} onChange={onChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="block text-white font-semibold mb-2">Description</label>
            <textarea className="bg-white text-[#191A23] rounded-lg px-4 py-2 w-full mb-4 border border-[#23243a] focus:border-[#ff5c35] focus:outline-none" id="description" name="description" value={note.description} onChange={onChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="tag" className="block text-white font-semibold mb-2">Tag</label>
            <select className="bg-white text-[#191A23] rounded-lg px-4 py-2 w-full mb-4 border border-[#23243a] focus:border-[#ff5c35] focus:outline-none" id="tag" name="tag" value={note.tag} onChange={onChange}>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="todo">todo</option>
            </select>
          </div>

          <button type="submit" className="bg-[#ff5c35] text-white rounded-lg px-6 py-2 font-semibold shadow hover:bg-[#ff784e] transition-colors duration-200" onClick={handleClick}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddNote;
