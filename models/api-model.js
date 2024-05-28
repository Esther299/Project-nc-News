const fsPromises = require('fs').promises;

exports.selectEndpoint = async () => {
  try {
    const data = await fsPromises.readFile('./endpoints.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};
