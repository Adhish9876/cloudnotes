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
  const [visible, setVisible] = useState(false);
  const [warning, setWarning] = useState("");
  const [currentNote, setCurrentNote] = useState({ title: "", description: "", tag: "", _id: "" });

  // View modal state
  const [viewNote, setViewNote] = useState(null);
  const [viewShow, setViewShow] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);

  // Open/close handlers for Edit modal
  const openModal = () => {
    setVisible(true);
    setTimeout(() => setShow(true), 10);
  };
  const closeModal = () => {
    setShow(false);
    setTimeout(() => setVisible(false), 300);
  };

  // Open/close handlers for View modal
  const openViewModal = () => {
    setViewVisible(true);
    setTimeout(() => setViewShow(true), 10);
  };
  const closeViewModal = () => {
    setViewShow(false);
    setTimeout(() => setViewVisible(false), 300);
  };

  // When editing
  const updateNote = (note) => {
    setCurrentNote(note);
    openModal();
  };

  // When viewing (click on card)
  const handleView = (note) => {
    setViewNote(note);
    openViewModal();
  };

  const handleClose = () => {
    closeModal();
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
    <>
      {/* Embedded CSS for modal animation */}
      <style>{`
        .modal-header {
          position: relative;
          justify-content: center;
        }
        .modal-title {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .modal.fade {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .modal.fade.show {
          opacity: 1;
          pointer-events: auto;
        }
        .modal-dialog {
          transform: translateY(-50px);
          transition: transform 0.3s ease;
        }
        .modal.fade.show .modal-dialog {
          transform: translateY(0);
        }
        .modal-content {
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
      `}</style>

      <AddNote />

      {/* Edit Note Modal */}
      <div
        className={`modal fade ${show ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden={!show}
        style={visible ? { display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' } : { display: 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">EDIT</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              />
            </div>

            <div className="modal-body">
              <form onSubmit={handleSave}>
                {warning &&
                  <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    {warning}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setWarning("")}></button>
                  </div>
                }

                <div className="mb-3 my-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={currentNote.title}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={currentNote.description}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tag</label>
                  <select
                    className="form-select"
                    id="tag"
                    name="tag"
                    value={currentNote.tag}
                    onChange={onChange}
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="todo">Todo</option>
                    <option value="important">Important</option>
                    <option value="idea">Idea</option>
                    <option value="finance">Finance</option>
                    <option value="travel">Travel</option>
                    <option value="health">Health</option>
                    <option value="random">Random</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                  <button type="submit" className="btn btn-primary">Save changes</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* View Note Modal */}
      <div
        className={`modal fade ${viewShow ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="viewNoteModalLabel"
        aria-hidden={!viewShow}
        style={viewVisible ? { display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' } : { display: 'none' }}
        onClick={closeViewModal} // close on backdrop click
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
          onClick={e => e.stopPropagation()} // prevent modal close on content click
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center" id="viewNoteModalLabel">{viewNote?.title}</h5>

              <button type="button" className="btn-close" aria-label="Close" onClick={closeViewModal}></button>
            </div>
            <div className="modal-body">

              <p>{viewNote?.description}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeViewModal}>Close</button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="row my-3">
          <h2>Your Notes</h2>
          <div className="container mx-2">{notes.length === 0 && "No notes to display"}</div>

          {notes.map((note) => (
            <Noteitem key={note._id} note={note} updateNote={updateNote} handleView={handleView} />
          ))}
        </div>
      </div>
    </>
  );
}
