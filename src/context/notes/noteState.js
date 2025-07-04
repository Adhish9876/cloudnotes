import React, { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  const notesinitial = [
    
  ];

  const [notes, setnotes] = useState(notesinitial);

  // ADD A NOTE
  const addNote = async (title, description, tag="personal") => {
    const res = await fetch(`${host}/api/notes/addNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg1MzBiYmFjODNmYjY5ZDVhYTY3MTZiIn0sImlhdCI6MTc1MDY5NTkwN30.iO6ZlxSvv0iLFE1D52nzsVZvR6FTt6mm9WOtHTGOc58",
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
    const res = await fetch(`${host}/api/notes/fetchNotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg1MzBiYmFjODNmYjY5ZDVhYTY3MTZiIn0sImlhdCI6MTc1MDY5NTkwN30.iO6ZlxSvv0iLFE1D52nzsVZvR6FTt6mm9WOtHTGOc58",
      },
      body: JSON.stringify(),
    });

  const json = await res.json();
   console.log(json)
    setnotes(json);

    
  };






  // DELETE A NOTE
  const deleteNote = async (id) => {
    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg1MzBiYmFjODNmYjY5ZDVhYTY3MTZiIn0sImlhdCI6MTc1MDY5NTkwN30.iO6ZlxSvv0iLFE1D52nzsVZvR6FTt6mm9WOtHTGOc58",
      },
    });

    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setnotes(newNotes);
  };

  // EDIT A NOTE
  const editNote = async (id, title, description, tag) => {
  await fetch(`${host}/api/notes/updatenote/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": "<your-token-here>",
    },
    body: JSON.stringify({ title, description, tag }), // Send only what's changed
  });

  // Update UI state
  const updatedNotes = notes.map((note) =>
    note._id === id ? { ...note, title, description, tag } : note
  );
  setnotes(updatedNotes);
};


  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNote }}>
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
