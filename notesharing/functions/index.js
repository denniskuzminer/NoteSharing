const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");

const {
  getAllNotes,
  postOneNote,
  deleteOneNote,
  editNote,
  getOneNote,
  searchNotes,
} = require("./APIs/notes");

app.put("/note/:noteId", auth, editNote);
app.get("/note/:noteId", getOneNote);
app.delete("/note/:noteId", auth, deleteOneNote);
app.post("/note", auth, postOneNote);
app.get("/notes", auth, getAllNotes);
app.get("/notes/search", auth, searchNotes);

const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails,
} = require("./APIs/users");

app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetail);
app.post("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
