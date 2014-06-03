'use strict';

var fs = require('fs'),
    _ = require('underscore'),
    async = require('async'),
    request = require('request'),
    images = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/IMAGES.json'));

function download(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}

async.eachSeries(images, function (image, callback) {
    var url = 'http://www.boksok.no/thumb.aspx?file=upload_images/'
        + image.object_id
        + '.'
        + image.EXTENTION
        + '&width=1024';

    download(url, './output-example/images/'
        + image.object_id
        + '.'
        + image.EXTENTION, function () {

        console.log("Finished downloading " + url);

        callback();
    });
}, function (err) {
    if (err) {
        console.log('An image failed to download.');
    } else {
        console.log('All images downloaded successfully.');
    }
});
