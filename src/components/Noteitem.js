import React from 'react';
import { useContext } from 'react';
import noteContext from '../context/notes/noteContext';

export default function Noteitem(props) {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote, handleView } = props;

  return (
    <div className="relative group">
      <div
        className="bg-white text-[#191A23] rounded-2xl shadow-lg p-6 transition-all duration-300 border border-[#e5e7eb] group-hover:shadow-2xl min-h-[180px] flex flex-col cursor-pointer"
        onClick={() => handleView(note)}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold truncate flex-1 pr-2">{note.title}</h3>
          <div className="flex gap-2">
            <button
              className="text-[#ff5c35] hover:text-white p-2 rounded-full transition"
              onClick={e => { e.stopPropagation(); updateNote(note); }}
              aria-label="Edit note"
            >
              <i className="fas fa-pen-to-square"></i>
            </button>
            <button
              className="text-[#ff5c35] hover:text-white p-2 rounded-full transition"
              onClick={e => { e.stopPropagation(); if (window.confirm('Are you sure you want to delete this note?')) deleteNote(note._id); }}
              aria-label="Delete note"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <p className="text-[#191A23] mb-4 line-clamp-3 flex-1">{note.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="inline-block bg-[#ff5c35]/20 text-[#ff5c35] px-3 py-1 rounded-full text-xs font-semibold">
            {note.tag}
          </span>
          <span className="text-xs text-[#191A23]/50">{new Date(note.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
