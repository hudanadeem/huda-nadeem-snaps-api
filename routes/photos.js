import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs";

const photo_router = express.Router();
const FILE_PATH_PHOTOS = "./data/photos.json";

const photos = JSON.parse(fs.readFileSync(FILE_PATH_PHOTOS));

// Get all photos
photo_router.get("/", (req, res) => {
  res.json(photos);
});

// Get a single photo by id
photo_router.get("/:id", (req, res) => {
  const photo = photos.find((p) => p.id === req.params.id);
  if (!photo) {
    return res.status(404).json({ error: "Photo not found" });
  }
  res.json(photo);
});

// Get comments for a single photo by id
photo_router.get("/:id/comments", (req, res) => {
  const photo = photos.find((p) => p.id === req.params.id);
  if (!photo) {
    return res.status(404).json({ error: "Photo not found" });
  }
  res.json(photo.comments || []);
});

// Post a comment for a single photo by id
photo_router.post("/:id/comments", (req, res) => {
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
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default photo_router;
