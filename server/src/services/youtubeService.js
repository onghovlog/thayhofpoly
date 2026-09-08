const { parseYoutubeVideoId, parseYoutubePlaylistId } = require('../utils/helpers');

/**
 * Lấy thông tin chi tiết của 1 video YouTube (tiêu đề, thumbnail, duration, embedUrl)
 */
const getVideoDetails = async (videoUrlOrId) => {
  const videoId = parseYoutubeVideoId(videoUrlOrId);

  if (!videoId) {
    throw new Error('Không thể nhận diện Video ID từ link YouTube cung cấp');
  }

  const defaultThumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const defaultResult = {
    videoId,
    title: `Bài giảng Video (${videoId})`,
    thumbnail: defaultThumbnail,
    duration: '15:00',
    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    fileName: '',
    fileUrl: '',
  };

  try {
    // 1. Thử lấy thông tin chính xác từ YouTube oEmbed API (không cần API Key)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl, { signal: AbortSignal.timeout(4000) });

    if (response.ok) {
      const data = await response.json();
      return {
        ...defaultResult,
        title: data.title || defaultResult.title,
        thumbnail: data.thumbnail_url || defaultThumbnail,
      };
    }
  } catch (err) {
    console.warn(`[YouTube oEmbed Notice] Sử dụng fallback cho video ${videoId}:`, err.message);
  }

  return defaultResult;
};

/**
 * Lấy chi tiết Playlist YouTube và danh sách bài học
 */
const getPlaylistDetails = async (playlistUrlOrId) => {
  const playlistId = parseYoutubePlaylistId(playlistUrlOrId);
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!playlistId) {
    throw new Error('Playlist ID không được để trống');
  }

  const defaultResult = {
    playlistId,
    title: 'YouTube Playlist',
    description: 'Danh sách bài học trên kênh YouTube',
    thumbnail: `https://i.ytimg.com/vi/${playlistId}/hqdefault.jpg`,
    videoCount: 0,
    embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`,
    items: [],
  };

  // 1. Nếu có API Key, truy vấn YouTube Data API v3
  if (apiKey) {
    try {
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${apiKey}`;
      const playlistRes = await fetch(playlistUrl, { signal: AbortSignal.timeout(5000) });
      const playlistData = await playlistRes.json();

      if (playlistData.items && playlistData.items.length > 0) {
        const snippet = playlistData.items[0].snippet;
        const contentDetails = playlistData.items[0].contentDetails;

        const itemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
        const itemsRes = await fetch(itemsUrl, { signal: AbortSignal.timeout(5000) });
        const itemsData = await itemsRes.json();

        const videoItems = (itemsData.items || [])
          .filter((item) => item.snippet && item.snippet.title !== 'Private video')
          .map((item, index) => {
            const vid = item.contentDetails.videoId;
            return {
              order: index + 1,
              title: item.snippet.title,
              videoId: vid,
              thumbnail:
                item.snippet.thumbnails?.medium?.url ||
                item.snippet.thumbnails?.high?.url ||
                `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
              duration: '15:00',
              youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
              embedUrl: `https://www.youtube-nocookie.com/embed/${vid}`,
              fileName: '',
              fileUrl: '',
            };
          });

        return {
          playlistId,
          title: snippet.title,
          description: snippet.description,
          thumbnail:
            snippet.thumbnails?.maxres?.url ||
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.medium?.url ||
            (videoItems[0]?.thumbnail || defaultResult.thumbnail),
          videoCount: contentDetails.itemCount || videoItems.length,
          embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`,
          items: videoItems,
          isFallback: false,
        };
      }
    } catch (error) {
      console.warn(`[YouTube API Warning] ${error.message}`);
    }
  }

  // 2. Không có API Key hoặc API Key lỗi: Tự động trích xuất trực tiếp từ public page HTML
  try {
    const pageUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
    const pageRes = await fetch(pageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'vi,en;q=0.9',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (pageRes.ok) {
      const html = await pageRes.text();
      let videoList = [];

      // Phân tích ytInitialData JSON
      const jsonMatch =
        html.match(/ytInitialData\s*=\s*({.+?});\s*<\/script>/) ||
        html.match(/var ytInitialData = ({.+?});/);

      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          const findRenderers = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            if (obj.playlistVideoRenderer) {
              const r = obj.playlistVideoRenderer;
              const vid = r.videoId;
              if (vid) {
                const title =
                  r.title?.runs?.[0]?.text ||
                  r.title?.simpleText ||
                  `Bài học ${videoList.length + 1}`;
                const duration = r.lengthText?.simpleText || '15:00';
                const thumb =
                  r.thumbnail?.thumbnails?.slice(-1)[0]?.url ||
                  `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;

                videoList.push({
                  order: videoList.length + 1,
                  videoId: vid,
                  title,
                  duration,
                  thumbnail: thumb,
                  youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
                  embedUrl: `https://www.youtube-nocookie.com/embed/${vid}`,
                  fileName: '',
                  fileUrl: '',
                });
              }
              return;
            }
            for (const k of Object.keys(obj)) {
              findRenderers(obj[k]);
            }
          };
          findRenderers(data);
        } catch (_) {}
      }

      // Regex fallback nếu cần
      if (videoList.length === 0) {
        const vidMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
        const uniqueIds = [...new Set(vidMatches.map((m) => m[1]))].slice(0, 50);

        if (uniqueIds.length > 0) {
          const fetchedVideos = await Promise.all(
            uniqueIds.map(async (vid, idx) => {
              try {
                const oRes = await fetch(
                  `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${vid}&format=json`,
                  { signal: AbortSignal.timeout(3000) }
                );
                if (oRes.ok) {
                  const oData = await oRes.json();
                  return {
                    order: idx + 1,
                    videoId: vid,
                    title: oData.title || `Bài học ${idx + 1}`,
                    thumbnail: oData.thumbnail_url || `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
                    duration: '15:00',
                    youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
                    embedUrl: `https://www.youtube-nocookie.com/embed/${vid}`,
                    fileName: '',
                    fileUrl: '',
                  };
                }
              } catch (_) {}
              return {
                order: idx + 1,
                videoId: vid,
                title: `Bài học ${idx + 1}`,
                thumbnail: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
                duration: '15:00',
                youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
                embedUrl: `https://www.youtube-nocookie.com/embed/${vid}`,
                fileName: '',
                fileUrl: '',
              };
            })
          );
          videoList = fetchedVideos;
        }
      }

      if (videoList.length > 0) {
        return {
          playlistId,
          title: `YouTube Playlist (${videoList.length} bài học)`,
          description: 'Danh sách bài học được nạp tự động từ YouTube',
          thumbnail: videoList[0]?.thumbnail || defaultResult.thumbnail,
          videoCount: videoList.length,
          embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`,
          items: videoList,
          isFallback: false,
        };
      }
    }
  } catch (err) {
    console.warn(`[YouTube Public Scraper Warning] ${err.message}`);
  }

  return {
    ...defaultResult,
    isFallback: true,
    message: 'Đang hiển thị chế độ nhúng trực tiếp',
  };
};

module.exports = {
  getVideoDetails,
  getPlaylistDetails,
};
