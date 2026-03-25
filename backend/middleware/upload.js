const multer = require("multer");

const storage = multer.memoryStorage(); // ✅ use memory instead of disk

const upload = multer({ storage });

module.exports = upload;