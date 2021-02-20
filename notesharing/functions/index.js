const functions = require("firebase-functions");
const express = require('express')
const cors = require('cors')
const app = express()
const auth = require("./util/auth");

const {
  getAllNotes,
  postOneNote,
  deleteOneNote,
  editNote,
  getOneNote,
  searchNotes,
} = require("./APIs/notes");

const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails,
} = require("./APIs/users");

var corsOptions = {
  origin: 'https://notesharing-2d280.web.app',
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Credentials'],
  methods: ['OPTIONS', 'PUT', 'GET', 'POST', 'DELETE'],
  credentials: true,
  enablePreflight: true,
  optionsSuccessStatus: 204
}
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.put("/note/:noteId", auth, editNote);
app.get("/note/:noteId", getOneNote);
app.delete("/note/:noteId",  auth, deleteOneNote);
app.post("/note", auth, postOneNote);
app.get("/notes", auth, getAllNotes);
app.get("/notes/search", auth, searchNotes);

app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetail);
app.post("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
