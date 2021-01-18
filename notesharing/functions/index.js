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

//######### Authentification #########//
const auth = require('./util/auth');

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails
} = require('./APIs/users')


app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);
//######### Authentification #########//

exports.api = functions.https.onRequest(app);
