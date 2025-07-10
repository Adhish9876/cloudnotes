import React, { useContext, useEffect, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import Noteitem from './Noteitem';

export default function AllNotes({ showAlert, search, setSearch, sort, setSort }) {
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

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note =>
      note.title.toLowerCase().includes(search?.toLowerCase() || "") ||
      note.description.toLowerCase().includes(search?.toLowerCase() || "")
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
    <div className="w-full min-h-screen bg-[#191A23] py-4 px-2 sm:px-4 pt-16" aria-label="All Notes Section">
      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8">
                    {pinnedNotes.map((note) => (
                      <Noteitem key={note._id} note={note} updateNote={() => {}} handleView={() => {}} showAlert={showAlert} />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {otherNotes.map((note) => (
                      <Noteitem key={note._id} note={note} updateNote={() => {}} handleView={() => {}} showAlert={showAlert} />
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