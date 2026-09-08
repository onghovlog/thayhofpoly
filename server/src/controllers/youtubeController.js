const { getVideoDetails, getPlaylistDetails } = require('../services/youtubeService');
const { sendResponse, sendError } = require('../utils/helpers');

/**
 * @desc    Lấy thông tin video YouTube từ URL hoặc ID (cho form thêm/sửa bài học)
 * @route   GET /api/youtube/video-info
 * @access  Public
 */
const getVideoInfo = async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return sendError(res, 400, 'Vui lòng cung cấp link hoặc ID video YouTube qua tham số ?url=');
    }

    const data = await getVideoDetails(url);
    return sendResponse(res, 200, data, 'Lấy thông tin video thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy danh sách video từ Playlist YouTube (cho chức năng nạp hàng loạt bài học)
 * @route   GET /api/youtube/playlist-info
 * @access  Public
 */
const getPlaylistInfo = async (req, res, next) => {
  try {
    const { url, playlistId } = req.query;
    const input = url || playlistId;

    if (!input) {
      return sendError(res, 400, 'Vui lòng cung cấp Playlist URL hoặc ID qua tham số ?url=');
    }

    const data = await getPlaylistDetails(input);
    return sendResponse(res, 200, data, 'Lấy thông tin playlist thành công');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết playlist YouTube theo param (giữ tương thích ngược)
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
  getVideoInfo,
  getPlaylistInfo,
  getPlaylist,
};
