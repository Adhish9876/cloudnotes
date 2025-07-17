import React, { useState } from 'react';
import { useContext } from 'react';
import noteContext from '../context/notes/noteContext';
import { motion } from 'framer-motion';

export default function Noteitem(props) {
  const context = useContext(noteContext);
  const { deleteNote, pinNote, unpinNote } = context;
  const { note, updateNote, handleView, showAlert, ...motionProps } = props;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  // For todo notes, local state for checkboxes
  let initialTodos = [];
  if (note.tag === 'todo') {
    try {
      initialTodos = JSON.parse(note.description);
      if (!Array.isArray(initialTodos)) initialTodos = [];
    } catch {
      initialTodos = [];
    }
  }
  const [modalTodos, setModalTodos] = useState(initialTodos);

  // Add local state for the note's description to allow updating after save
  const [localDescription, setLocalDescription] = useState(note.description);

  // Open modal and set todos if needed
  const handleCardClick = () => {
    if (note.tag === 'todo') {
      let todos = [];
      try {
        todos = JSON.parse(localDescription);
        if (!Array.isArray(todos)) todos = [];
      } catch {
        todos = [];
      }
      setModalTodos(todos);
    }
    setModalOpen(true);
  };

  const handleTodoCheck = idx => {
    setModalTodos(todos => todos.map((todo, i) => i === idx ? { ...todo, checked: !todo.checked } : todo));
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSaveModal = () => {
    // Save the updated todos to localDescription
    if (note.tag === 'todo') {
      setLocalDescription(JSON.stringify(modalTodos));
    }
    setModalOpen(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(note._id);
      if (showAlert) showAlert('Note deleted successfully!');
    }
  };

  const handlePin = (e) => {
    e.stopPropagation();
    if (note.pinned) {
      unpinNote(note._id);
      if (showAlert) showAlert('Note unpinned');
    } else {
      pinNote(note._id);
      if (showAlert) showAlert('Note pinned');
    }
  };

  return (
    <>
      <motion.div className={`relative group ${note.pinned ? 'border-2 border-yellow-400' : ''}`} {...motionProps}>
        <div
          className="bg-white text-[#191A23] rounded-2xl shadow-lg p-3 sm:p-4 transition-all duration-300 border border-[#e5e7eb] group-hover:shadow-2xl min-h-[140px] h-[180px] max-h-[180px] w-full max-w-xs flex flex-col cursor-pointer min-w-0 overflow-hidden"
          onClick={handleCardClick}
        >
          <div className="flex items-center justify-between mb-2 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold truncate flex-1 pr-2 min-w-0">{note.title}</h3>
            <div className="flex gap-2">
              
              <button
                className="text-[#ff5c35] hover:text-white p-3 sm:p-2 rounded-full transition"
                onClick={e => { e.stopPropagation(); updateNote(note); }}
                aria-label="Edit note"
              >
                <i className="fas fa-pen-to-square"></i>
              </button>
              <button
               className=" text-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"



                onClick={handleDelete}
                aria-label="Delete note"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          {/* Description or Todo Preview */}
          {note.tag === 'todo' ? (
            <ul className="mb-4 flex-1 overflow-hidden">
              {(() => {
                let todos = [];
                try {
                  todos = JSON.parse(localDescription);
                  if (!Array.isArray(todos)) todos = [];
                } catch {
                  todos = [];
                }
                if (todos.length === 0) {
                  return <li className="text-[#191A23] text-base sm:text-lg italic opacity-60">No todos</li>;
                }
                return todos.slice(0, 4).map((todo, idx) => (
                  <li key={idx} className="flex items-center gap-2 mb-1 max-w-full overflow-hidden">
                    <input type="checkbox" checked={!!todo.checked} readOnly className="accent-[#ff5c35] w-4 h-4" />
                    <span className={todo.checked ? 'line-through text-gray-400' : ''} style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '170px'}}>{todo.text}</span>
                  </li>
                ));
              })()}
              {/* Show ..... if more todos */}
              {(() => {
                let todos = [];
                try {
                  todos = JSON.parse(localDescription);
                  if (!Array.isArray(todos)) todos = [];
                } catch {
                  todos = [];
                }
                return todos.length > 4 ? <li className="text-center text-lg text-gray-400">.....</li> : null;
              })()}
            </ul>
          ) : (
            <div className="mb-4 flex-1 overflow-hidden">
              <p className="text-[#191A23] line-clamp-3 text-base sm:text-lg overflow-hidden break-words" style={{maxHeight: '4.5em'}}>
                {localDescription.length > 120 ? localDescription.slice(0, 120) : localDescription}
              </p>
              {localDescription.length > 120 && (
                <div className="text-center text-lg text-gray-400">.....</div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="inline-block bg-[#ff5c35]/20 text-[#ff5c35] px-3 py-1 rounded-full text-xs font-semibold">
              {note.tag}
            </span>
            <span className="text-xs text-[#191A23]/50">{new Date(note.date).toLocaleDateString()}</span>
          </div>
        </div>
      </motion.div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 text-[#ff5c35] text-2xl font-bold hover:text-red-500"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{note.title}</h2>
            <div className="mb-4">
              {note.tag === 'todo' && Array.isArray(modalTodos) ? (
                <ul>
                  {modalTodos.map((todo, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={todo.checked}
                        onChange={() => handleTodoCheck(idx)}
                        className="accent-[#ff5c35] w-5 h-5"
                      />
                      <span className={todo.checked ? 'line-through text-gray-400' : ''}>{todo.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base whitespace-pre-line break-words">{localDescription}</p>
              )}
            </div>
            {note.tag === 'todo' && (
              <div className="flex justify-end mt-4">
                <button
                  className="bg-[#ff5c35] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#ff784e] transition"
                  onClick={handleSaveModal}
                >
                  Save
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="inline-block bg-[#ff5c35]/20 text-[#ff5c35] px-3 py-1 rounded-full text-xs font-semibold">
                {note.tag}
              </span>
              <span className="text-xs text-[#191A23]/50">{new Date(note.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
