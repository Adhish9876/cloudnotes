import React from 'react'
import noteContext from '../context/notes/noteContext';
import { useContext, useState } from 'react';
import { FaPlus, FaTag, FaEdit, FaAlignLeft } from 'react-icons/fa';
import Select from 'react-select';

const tagOptions = [
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'todo', label: 'Todo' },
];

const AddNote = ({ showAlert }) => {
  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const context = useContext(noteContext);
  const { notes, addNote } = context;
  const [note, setNote] = useState({title: "", description: "", tag: "personal", todos: []});
  const [newTodo, setNewTodo] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    if (note.title.length < 3) {
      setWarning("Title must be at least 3 characters.");
      setTimeout(() => setWarning(""), 2000);
      return;
    }
    if (note.tag === 'todo' && note.todos.length === 0) {
      setWarning("Please add at least 1 todo item.");
      setTimeout(() => setWarning(""), 2000);
      return;
    }
    if (note.tag !== 'todo' && note.description.length < 5) {
      setWarning("Description must be at least 5 characters.");
      setTimeout(() => setWarning(""), 2000);
      return;
    }
    setWarning("");
    let description = note.description;
    if (note.tag === 'todo') {
      // Save todos as JSON string in description
      description = JSON.stringify(note.todos);
    }
    addNote(note.title, description, note.tag);
    setNote({title: "", description: "", tag: "personal", todos: []});
    setNewTodo("");
    setSuccess("Note added successfully!");
    setTimeout(() => setSuccess(""), 2000);
  }

  const onChange = (e) => {
    setNote({...note, [e.target.name]: e.target.value});
  }

  const handleTagChange = (selectedOption) => {
    // Allow changing tag without clearing description or todos
    setNote({...note, tag: selectedOption.value});
  }

  // Handler for Todo/Cancel button
  const handleTodoButton = () => {
    if (note.tag !== 'todo') {
      setNote({ ...note, tag: 'todo' });
    } else {
      setNote({ ...note, tag: 'personal', description: '', todos: [] });
    }
  };

  // Todo logic
  const handleTodoInputChange = (e) => {
    setNewTodo(e.target.value);
  };

  // Track which todo is selected (radio)
  const [selectedTodoIdx, setSelectedTodoIdx] = useState(null);

  const handleTodoInputKeyDown = (e) => {
    if (e.key === 'Enter' && newTodo.trim() !== "") {
      e.preventDefault();
      setNote({
        ...note,
        todos: [...note.todos, { text: newTodo.trim(), checked: false }],
      });
      setNewTodo("");
    }
  };

  const handleTodoRadio = (idx) => {
    setSelectedTodoIdx(idx);
  };

  const handleTodoRemove = (idx) => {
    const updatedTodos = note.todos.filter((_, i) => i !== idx);
    setNote({ ...note, todos: updatedTodos });
    // If the removed todo was selected, clear selection
    if (selectedTodoIdx === idx) setSelectedTodoIdx(null);
    else if (selectedTodoIdx > idx) setSelectedTodoIdx(selectedTodoIdx - 1);
  };

  return (
    <div>
      <div className="max-w-2xl w-full mx-auto bg-[#23243a]  rounded-2xl shadow-2xl p-4 sm:p-8 lg:p-12 mt-8 border border-[#23243a] transition-shadow duration-200 hover:shadow-3xl flex flex-col items-center">
        <h1 className="text-white font-bold text-3xl mb-6 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#ff5c35] text-white mr-2 text-2xl">
            <FaPlus />
          </span>
          Add a note
        </h1>

        {warning && (
          <div className="bg-[#ff5c35] text-white rounded-lg px-4 py-2 mb-4 flex items-center animate-pulse" role="alert">
            {warning}
          </div>
        )}

        <form className="w-full">
          {/* Enhanced Title Input */}
          <div className="mb-6 my-3">
            <label htmlFor="title" className="block text-white font-semibold mb-3 text-lg flex items-center gap-2">
              <FaEdit className="text-[#ff5c35]" />
              Title
            </label>
            <div className="relative group">
              <input 
                type="text" 
                className={`bg-gradient-to-r from-white to-gray-50 text-[#191A23] rounded-xl px-6 py-4 w-full mb-4 border-2 transition-all duration-300 text-base font-medium placeholder-gray-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  focusedField === 'title' 
                    ? 'border-[#ff5c35] shadow-[#ff5c35]/20 shadow-2xl scale-[1.02]' 
                    : 'border-transparent hover:border-[#ff5c35]/30'
                }`}
                id="title" 
                aria-describedby="titlehelp" 
                name="title" 
                value={note.title} 
                onChange={onChange}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField('')}
                placeholder="Enter your note title..."
              />
            </div>
          </div>

          {/* Enhanced Description or Todo List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="description" className="block text-white font-semibold text-lg flex items-center gap-2 m-0">
                <FaAlignLeft className="text-[#ff5c35]" />
                Description
              </label>
              <button
                type="button"
                className={`ml-auto px-4 py-1 rounded-lg text-sm font-semibold border border-[#ff5c35] text-[#ff5c35] bg-white hover:bg-[#ff5c35] hover:text-white transition`}
                onClick={handleTodoButton}
                title={note.tag === 'todo' ? 'Cancel todo mode and clear all' : 'Convert to todo'}
              >
                {note.tag === 'todo' ? 'Cancel' : 'Todo'}
              </button>
            </div>
            <div className="relative group">
              {note.tag === 'todo' ? (
                <div className="bg-gradient-to-r from-white to-gray-50 text-[#191A23] rounded-xl px-6 py-4 w-full mb-4 border-2 border-transparent transition-all duration-300 text-base font-medium placeholder-gray-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <ul className="mb-2">
                    {note.todos.map((todo, idx) => (
                      <li key={idx} className="flex items-center gap-2 mb-2">
                        <span>{todo.text}</span>
                        <button type="button" onClick={() => handleTodoRemove(idx)} className="ml-2 text-[#ff5c35] hover:text-red-500 text-xs">Remove</button>
                      </li>
                    ))}
                  </ul>
                  <input
                    type="text"
                    value={newTodo}
                    onChange={handleTodoInputChange}
                    onKeyDown={handleTodoInputKeyDown}
                    placeholder="Add a todo and press Enter..."
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#ff5c35] text-base"
                  />
                </div>
              ) : (
                <textarea 
                  className={`bg-gradient-to-r from-white to-gray-50 text-[#191A23] rounded-xl px-6 py-4 w-full mb-4 border-2 transition-all duration-300 text-base font-medium placeholder-gray-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 resize-none ${
                    focusedField === 'description' 
                      ? 'border-[#ff5c35] shadow-[#ff5c35]/20 shadow-2xl scale-[1.02]' 
                      : 'border-transparent hover:border-[#ff5c35]/30'
                  }`}
                  id="description" 
                  name="description" 
                  value={note.description} 
                  onChange={onChange} 
                  rows={4}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Describe your note in detail..."
                />
              )}
            </div>
          </div>

          {/* Enhanced Tag Select */}
          <div className="mb-6">
            <label htmlFor="tag" className="block text-white font-semibold mb-3 text-lg flex items-center gap-2">
              <FaTag className="text-[#ff5c35]" />
              Tag
            </label>
            <div className="relative group">
              <Select
                id="tag"
                name="tag"
                options={tagOptions}
                value={tagOptions.find(option => option.value === note.tag)}
                onChange={handleTagChange}
                className="mb-4 rounded-xl"
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(to right, #ffffff, #f9fafb)',
                    border: state.isFocused ? '2px solid #ff5c35' : '2px solid transparent',
                    minHeight: '56px',
                    boxShadow: state.isFocused 
                      ? '0 20px 25px -5px rgba(255, 92, 53, 0.1), 0 10px 10px -5px rgba(255, 92, 53, 0.04)' 
                      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    transform: state.isFocused ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                    '&:hover': {
                      borderColor: 'rgba(255, 92, 53, 0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: '0 20px',
                    fontSize: '16px',
                    fontWeight: '500',
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: '#9ca3af',
                    fontSize: '16px',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected 
                      ? '#ff5c35' 
                      : state.isFocused 
                        ? 'rgba(255, 92, 53, 0.1)' 
                        : 'white',
                    color: state.isSelected ? 'white' : '#191A23',
                    padding: '12px 20px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#ff5c35' : 'rgba(255, 92, 53, 0.15)',
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 92, 53, 0.1)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                  }),
                  menuList: (base) => ({
                    ...base,
                    padding: '8px',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: '#191A23',
                    fontSize: '16px',
                    fontWeight: '500',
                  }),
                  dropdownIndicator: (base, state) => ({
                    ...base,
                    color: state.isFocused ? '#ff5c35' : '#6b7280',
                    transition: 'all 0.2s ease',
                    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }),
                  indicatorSeparator: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(255, 92, 53, 0.2)',
                  }),
                }}
                placeholder="Select a tag..."
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="bg-gradient-to-r from-[#ff5c35] to-[#ff784e] text-white rounded-xl px-8 py-4 font-bold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#ff5c35]/30 active:scale-95 text-lg w-full mt-6 transform hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden group"
            onClick={handleClick}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative inline-flex items-center gap-3 justify-center">
              <FaPlus className="text-xl" /> 
              Submit
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNote;