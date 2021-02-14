const functions = require("firebase-functions");
const app = require("express")();
var cors = require('cors')
const auth = require("./util/auth");

const {
  getAllNotes,
  postOneNote,
  deleteOneNote,
  editNote,
  getOneNote,
  searchNotes,
} = require("./APIs/notes");

app.use(cors())

var corsOptions = {
  origin: 'https://notesharing-2d280.web.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

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
