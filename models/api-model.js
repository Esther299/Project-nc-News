const fsPromises = require('fs').promises;

exports.selectEndpoint = async () => {
    const data = await fsPromises.readFile('./endpoints.json', 'utf8');
    return JSON.parse(data);
};
