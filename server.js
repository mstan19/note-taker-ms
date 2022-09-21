const express = require('express');
const PORT = 3002;
const app = express();
const path = require('path');
const uuid = require('./helper/uuid.js');

const fs = require('fs');
// const { notStrictEqual } = require('assert');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

//work of api
app.get('/api/notes', (req, res) => {

  // res.sendFile(path.join(__dirname, '/public/notes.html'))

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const getNote = JSON.parse(data);
      //stores the data to to getNote
      res.json(getNote)
    }
  });
  console.log(`${req} request received to notes!`)
});

app.post('/api/notes', (req, res) => {
  console.log(`${req} request add to notes!`)

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const addNote = JSON.parse(data);
        addNote.push(newNote);

        fs.writeFile(
          './db/db.json',
          JSON.stringify(addNote, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.log('Successfully updated notes!')
        );
      }
    
    });
    const response = {
      status: 'success',
      body: newNote,
    };
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  // const db = require('./db/db.json');

  // console.log(id);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
     const db = JSON.parse(data);

      // const deletedNote = .filter(notStrictEqual=>notes!=req.params.id)
      const deletedNote = db.find(note => note.id === id);
      // console.log(deletedNote)        
      // res.status(200).json(deletedNote);

      if (deletedNote){
        const newDB = db.filter(note => note.id !== id);
        console.log(newDB)
        fs.writeFile(
          './db/db.json',
          JSON.stringify(newDB, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.log('Successfully updated database!')
        );  

        res.status(200).json(deletedNote);
      } else {
        res 
          .status(404)
          .json({message: "ID does not exist"});
      }
    }

  })
});



app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });