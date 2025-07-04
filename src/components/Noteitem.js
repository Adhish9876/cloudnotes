import { useContext } from 'react';
import noteContext from '../context/notes/noteContext';


export default function Noteitem(props) {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote, handleView } = props;

  return (
    <div className="col-md-3 mb-4">
      <div
        className="card h-100 shadow-sm"
        style={{ cursor: "pointer" }}
        onClick={() => handleView(note)}
      >
        <div className="card-body d-flex flex-column">
          <h5 className="card-title mb-3 d-flex align-items-center">
  {note.title}
  <span
    className={`badge ms-2 ${
      note.tag === 'personal' ? 'bg-info text-dark' :
      note.tag === 'todo' ? 'bg-warning text-dark' :
      note.tag === 'work' ? 'bg-danger' :
      'bg-secondary'
    }`}
    style={{ fontSize: '0.75rem', cursor: 'default' }}
  >
    {note.tag}
  </span>
</h5>

          <p className="card-text flex-grow-1">{note.description}</p>
          <div className="mt-3 d-flex justify-content-end gap-3">
           <button
  className="btn btn-outline-danger btn-sm"
  title="Delete note"
  onClick={(e) => {
    e.stopPropagation();
if (window.confirm("Are you sure you want to delete this note? (There is no recycle bin 😜)")) {
  deleteNote(note._id);
}
 {
      deleteNote(note._id);
    }
  }}
>
  <i className="fa-solid fa-trash"></i>
</button>

            <button
              className="btn btn-outline-primary btn-sm"
              title="Edit note"
              onClick={(e) => {
                e.stopPropagation();
                updateNote(note);
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
