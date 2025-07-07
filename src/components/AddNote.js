import React from 'react'
import noteContext from '../context/notes/noteContext';
import { useContext, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const AddNote  = ({ showAlert }) => {
  const [warning, setWarning] = useState("");

  const context = useContext(noteContext);
  const { notes, addNote } = context;
  const [note, setNote] = useState({title: "", description: "", tag: "personal"});

  const handleClick = (e) => {
    e.preventDefault();
    if (note.title.length < 3 || note.description.length < 5) {
      setWarning("Title must be at least 3 characters and description at least 5 characters.");
      if (showAlert) showAlert("Title must be at least 3 characters and description at least 5 characters.");
      return;
    }
    setWarning("");
    addNote(note.title, note.description, note.tag);
    setNote({title: "", description: "", tag: "personal"});
    if (showAlert) showAlert("Note added successfully!");
  }

  const onChange = (e) => {
    setNote({...note, [e.target.name]: e.target.value});
  }

  return (
    <div>
      <div className="max-w-2xl w-full mx-auto bg-[#23243a] rounded-2xl shadow-2xl p-12 mt-12 border border-[#23243a] transition-shadow duration-200 hover:shadow-3xl flex flex-col items-center">
        <h1 className="text-white font-bold text-3xl mb-6 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#ff5c35] text-white mr-2 text-2xl">
            <FaPlus />
          </span>
          Add a note
        </h1>

        {warning && (
          <div className="bg-[#ff5c35] text-white rounded-lg px-4 py-2 mb-4 flex items-center" role="alert">
            {warning}
          </div>
        )}

        <form className="w-full">
          <div className="mb-3 my-3">
            <label htmlFor="title" className="block text-white font-semibold mb-2 text-lg">Title</label>
            <input type="text" className="bg-white text-[#191A23] rounded-lg px-4 py-2 w-full mb-4 border border-[#23243a] focus:border-[#ff5c35] focus:outline-none focus:ring-2 focus:ring-[#ff5c35] text-base" id="title" aria-describedby="titlehelp" name="title" value={note.title} onChange={onChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="block text-white font-semibold mb-2 text-lg">Description</label>
            <textarea className="bg-white text-[#191A23] rounded-lg px-4 py-2 w-full mb-4 border border-[#23243a] focus:border-[#ff5c35] focus:outline-none focus:ring-2 focus:ring-[#ff5c35] text-base" id="description" name="description" value={note.description} onChange={onChange} rows={2} />
          </div>

          <div className="mb-3">
            <label htmlFor="tag" className="block text-white font-semibold mb-2 text-lg">Tag</label>
            <select className="bg-white text-[#191A23] rounded-lg px-4 py-2 w-full mb-4 border border-[#23243a] focus:border-[#ff5c35] focus:outline-none focus:ring-2 focus:ring-[#ff5c35] text-base" id="tag" name="tag" value={note.tag} onChange={onChange}>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="todo">todo</option>
            </select>
          </div>

          <button type="submit" className="bg-[#ff5c35] text-white rounded-lg px-8 py-3 font-semibold shadow hover:bg-[#ff784e] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff5c35] active:scale-95 text-lg w-full mt-4" onClick={handleClick}>
            <span className="inline-flex items-center gap-2"><FaPlus /> Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNote;
