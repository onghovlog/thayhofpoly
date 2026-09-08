const express = require('express');
const router = express.Router();
const { getPlaylist } = require('../controllers/youtubeController');

router.get('/playlist/:playlistId', getPlaylist);

module.exports = router;
