const snappy = require('snappy');

const compressData = async (data) => {
	return await snappy.compress(data)
};

const uncompressData = async (compressedData) => {
	return await snappy.uncompress(compressedData);
};
module.exports = {
	compressData,
	uncompressData
}