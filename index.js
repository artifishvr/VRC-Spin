import { Client, Message } from 'node-osc';

import {playAudioFile} from 'audic';

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('Starting...');
(async () => {

  console.log('spin spin spin spin');
  playAudioFile('intro.mp3');
  await timeout(2187);
  
  const client = new Client('127.0.0.1', 9000);

  client.send('/input/LookHorizontal', 1, () => { });

  console.log('lets go!');
  while (true) {
    playAudioFile('spinloop.mp3');
    await timeout(16999);
  };
})();
