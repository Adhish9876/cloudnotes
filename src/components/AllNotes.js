import React, { useContext, useEffect, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import Noteitem from './Noteitem';

export default function AllNotes({ showAlert, search, setSearch, sort, setSort }) {
  const context = useContext(noteContext);
  const { notes, getNote, editNote } = context;

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Edit modal state
  const [show, setShow] = useState(false);
  const [currentNote, setCurrentNote] = useState({ title: "", description: "", tag: "", _id: "" });
  const [warning, setWarning] = useState("");
  // Todo edit state
  const [editTodos, setEditTodos] = useState([]);
  const [editNewTodo, setEditNewTodo] = useState("");

  // Open/close handlers for Edit modal
  const openModal = (note) => {
    setCurrentNote(note);
    if (note.tag === 'todo') {
      try {
        const parsed = JSON.parse(note.description);
        setEditTodos(Array.isArray(parsed) ? parsed : []);
      } catch {
        setEditTodos([]);
      }
    } else {
      setEditTodos([]);
    }
    setEditNewTodo("");
    setShow(true);
  };
  const closeModal = () => {
    setShow(false);
    setWarning("");
    setEditTodos([]);
    setEditNewTodo("");
  };

  const onChange = (e) => {
    setCurrentNote({ ...currentNote, [e.target.name]: e.target.value });
  };

  // Todo edit handlers
  const handleEditTodoInputChange = (e) => setEditNewTodo(e.target.value);
  const handleEditTodoInputKeyDown = (e) => {
    if (e.key === 'Enter' && editNewTodo.trim() !== "") {
      e.preventDefault();
      setEditTodos([...editTodos, { text: editNewTodo.trim(), checked: false }]);
      setEditNewTodo("");
    }
  };
  const handleEditTodoRemove = (idx) => {
    setEditTodos(editTodos.filter((_, i) => i !== idx));
  };
  const handleEditTodoCheck = (idx) => {
    setEditTodos(editTodos.map((todo, i) => i === idx ? { ...todo, checked: !todo.checked } : todo));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (currentNote.title.length < 3) {
      setWarning("Title must be at least 3 characters.");
      return;
    }
    if (currentNote.tag === 'todo') {
      if (editTodos.length === 0) {
        setWarning("Please add at least 1 todo item.");
        return;
      }
    } else if (currentNote.description.length < 5) {
      setWarning("Description must be at least 5 characters.");
      return;
    }
    setWarning("");
    let description = currentNote.description;
    if (currentNote.tag === 'todo') {
      description = JSON.stringify(editTodos);
    }
    await editNote(currentNote._id, currentNote.title, description, currentNote.tag);
    closeModal();
    if (showAlert) showAlert("Note updated successfully!");
  };

  useEffect(() => {
    setLoading(true);
    setFetchError("");
    getNote().catch((err) => {
      setFetchError("Failed to load notes. Please check your connection and try again.");
      if (showAlert) showAlert("Failed to load notes. Please check your connection.");
    }).finally(() => setLoading(false));
  }, []);

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note =>
      note.title.toLowerCase().includes(search?.toLowerCase() || "")
    )
    .sort((a, b) => {
      if (sort === "Newest") return new Date(b.date) - new Date(a.date);
      if (sort === "Oldest") return new Date(a.date) - new Date(b.date);
      if (sort === "Title") return a.title.localeCompare(b.title);
      return 0;
    });

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  return (
    <div className="w-full min-h-screen bg-[#191A23] py-6 px-2 sm:px-4 pt-16" aria-label="All Notes Section">
      <div className="max-w-5xl mx-auto mt-8">
        {/* Edit Note Modal */}
        {show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in overflow-y-auto">
            <div className="bg-[#23243a] rounded-2xl shadow-2xl max-w-lg w-full p-4 sm:p-8 border border-[#23243a] relative transition-transform duration-300 overflow-y-auto max-h-[90vh]">
              <button
                className="absolute top-4 right-4 text-white hover:text-[#ff5c35] text-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff5c35]"
                onClick={closeModal}
                aria-label="Close modal"
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
                    className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-gray-400 text-white transition focus:outline-none"
                    name="title"
                    value={currentNote.title}
                    onChange={onChange}
                    minLength={3}
                    required
                    aria-label="Note title"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <i className="fas fa-align-left text-[#ff5c35]"></i> Description
                  </label>
                  {currentNote.tag === 'todo' ? (
                    <div className="bg-gradient-to-r from-white to-gray-50 text-[#191A23] rounded-xl px-6 py-4 w-full mb-4 border-2 border-transparent transition-all duration-300 text-base font-medium placeholder-gray-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      <ul className="mb-2">
                        {editTodos.map((todo, idx) => (
                          <li key={idx} className="flex items-center gap-2 mb-2">
                            <input type="checkbox" checked={!!todo.checked} onChange={() => handleEditTodoCheck(idx)} className="accent-[#ff5c35] w-4 h-4" />
                            <span className={todo.checked ? 'line-through text-gray-400' : ''}>{todo.text}</span>
                            <button type="button" onClick={() => handleEditTodoRemove(idx)} className="ml-2 text-[#ff5c35] hover:text-red-500 text-xs">Remove</button>
                          </li>
                        ))}
                      </ul>
                      <input
                        type="text"
                        value={editNewTodo}
                        onChange={handleEditTodoInputChange}
                        onKeyDown={handleEditTodoInputKeyDown}
                        placeholder="Add a todo and press Enter..."
                        className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#ff5c35] text-base"
                      />
                    </div>
                  ) : (
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-gray-400 text-white transition focus:outline-none"
                      name="description"
                      value={currentNote.description}
                      onChange={onChange}
                      minLength={5}
                      required
                      rows={4}
                      aria-label="Note description"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <i className="fas fa-tag text-[#ff5c35]"></i> Category
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] text-white transition focus:outline-none"
                    name="tag"
                    value={currentNote.tag}
                    onChange={onChange}
                    aria-label="Note category"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="todo">Todo</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-full bg-[#191A23] text-white font-semibold border border-[#23243a] hover:border-[#ff5c35] hover:text-[#ff5c35] transition transform hover:scale-105 hover:brightness-110 duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff5c35]"
                    onClick={closeModal}
                    aria-label="Cancel edit"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 text-lg flex items-center gap-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition transform hover:scale-105 hover:brightness-110 duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff5c35]"
                    aria-label="Save note"
                  >
                    <i className="fas fa-save"></i> Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-6 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <i className="fas fa-sticky-note text-[#ff5c35]"></i> All Notes
          </h2>
          <span className="bg-[#ff5c35]/20 text-[#ff5c35] px-4 py-1 rounded-full font-semibold text-sm sm:text-base">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
          </span>
        </div>
        <div className="bg-[#23243a] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl transition-shadow duration-200 hover:shadow-3xl min-h-[300px] flex items-center justify-center" style={{minHeight:loading?"300px":undefined}}>
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 border-4 border-[#ff5c35] border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-[#b0b3c6] text-lg font-semibold">Loading notes...</span>
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <i className="fas fa-cloud-showers-heavy text-6xl text-[#b0b3c6] mb-6"></i>
              <h4 className="text-2xl text-[#ff5c35] mb-2 font-semibold">{fetchError}</h4>
              <button
                className="mt-4 px-6 py-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition"
                onClick={() => { setLoading(true); setFetchError(""); getNote().finally(() => setLoading(false)); }}
              >
                Retry
              </button>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <i className="fas fa-box-open text-7xl text-[#b0b3c6] mb-6"></i>
              <h4 className="text-2xl text-[#b0b3c6] mb-2 font-semibold">No notes found</h4>
              <p className="text-[#b0b3c6]">You haven't created any notes yet. Click "Add a note" above to get started and organize your thoughts!</p>
            </div>
          ) : (
            <div className="w-full">
              {pinnedNotes.length > 0 && (
                <>
                  <div className="mb-2 text-yellow-400 font-semibold text-base sm:text-lg flex items-center gap-2">
                    <i className="fas fa-thumbtack"></i> Pinned
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8 mb-8">
                    {pinnedNotes.map((note) => (
                      <Noteitem key={note._id} note={note} updateNote={openModal} handleView={() => {}} showAlert={showAlert} />
                    ))}
                  </div>
                </>
              )}
              {otherNotes.length > 0 && (
                <>
                  {pinnedNotes.length > 0 && (
                    <div className="mb-2 text-[#b0b3c6] font-semibold text-base sm:text-lg flex items-center gap-2">
                      <i className="fas fa-layer-group"></i> Others
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
                    {otherNotes.map((note) => (
                      <Noteitem key={note._id} note={note} updateNote={openModal} handleView={() => {}} showAlert={showAlert} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 