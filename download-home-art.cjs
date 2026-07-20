const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, 'sophkatsivelos-static', 'public', 'art');
fs.mkdirSync(out, { recursive: true });
const files = {
  'p5.min.js': 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.8.0/p5.min.js',
  'main.js': 'https://sophkatsivelos.neocities.org/main.js',
  'tentacle.js': 'https://sophkatsivelos.neocities.org/tentacle.js',
  'bell.js': 'https://sophkatsivelos.neocities.org/bell.js',
  'smallCircleSpawner.js': 'https://sophkatsivelos.neocities.org/smallCircleSpawner.js',
};
(async()=>{for(const [name,url] of Object.entries(files)){const response=await fetch(url);if(!response.ok)throw new Error(`${url}: ${response.status}`);fs.writeFileSync(path.join(out,name),Buffer.from(await response.arrayBuffer()));}})();
