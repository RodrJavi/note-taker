// Import Express.js
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

const uuid = require("./helpers/uuid");
const notes = require("./db/db.json");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("public/index.html"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => res.json(notes));

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    const noteString = JSON.stringify(newNote);

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      const parsedNotes = JSON.parse(data);
      parsedNotes.push(newNote);

      fs.writeFile("./db/db.json", JSON.stringify(parsedNotes), (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info("Successfully updated reviews!")
      );
    });
    // console.info(newNote);
    // res.json(newNote);
  }
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);