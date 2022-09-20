const express = require('express');
const PORT = 3002;
const app = express();
const db = require('./db/db.json');
const path = require('path');
const fs = require('fs');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
  console.log(`${req} request recieved to notes!`)
});

app.post('/notes', (req, res) => {
  console.log(`${req} request add to notes!`)

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
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
              : console.log('Successfully updated reviews!')
        );
      }
    
    });
  }
});


app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });