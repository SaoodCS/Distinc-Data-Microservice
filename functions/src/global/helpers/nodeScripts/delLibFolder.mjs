import fs from 'fs-extra';

const filePath = 'lib';
fs.removeSync(filePath);
console.log('Deleted lib build folder...');
