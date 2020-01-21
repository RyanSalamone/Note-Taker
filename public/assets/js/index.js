// I updated some of the code to ES6 syntax for the sake of practice
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");


// activeNote is used to keep track of the note in the textarea
var activeNote = {};

// A function for getting all notes from the db
var getNotes = function () {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });

};

// A function for saving a note to the db
var saveNote = function (note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  },
    // console.log(note)
  );
};

// A function for deleting a note from the db
const deleteNote = function (id) {
  return $.ajax({
    url: `api/notes/${id}`,
    method: "DELETE"
  });

};

// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = function () {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};


//Fancy stuff I copied off the internet to generate a random ID# for each note
const length = 8;
const timestamp = +new Date;

const _getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateID = function () {
  let ts = timestamp.toString();
  let parts = ts.split("").reverse();
  let id = "";

  for (let i = 0; i < length; ++i) {
    let index = _getRandomInt(0, parts.length - 1);
    id += parts[index];
  }
  return id;
}

// Get the note data from the inputs, save it to the db and update the view
const handleNoteSave = function () {
  let id = generateID();
  let newNote = {
    id: id,
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  saveNote(newNote).then(function (data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};



// Delete the clicked note
var handleNoteDelete = function (event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  let note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id)
    .then(() => {
      let el = document.getElementById(note.id)
      el.remove();
    });

  // I achieved the delete functionality by comenting out the code that Trilogy provided below.  Hmmmm....
  // .then( () => {
  //   getAndRenderNotes();
  //   renderActiveNote()
  // });
};

// Sets the activeNote and displays it
var handleNoteView = function () {
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
var handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
var handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
const renderNoteList = function (notes) {
  $noteList.empty();

  const noteListItems = [];

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];

    let noteData = $("<li class='list-group-item'>").data(note);
    let noteSpan = $("<span>").text(note.title);
    let noteDelBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    noteData.append(noteSpan, noteDelBtn).attr("id", note.id);
    
    noteListItems.push(noteData);
  }

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function () {
  return getNotes().then(function (data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();