const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

router.get('/fetchNotes', fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);  // send response once
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");  // send error response if error occurs
  }
});




router.post('/addNote', 
  fetchuser,
  [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
  ], 
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;

      // Create new note with user id from fetchuser middleware
      const note = new Notes({
        user: req.user.id, // revert to id
        title,
        description,
        tag
      });

      // Save note to DB
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


router.put('/updatenote/:id',
  fetchuser,
  [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
  ], 
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const{title,description,tag}=req.body;
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};

    try {
      // Find the note to be updated and update it
      let note = await Notes.findById(req.params.id);
      if (!note) { return res.status(404).send("Not Found") }

      if (note.user.toString() !== req.user.id) { // revert to id
        return res.status(401).send("Not Allowed");
      }

      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
      res.json({ note });
      } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);





router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Not Found");

    // Debug log
    console.log('Delete attempt:', { noteUser: note.user, reqUserId: req.user.id });

    if (note.user.toString() !== req.user.id.toString()) { // compare as strings
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: true, note });
    
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
