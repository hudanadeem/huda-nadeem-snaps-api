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
  if (!photo) {
    return res.status(404).json({ error: "Photo not found" });
  }
  res.json(photo);
});

// Get comments for a single photo by id
app.get("/photos/:id/comments", (req, res) => {
  const photo = photos.find((p) => p.id === req.params.id);
  if (!photo) {
    return res.status(404).json({ error: "Photo not found" });
  }
  res.json(photo.comments || []);
});

// Post a comment for a single photo by id
app.post("/photos/:id/comments", (req, res) => {
  
    const { name, comment } = req.body;  
    const photo = photos.find((p) => p.id === req.params.id);
  
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
  
    const newComment = {
      id: uuidv4(),
      name,
      comment,
      date: new Date().toISOString(),
    };
  
    photo.comments = photo.comments || [];
    photo.comments.push(newComment);
  
    try {
      fs.writeFileSync(FILE_PATH_PHOTOS, JSON.stringify(photos, null, 2));
    } catch (error) {
      console.error("Error saving file:", error);
    }
  
    res.status(201).json(newComment);
  });
  

// Get tags in an array
app.get("/tags", (req, res) => {
  res.json(tags);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
