import { Client, Message } from 'node-osc';

import { playAudioFile } from 'audic';

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('Starting...');

const client = new Client('127.0.0.1', 9000);

(async () => {

  console.log('spin spin spin spin');
  playAudioFile('intro.mp3');

  client.send('/input/LookRight', 1, () => {
    client.close();
  });

  await timeout(2187);

  while (true) {
    playAudioFile('spinloop.mp3');
    await timeout(16999);
  };

})();

['SIGINT', 'SIGTERM', 'SIGQUIT']
  .forEach(signal => process.on(signal, async () => {
    client.send('/input/LookRight', 0, () => { });
    console.log("Bye bye!");
    console.log("If you keep spinning, turn OSC off then on again.");
    await timeout(5000);

    process.exit();
  }));
