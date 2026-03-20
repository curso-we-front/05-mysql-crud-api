const { Router } = require("express");
const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/articles");
const { validateArticle } = require("../middlewares/validate");

const router = Router();

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", validateArticle, create);
router.put("/:id", validateArticle, update);
router.delete("/:id", remove);

module.exports = router;
