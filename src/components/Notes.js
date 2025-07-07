import noteContext from '../context/notes/noteContext';
import { useContext, useEffect, useState } from 'react';
import Noteitem from './Noteitem';
import AddNote from './AddNote';

export default function Notes() {
  const context = useContext(noteContext);
  const { notes, getNote, editNote } = context;

  useEffect(() => {
    getNote();
  }, []);

  // Edit modal state
  const [show, setShow] = useState(false);
  const [currentNote, setCurrentNote] = useState({ title: "", description: "", tag: "", _id: "" });
  const [warning, setWarning] = useState("");

  // Open/close handlers for Edit modal
  const openModal = (note) => {
    setCurrentNote(note);
    setShow(true);
  };
  const closeModal = () => {
    setShow(false);
    setWarning("");
  };

  const onChange = (e) => {
    setCurrentNote({ ...currentNote, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentNote.title.length < 3 || currentNote.description.length < 5) {
      setWarning("Title must be at least 3 characters and description at least 5 characters.");
      return;
    }
    setWarning("");
    editNote(currentNote._id, currentNote.title, currentNote.description, currentNote.tag);
    closeModal();
  };

  return (
    <div className="w-full min-h-screen bg-[#191A23] py-8 px-2 md:px-0">
      {/* Edit Note Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#23243a] rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-[#23243a] relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-white hover:text-[#ff5c35] text-xl"
              onClick={closeModal}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <i className="fas fa-edit text-[#ff5c35]"></i> Edit Note
            </h3>
            {warning && (
              <div className="bg-[#ff5c35]/20 border border-[#ff5c35] rounded-xl p-3 mb-4 text-[#ff5c35] flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                {warning}
              </div>
            )}
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-heading text-[#ff5c35]"></i> Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-gray-400 text-white transition"
                  name="title"
                  value={currentNote.title}
                  onChange={onChange}
                  minLength={3}
                  required
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-align-left text-[#ff5c35]"></i> Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-gray-400 text-white transition"
                  name="description"
                  value={currentNote.description}
                  onChange={onChange}
                  minLength={5}
                  required
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-tag text-[#ff5c35]"></i> Category
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] text-white transition"
                  name="tag"
                  value={currentNote.tag}
                  onChange={onChange}
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  
                  <option value="todo">Todo</option>
                  
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-6 py-2 rounded-full bg-[#191A23] text-white font-semibold border border-[#23243a] hover:border-[#ff5c35] hover:text-[#ff5c35] transition"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 text-lg flex items-center gap-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition"
                >
                  <i className="fas fa-save"></i> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <AddNote />
      <div className="max-w-5xl mx-auto mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <i className="fas fa-sticky-note text-[#ff5c35]"></i> Your Notes
          </h2>
          <span className="bg-[#ff5c35]/10 text-[#ff5c35] px-4 py-1 rounded-full font-semibold text-sm">
            {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
          </span>
        </div>
        <div className="bg-[#23243a] rounded-2xl p-8 shadow-xl">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <i className="fas fa-inbox text-6xl text-[#b0b3c6] mb-6"></i>
              <h4 className="text-xl text-[#b0b3c6] mb-2">No notes yet</h4>
              <p className="text-[#b0b3c6]">Create your first note to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {notes.map((note) => (
                <Noteitem key={note._id} note={note} updateNote={openModal} handleView={() => {}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
