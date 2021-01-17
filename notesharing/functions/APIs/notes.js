const { db } = require("../util/admin");

exports.getAllNotes = (request, response) => {
  db.collection("notes")
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
          imageURL: doc.data().imageURL,
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

exports.postOneNote = (request, response) => {
  if (request.body.class.trim() === "") {
    return response.status(400).json({ class: "Must not be empty" });
  }

  if (request.body.title.trim() === "") {
    return response.status(400).json({ title: "Must not be empty" });
  }

  if (request.body.school.trim() === "") {
    return response.status(400).json({ school: "Must not be empty" });
  }

  if (request.body.description.trim() === "") {
    return response.status(400).json({ description: "Must not be empty" });
  }

  const newNoteItem = {
    school: request.body.school,
    class: request.body.class,
    title: request.body.title,
    description: request.body.description,
    imageURL: request.body.imageURL,
    createdAt: new Date().toISOString(),
  };
  db.collection("notes")
    .add(newNoteItem)
    .then((doc) => {
      const responseNoteItem = newNoteItem;
      responseNoteItem.id = doc.id;
      return response.json(responseNoteItem);
    })
    .catch((err) => {
      response.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
}; /*{
  "school": "New York University",
  "class": "Computer Systems Organization",
  "title": "Lab 1",
  "description": "Some code stuff",
  "imageURL": ""
} */
