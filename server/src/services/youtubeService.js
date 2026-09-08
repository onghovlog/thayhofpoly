/**
 * Service xử lý tích hợp YouTube Data API v3 & Fallback
 */

const getPlaylistDetails = async (playlistId) => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  const defaultResult = {
    playlistId,
    title: 'YouTube Playlist',
    description: 'Danh sách bài học trên kênh YouTube',
    thumbnail: `https://i.ytimg.com/vi_webp/${playlistId}/maxresdefault.webp`,
    videoCount: 0,
    embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`,
    items: [],
  };

  if (!playlistId) {
    throw new Error('Playlist ID không được để trống');
  }

  // Nếu không có API Key, trả về cấu trúc fallback hoàn chỉnh
  if (!apiKey) {
    return {
      ...defaultResult,
      isFallback: true,
      message: 'Đang hiển thị chế độ nhúng trực tiếp (Không yêu cầu YouTube API Key)',
    };
  }

  try {
    // 1. Lấy thông tin Playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${apiKey}`;
    const playlistRes = await fetch(playlistUrl);
    const playlistData = await playlistRes.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      return {
        ...defaultResult,
        isFallback: true,
        message: 'Không tìm thấy playlist trên YouTube API hoặc playlist ở chế độ riêng tư',
      };
    }

    const snippet = playlistData.items[0].snippet;
    const contentDetails = playlistData.items[0].contentDetails;

    // 2. Lấy danh sách video trong playlist (tối đa 50 video đầu tiên)
    const itemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    const itemsRes = await fetch(itemsUrl);
    const itemsData = await itemsRes.json();

    const videoItems = (itemsData.items || [])
      .filter((item) => item.snippet && item.snippet.title !== 'Private video')
      .map((item, index) => ({
        order: index + 1,
        title: item.snippet.title,
        description: item.snippet.description,
        videoId: item.contentDetails.videoId,
        thumbnail:
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url ||
          `https://i.ytimg.com/vi/${item.contentDetails.videoId}/hqdefault.jpg`,
        videoUrl: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${item.contentDetails.videoId}`,
      }));

    return {
      playlistId,
      title: snippet.title,
      description: snippet.description,
      thumbnail:
        snippet.thumbnails?.maxres?.url ||
        snippet.thumbnails?.high?.url ||
        snippet.thumbnails?.medium?.url,
      videoCount: contentDetails.itemCount || videoItems.length,
      embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`,
      items: videoItems,
      isFallback: false,
    };
  } catch (error) {
    console.error(`[YouTube API Service Error] ${error.message}`);
    return {
      ...defaultResult,
      isFallback: true,
      message: 'Không thể kết nối YouTube API, chuyển sang chế độ embed tiêu chuẩn',
    };
  }
};

module.exports = {
  getPlaylistDetails,
};
