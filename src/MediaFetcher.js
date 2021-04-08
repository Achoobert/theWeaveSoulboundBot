export default class MediaFetcher {
  constructor(youtubeFetcher, soundCloudFetcher) {
    this.fetchYouTube = youtubeFetcher;
    this.fetchSoundCloud = soundCloudFetcher;
  }

  fetchStream(url) {
    if(url.indexOf('youtube.com') !== -1) {
      return this.fetchYouTube(url);
    }
    return null;
  }
}