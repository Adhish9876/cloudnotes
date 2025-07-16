import React, { useState } from "react";
import noteContext from "./noteContext";
import { auth } from '../../../src/firebase'; // adjust path as needed

// Dynamic host selection for local/dev and production
function getApiHost() {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return 'https://cloudnotes-d60l.onrender.com';
}

async function getFreshToken() {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken(true); // force refresh
  }
  return null;
}

const NoteState = (props) => {
  const host = getApiHost();

  const notesinitial = [
    
  ];

  const [notes, setnotes] = useState(notesinitial);

  // ADD A NOTE
  const addNote = async (title, description, tag="personal") => {
    const token = await getFreshToken();
    const res = await fetch(`${host}/api/notes/addNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const data = await res.json();
    const note = {
      _id: data._id || Math.random().toString(), // fallback if no ID
      user: "68530bbac83fb69d5aa6716b",
      title,
      description: description,
      tag: tag,
      date: new Date().toISOString(),
      __v: 0,
    };
    setnotes(notes.concat(note));
  };

  const getNote = async () => {
    const token = await getFreshToken();
    const res = await fetch(`${host}/api/notes/fetchNotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      }
    });
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    const json = await res.json();
    setnotes(json);
  };

  // DELETE A NOTE
  const deleteNote = async (id) => {
    const token = await getFreshToken();
    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setnotes(newNotes);
  };

  // EDIT A NOTE
  const editNote = async (id, title, description, tag) => {
    const token = await getFreshToken();
    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ title, description, tag }),
    });
    // Update UI state
    const updatedNotes = notes.map((note) =>
      note._id === id ? { ...note, title, description, tag } : note
    );
    setnotes(updatedNotes);
  };

  // PIN/UNPIN A NOTE (frontend only)
  const pinNote = (id) => {
    setnotes(notes => notes.map(note => note._id === id ? { ...note, pinned: true } : note));
  };
  const unpinNote = (id) => {
    setnotes(notes => notes.map(note => note._id === id ? { ...note, pinned: false } : note));
  };

  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNote, pinNote, unpinNote }}>
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
