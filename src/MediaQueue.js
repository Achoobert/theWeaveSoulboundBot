export default class MediaQueue {
  constructor() {
    this.queue = [];
    this._playingCurrently = null;
    this._currentVc = null;

    this.isPlaying = false;
  }

  size() {
    return this.queue.length;
  }

  addStream(readableStream) {
    this.queue.push(readableStream);
    if(this.isPlaying && !this._playingCurrently){
      this.play(this._currentVc);
    }
  }

  //Alias for next
  skip() {
    this.next();
  }

  next(emit = true) {
    const currentItem = this._playingCurrently;
    if(currentItem && emit) {
      currentItem.emit('end');
      currentItem.emit('close');
    }
    this.queue = this.queue.slice(1);
    if(!this.queue.length){
      this._playingCurrently = null;
    }
  }

  play(voiceChannel) {
    this.isPlaying = true;
    this._currentVc = voiceChannel;

    const currentItem = this.queue[0];
    if(!currentItem) return;
    
    const $this = this;
    if(currentItem !== this._playingCurrently){
      this._playingCurrently = currentItem;
      voiceChannel.streamAudio(currentItem);
      currentItem.on('close', () => {
        $this.next(false);
        $this.play(voiceChannel);
      });
    }
  }
}