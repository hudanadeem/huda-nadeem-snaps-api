import express from "express";
import cors from "cors";
import "dotenv/config";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";

const FILE_PATH_PHOTOS = "./data/photos.json";
const FILE_PATH_TAGS = "./data/tags.json";

const app = express();
const { CORS_ORIGIN } = process.env;
const port = process.env.PORT || process.argv[2] || 8080;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Read data from JSON files
const photosFile = fs.readFileSync(FILE_PATH_PHOTOS);
const tagsFile = fs.readFileSync(FILE_PATH_TAGS);

const photos = JSON.parse(photosFile);
const tags = JSON.parse(tagsFile);

// Get photos array
app.get("/photos", (req, res) => {
  res.json(photos);
});

// Get a single photo by id
app.get("/photos/:id", (req, res) => {
  const photo = photos.find((p) => p.id === req.params.id);
  res.json(photo);
});

// Get comments for a single photo by id
app.get("/photos/:id/comments", (req, res) => {
  const photo = photos.find((p) => p.id === req.params.id);
  res.json(photo.comments || []);
});

// Post a comment for a single photo by id
app.post("/photos/:id/comments", (req, res) => {
  const { name, comment } = req.body;
  const photo = photos.find((p) => p.id === req.params.id);

  const newComment = {
    id: uuidv4(),
    name,
    comment,
    date: new Date(),
  };

  photo.comments.push(newComment);
  res.json(newComment);
});

// Get tags in an array
app.get("/tags", (req, res) => {
  res.json(tags);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
