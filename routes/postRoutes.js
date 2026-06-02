const express = require("express");
const multer = require("multer");

const {
  getPosts,
  uploadPost,
  deletePost,
  likePost,
  dislikePost,
  addComment,
  deleteComment,
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", authMiddleware, getPosts);

router.post("/upload", authMiddleware, upload.single("image"), uploadPost);

router.delete("/:id", authMiddleware, deletePost);

router.post("/:id/like", likePost);

router.post("/:id/dislike", dislikePost);

router.post("/:id/comments", addComment);

router.delete("/:postId/comments/:commentId", deleteComment);

module.exports = router;
