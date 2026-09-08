const express = require('express');
const router = express.Router();
const { getVideoInfo, getPlaylistInfo, getPlaylist } = require('../controllers/youtubeController');

router.get('/video-info', getVideoInfo);
router.get('/playlist-info', getPlaylistInfo);
router.get('/playlist/:playlistId', getPlaylist);

module.exports = router;
