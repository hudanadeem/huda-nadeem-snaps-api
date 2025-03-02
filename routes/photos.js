import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs";

const photo_router = express.Router();
const FILE_PATH_PHOTOS = "./data/photos.json";

const photos = JSON.parse(fs.readFileSync(FILE_PATH_PHOTOS));

photo_router.get("/", (req, res) => {
  res.json(photos);
});

photo_router.get("/:id", (req, res) => {
  const photo = photos.find((p) => p.id === req.params.id);
  if (!photo) {
    return res.status(404).json({ error: "Photo not found" });
  }
  res.json(photo);
});

photo_router.get("/:id/comments", (req, res) => {
  const photo = photos.find((p) => p.id === req.params.id);
  if (!photo) {
    return res.status(404).json({ error: "Photo not found" });
  }
  res.json(photo.comments || []);
});

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
    timestamp: new Date().getTime(),
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
