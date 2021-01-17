const functions = require("firebase-functions");
const app = require("express")();

const {
  getAllNotes,
  postOneNote,
  deleteOneNote,
  editNote,
  //   getOneNote,
} = require("./APIs/notes");

app.put("/note/:noteId", editNote);
// app.get("/note/:noteId", getOneNote);
app.delete("/note/:noteId", deleteOneNote);
app.post("/note", postOneNote);
app.get("/notes", getAllNotes);
exports.api = functions.https.onRequest(app);
