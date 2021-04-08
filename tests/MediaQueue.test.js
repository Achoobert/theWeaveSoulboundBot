import MediaQueue from '../src/MediaQueue'
import { VoiceChannel } from '../src/ChatRoom'
import Stream  from 'stream';

describe('Media Queue', () => {
  let queue;
  let voiceChannel;

  beforeEach(() => {
    queue = new MediaQueue();
    voiceChannel = new VoiceChannel(jest.fn());
  })

  test('Adding to Queue', () => {
    expect(queue.size()).toEqual(0);

    queue.addStream(new Stream.Readable());
    queue.addStream(new Stream.Readable());
    queue.addStream(new Stream.Readable());

    expect(queue.size()).toEqual(3);
  })

  test('Skipping item in queue should end the current stream and play the next', () => {
    expect(queue.size()).toEqual(0);
    const firstStream = new Stream.Readable();

    queue.addStream(firstStream);
    queue.addStream(new Stream.Readable());

    queue.play(voiceChannel);

    expect(voiceChannel.streamAudio).toBeCalledTimes(1);
    queue.skip();
    expect(voiceChannel.streamAudio).toBeCalledTimes(2);
    //We're at the end of the queue, skipping again shouldn't trigger anything
    queue.skip();
    expect(voiceChannel.streamAudio).toBeCalledTimes(2);

    //Adding a new song should play again since the queue has been played
    queue.addStream(firstStream);
    expect(voiceChannel.streamAudio).toBeCalledTimes(3);
  })

  test('Playing a queue should join a VoiceChannel and stream queue in order', () => {
    const streams = [
      new Stream.Readable(),
      new Stream.Readable(),
      new Stream.Readable()
    ];

    streams.forEach((stream) => {
      queue.addStream(stream);
    })

    queue.play(voiceChannel);

    let expectedStreamCounter = 1;
    streams.forEach((stream) => {
      expect(voiceChannel.streamAudio).toBeCalledTimes(expectedStreamCounter);
      expect(voiceChannel.streamAudio).toBeCalledWith(stream);
      stream.emit('close');
      expectedStreamCounter++;
    })
  })
})