const { admin, db } = require("../util/admin");
const config = require("../util/config");
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { ENODATA } = require("constants");
const { CLIENT_RENEG_LIMIT } = require("tls");

exports.getAllNotes = (request, response) => {
  db.collection("notes")
    .where("username", "==", request.user.username)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let notes = [];
      data.forEach((doc) => {
        notes.push({
          noteId: doc.id,
          school: doc.data().school,
          class: doc.data().class,
          title: doc.data().title,
          description: doc.data().description,
          fileUrl: doc.data().fileUrl,
          createdAt: doc.data().createdAt,
        });
      });
      return response.json(notes);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};
  
exports.searchNotes = (request, response) => {
  var searchString = request.query.string
  db
    .collection("notes")
    .orderBy("title", "desc")
    .where("search_cases", "array-contains-any", searchString.toUpperCase().split(" "))
    .limit(10)
    .get()
    .then((data) => {
      let notes = [];
      data.forEach((doc) => {
        notes.push({
          noteId: doc.id,
          school: doc.data().school,
          class: doc.data().class,
          title: doc.data().title,
          description: doc.data().description,
          fileUrl: doc.data().fileUrl,
          createdAt: doc.data().createdAt,
        });
      });
      return response.json(notes);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

deleteFile = (fileName) => {
  const bucket = admin.storage().bucket();
  const path = `${fileName}`;
  return bucket
    .file(path)
    .delete()
    .then(() => {
      return;
    })
    .catch((error) => {
      return;
    });
};

exports.postOneNote = async (request, response, next) => {
  const busboy = new BusBoy({ headers: request.headers });
  let fileName;
  let fileToBeUploaded = {};
  let newNoteItem = {};
  busboy.on(
    "field",
    (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
      newNoteItem[fieldname] = val;
    }
  );
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (
      mimetype !== "image/png" &&
      mimetype !== "image/jpeg" &&
      mimetype !== "application/pdf"
    ) {
      return response.status(400).json({ error: "Wrong file type submited" });
    }
    const fileExtension = filename.split(".")[filename.split(".").length - 1];
    fileName = `${newNoteItem.school} ${newNoteItem.class} ${newNoteItem.title}.${fileExtension}`
      .split(" ")
      .join("_");
    const filePath = path.join(os.tmpdir(), fileName);
    fileToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });
  deleteFile(fileName);
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(fileToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: fileToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        newNoteItem.fileUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${fileName}?alt=media`;
        newNoteItem.createdAt = new Date().toISOString();
        newNoteItem.username = request.user.username; //add username
        //add search cases
        var Array = newNoteItem.title.toUpperCase().split(" ");
        var SearchArray = [];
        var k = 0;
        for (i = 0; i < Array.length; i++)
        {
          for (j = 0; j < Array[i].length; j++)
          {
            SearchArray[k] = Array[i].substr(0, j+1);
            k++;
          }
        }
        newNoteItem.search_cases = SearchArray;
        //
        return db
          .collection("notes")
          .add(newNoteItem)
          .then((docRef) => {
            return response.json({ id: docRef.id });
          })
          .catch((error) => {
            console.error(error);
            return response.status(500).json({ error: error.code });
          });
      })
      .then(() => {
        return response.json({ message: "Uploaded successfully" });
      })
      .catch((error) => {
        console.error(error);
        return response.status(500).json({ error: error.code });
      });
  });
  busboy.end(request.rawBody);
};

exports.getOneNote = (request, response) => {
  db.doc(`/notes/${request.params.noteId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({
          error: "Note not found",
        });
      }
      NoteData = doc.data();
      NoteData.noteId = doc.id;
      return response.json(NoteData);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: error.code });
    });
};

exports.deleteOneNote = (request, response) => {
  const document = db.doc(`/notes/${request.params.noteId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Note not found" });
      }
      return document.delete();
    })
    .then(() => {
      response.json({ message: "Delete successful" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.editNote = async (request, response) => {
  const busboy = new BusBoy({ headers: request.headers });
  let fileName;
  let fileToBeUploaded = {};
  let newNoteItem = {};
  await db
    .doc(`/notes/${request.params.noteId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({
          error: "Note not found",
        });
      }
      newNoteItem = doc.data();
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: error.code });
    });
  let hasFiles = false;
  busboy.on(
    "field",
    (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
      newNoteItem[fieldname] = val;
      if (fieldname == "noteId" || fieldname == "createdAt") {
        return response.status(403).json({ message: "Not allowed to edit" });
      }
    }
  );

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    hasFiles = true;
    if (
      mimetype !== "image/png" &&
      mimetype !== "image/jpeg" &&
      mimetype !== "application/pdf"
    ) {
      return response.status(400).json({ error: "Wrong file type submited" });
    }
    const fileExtension = filename.split(".")[filename.split(".").length - 1];
    fileName = `${newNoteItem.school} ${newNoteItem.class} ${newNoteItem.title}.${fileExtension}`
      .split(" ")
      .join("_");
    const filePath = path.join(os.tmpdir(), fileName);
    fileToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", () => {
    if (hasFiles) {
      deleteFile(fileName);
      admin
        .storage()
        .bucket()
        .upload(fileToBeUploaded.filePath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: fileToBeUploaded.mimetype,
            },
          },
        })
        .then(() => {
          newNoteItem.fileUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${fileName}?alt=media`;
          let document = db.collection("notes").doc(`${request.params.noteId}`);
          document
            .update(newNoteItem)
            .then(() => {
              response.json({ message: "Updated successfully" });
            })
            .catch((err) => {
              console.error(err);
              return response.status(500).json({
                error: err.code,
              });
            });
        })
        .then(() => {
          return response.json({ message: "Updated successfully" });
        })
        .catch((error) => {
          console.error(error);
          return response.status(500).json({ error: error.code });
        });
    } else {
      let document = db.collection("notes").doc(`${request.params.noteId}`);
      document
        .update(newNoteItem)
        .then(() => {
          response.json({ message: "Updated successfully" });
        })
        .catch((err) => {
          console.error(err);
          return response.status(500).json({
            error: err.code,
          });
        });
    }
  });
  busboy.end(request.rawBody);
};
