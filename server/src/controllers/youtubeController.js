const { getPlaylistDetails } = require('../services/youtubeService');
const { sendResponse, sendError } = require('../utils/helpers');

/**
 * @desc    Lấy chi tiết playlist YouTube từ API hoặc fallback
 * @route   GET /api/youtube/playlist/:playlistId
 * @access  Public
 */
const getPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;

    if (!playlistId) {
      return sendError(res, 400, 'Playlist ID không được để trống');
    }

    const data = await getPlaylistDetails(playlistId);

    return sendResponse(res, 200, data, 'Lấy thông tin playlist thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlaylist,
};
