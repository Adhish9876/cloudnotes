import noteContext from '../context/notes/noteContext';
import { useContext, useEffect, useState } from 'react';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notes({ showAlert, search, setSearch, sort, setSort }) {
  const context = useContext(noteContext);
  const { notes, getNote, editNote, addNote } = context;

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  // Only show the most recently added note from the notes array
  const lastNote = notes.length > 0 ? notes[notes.length - 1] : null;

  useEffect(() => {
    setLoading(true);
    setFetchError("");
    getNote().catch((err) => {
      setFetchError("Failed to load notes. Please check your connection and try again.");
      if (showAlert) showAlert("Failed to load notes. Please check your connection.");
    }).finally(() => setLoading(false));
  }, []);

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

  // Custom addNote handler to capture the last added note
  const handleAddNote = async (title, description, tag) => {
    await addNote(title, description, tag);
    // Find the last note (assuming backend returns all notes)
    // Instead, just set a local note object for display
    // setLastAddedNote({ title, description, tag, date: new Date().toISOString(), _id: Math.random().toString(36).slice(2) });
  };

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note =>
      note.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "Newest") return new Date(b.date) - new Date(a.date);
      if (sort === "Oldest") return new Date(a.date) - new Date(b.date);
      if (sort === "Title") return a.title.localeCompare(b.title);
      return 0;
    });

  // Animation variants
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };
  const noteVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring', stiffness: 60 } },
    exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
  };

  return (
    <motion.div className="w-full min-h-screen bg-[#191A23] py-4 px-2 sm:px-4" aria-label="Notes Section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Edit Note Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in overflow-y-auto">
          <motion.div
            className="bg-[#23243a] rounded-2xl shadow-2xl max-w-lg w-full p-4 sm:p-8 border border-[#23243a] relative animate-fade-in-up scale-95 opacity-0 animate-[fadeInUp_0.3s_ease-out_forwards] transition-transform duration-300 overflow-y-auto max-h-[90vh]"
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.3 }}
          >
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
                    className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#23243a] placeholder-gray-400 text-white transition focus:outline-none"
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
          </motion.div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AddNote showAlert={showAlert} addNote={handleAddNote} />
      </motion.div>
      <motion.div
        className="grid grid-cols-1 gap-4 sm:gap-6 mt-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {lastNote && (
            <motion.div
              key={lastNote._id}
              variants={noteVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
            >
              <Noteitem
                note={lastNote}
                updateNote={openModal}
                handleView={() => {}}
                showAlert={showAlert}
                index={0}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
