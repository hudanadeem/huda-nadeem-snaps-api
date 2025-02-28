import express from "express";
import fs from "node:fs";

const tags_router = express.Router();
const FILE_PATH_TAGS = "./data/tags.json";

const tags = JSON.parse(fs.readFileSync(FILE_PATH_TAGS));

// Get all tags
tags_router.get("/", (req, res) => {
  res.json(tags);
});

export default tags_router;
