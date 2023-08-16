const events = require('events').EventEmitter;
const eventEmitter = new events();

var Queue = require('bull');
var ffmpeg = require('fluent-ffmpeg');
const videoProccessingQueue = new Queue('videoProccessingQueue');

eventEmitter.on('startProcess', (data) => {
  myFirstQueue.add(
    {
      url: data.url,
      size: data.size,
      outputdir: data.outputdir,
      lecture: '',
    },
    {}
  );
});

videoProccessingQueue.process(async (job) => {
  const { data } = job;
  ffmpeg(data.url)
    .videoCodec('libx264')
    .size(data.size)
    .output(data.outputdir)
    .screenshots({
      count: 8,
      folder: 'screenshots',
      filename: `thumb-%s-second.png`,
    })
    .on('progress', (progress) => {
      console.log('Processing: ' + Math.round(progress.percent) + '% done');
    })
    .on('screenshot', () => {
      console.log('screen shot taken');
    })
    .run();
});

videoProccessingQueue.on('active', (job) => {
  console.log('job is active');
});
module.exports = eventEmitter;
