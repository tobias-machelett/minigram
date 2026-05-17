const pool = require("../config/db");
const s3 = require("../config/s3");

const getPosts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.image_url,
        p.created_at,
        p.user_id,
        COALESCE(p.likes, 0) AS likes,
        COALESCE(p.dislikes, 0) AS dislikes,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', c.id,
                'comment_text', c.comment_text,
                'created_at', c.created_at
              )
              ORDER BY c.created_at ASC
            )
            FROM comments c
            WHERE c.post_id = p.id
          ),
          '[]'
        ) AS comments
      FROM posts p
      ORDER BY p.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error en getPosts:", err);
    res.status(500).send("Error obteniendo posts");
  }
};

const uploadPost = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No se recibió ninguna imagen");
  }

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: Date.now() + "-" + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const result = await s3.upload(params).promise();
    const imageUrl = result.Location;

    await pool.query(
      "INSERT INTO posts (image_url, likes, dislikes, user_id) VALUES ($1, 0, 0, $2)",
      [imageUrl, req.user.id]
    );

    res.send({ url: imageUrl });
  } catch (err) {
    console.error("Error en uploadPost:", err);
    res.status(500).send("Error subiendo imagen");
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT image_url FROM posts WHERE id = $1",
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Post no encontrado");
    }

    const imageUrl = result.rows[0].image_url;

    if (imageUrl.includes(".amazonaws.com/")) {
      const fileKey = decodeURIComponent(imageUrl.split(".amazonaws.com/")[1]);

      if (fileKey) {
        await s3.deleteObject({
          Bucket: process.env.S3_BUCKET,
          Key: fileKey,
        }).promise();
      }
    }

    await pool.query("DELETE FROM posts WHERE id = $1", [postId]);

    res.send({ message: "Post eliminado correctamente" });
  } catch (err) {
    console.error("Error en deletePost:", err);
    res.status(500).send("Error eliminando post");
  }
};

const likePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING likes, dislikes",
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Post no encontrado");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en likePost:", err);
    res.status(500).send("Error dando like");
  }
};

const dislikePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE posts SET dislikes = COALESCE(dislikes, 0) + 1 WHERE id = $1 RETURNING likes, dislikes",
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Post no encontrado");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en dislikePost:", err);
    res.status(500).send("Error dando dislike");
  }
};

const addComment = async (req, res) => {
  const postId = req.params.id;
  const { comment_text } = req.body;

  if (!comment_text || comment_text.trim() === "") {
    return res.status(400).send("El comentario no puede estar vacío");
  }

  try {
    const postExists = await pool.query(
      "SELECT id FROM posts WHERE id = $1",
      [postId]
    );

    if (postExists.rows.length === 0) {
      return res.status(404).send("Post no encontrado");
    }

    const result = await pool.query(
      "INSERT INTO comments (post_id, comment_text) VALUES ($1, $2) RETURNING id, post_id, comment_text, created_at",
      [postId, comment_text.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error en addComment:", err);
    res.status(500).send("Error agregando comentario");
  }
};

const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM comments WHERE id = $1 AND post_id = $2 RETURNING id",
      [commentId, postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Comentario no encontrado");
    }

    res.send({ message: "Comentario eliminado correctamente" });
  } catch (err) {
    console.error("Error en deleteComment:", err);
    res.status(500).send("Error eliminando comentario");
  }
};

module.exports = {
  getPosts,
  uploadPost,
  deletePost,
  likePost,
  dislikePost,
  addComment,
  deleteComment,
};
