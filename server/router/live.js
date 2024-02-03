const { addLive } = require("../controller/live");
const express = require('express');

const router = express.Router();

router.post('/live/new', addLive);

module.exports = router;
