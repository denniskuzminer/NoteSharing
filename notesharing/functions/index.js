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


var corsOptions = {
  origin: 'https://notesharing-2d280.web.app',
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Credentials'],
  methods: ['OPTIONS', 'PUT', 'GET', 'POST', 'DELETE'],
  credentials: true,
  enablePreflight: true,
  optionsSuccessStatus: 204
}

app.use(cors());
app.options('*', cors(corsOptions))

app.put("/note/:noteId", cors(corsOptions), auth, editNote);
app.get("/note/:noteId", cors(corsOptions), getOneNote);
app.delete("/note/:noteId", cors(corsOptions),  auth, deleteOneNote);
app.post("/note", cors(corsOptions), auth, postOneNote);
app.get("/notes", cors(corsOptions), auth, getAllNotes);
app.get("/notes/search", cors(corsOptions), auth, searchNotes);

const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails,
} = require("./APIs/users");

app.post("/login", cors(corsOptions), loginUser);
app.post("/signup", cors(corsOptions), signUpUser);
app.post("/user/image", cors(corsOptions), auth, uploadProfilePhoto);
app.get("/user", cors(corsOptions), auth, getUserDetail);
app.post("/user", cors(corsOptions), auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
