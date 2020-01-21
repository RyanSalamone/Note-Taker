const router = require("express").Router();
const path = require('path');
const fs = require('fs');

router.get('/notes', (req, res) => {
  fs.readFile(__dirname + './../db/db.json', (err,data)  => {
    res.json(JSON.parse(data));
  });
});
router.post('/notes', (req, res) => {
  fs.readFile(__dirname + './../db/db.json', (err,data)  => {
      let notes = JSON.parse(data);
      let newNote = req.body;
      notes.push(newNote);
      
      fs.writeFile(__dirname + './../db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
        console.log('note saved');
      });
    });
    res.send('post sent');
});
module.exports = router;    