const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

const uuid = require("./helpers/uuid");
const notes = require("./db/notes.json");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("public/index.html"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/notes.json", "utf8", (err, data) => {
    const parsedNotes = JSON.parse(data);
    res.json(parsedNotes);
  });
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile("./db/notes.json", "utf8", (err, data) => {
      const parsedNotes = JSON.parse(data);
      parsedNotes.push(newNote);

      fs.writeFile("./db/notes.json", JSON.stringify(parsedNotes), (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info("Successfully updated notes!")
      );
    });

    const response = {
      status: "success",
      body: newNote,
    };
    res.json(response);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
