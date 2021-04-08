import MediaFetcher from '../src/MediaFetcher'

describe('Media Fetcher', () => {
  let mediaFetcher;

  beforeEach(() => {
    const fetchYouTube = jest.fn();
    const fetchSoundClound = jest.fn();
    mediaFetcher = new MediaFetcher(fetchYouTube, fetchSoundClound);
  })

  test('youtube urls should be handled by the youtube fetcher', () => {
    const youtubeUrl = 'https://www.youtube.com/watch?v=w2Ov5jzm3j8';

    mediaFetcher.fetchStream(youtubeUrl);

    expect(mediaFetcher.fetchYouTube).toBeCalledWith(youtubeUrl);
    expect(mediaFetcher.fetchSoundCloud).toBeCalledTimes(0);
  });

  test('Non valid media urls should return null', () => {
    const expected = null;
    const result = mediaFetcher.fetchStream('not a valid url');
    
    expect(result).toEqual(expected);
  })
})