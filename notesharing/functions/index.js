const functions = require("firebase-functions");
const app = require("express")();

const { getAllNotes, postOneNote } = require("./APIs/notes");

app.post("/note", postOneNote);
app.get("/notes", getAllNotes);
exports.api = functions.https.onRequest(app);
