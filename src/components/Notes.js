import noteContext from '../context/notes/noteContext';
import { useContext, useEffect, useState } from 'react';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notes({ showAlert, search, setSearch, sort, setSort }) {
  const context = useContext(noteContext);
  const { notes, getNote, editNote } = context;

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

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

  const handleSave = async (e) => {
    e.preventDefault();
    if (currentNote.title.length < 3 || currentNote.description.length < 5) {
      setWarning("Title must be at least 3 characters and description at least 5 characters.");
      return;
    }
    setWarning("");
    await editNote(currentNote._id, currentNote.title, currentNote.description, currentNote.tag);
    closeModal();
    if (showAlert) showAlert("Note updated successfully!");
  };

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.description.toLowerCase().includes(search.toLowerCase())
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
    <motion.div className="w-full min-h-screen bg-[#191A23] py-4 px-0" aria-label="Notes Section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Edit Note Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in" role="dialog" aria-modal="true" aria-label="Edit Note Modal">
          <motion.div
            className="bg-[#23243a] rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-[#23243a] relative animate-fade-in-up scale-95 opacity-0 animate-[fadeInUp_0.3s_ease-out_forwards] transition-transform duration-300"
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
        <AddNote showAlert={showAlert} />
      </motion.div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {filteredNotes.map((note, i) => (
            <motion.div
              key={note._id}
              variants={noteVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
            >
              <Noteitem
                note={note}
                updateNote={openModal}
                handleView={() => {}}
                showAlert={showAlert}
                index={i}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
