const waitOn = require('wait-on');
const { exec } = require('child_process');

const options = { resources: ['http://localhost:3000'] };
let electron;

waitOn(options)
  .then(() => {
    electron = exec('electron .');
    electron.stdout.on('data', console.log);
  })
  .catch(console.error);
