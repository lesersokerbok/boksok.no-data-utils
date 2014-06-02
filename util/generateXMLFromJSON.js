'use strict';

var fs = require('fs'),
    _ = require('underscore'),
    booksToXML = require('../lib/books-to-xml');


fs.readFile('./output-example/test-json-conversion.json', function (err, data) {

    if (err) {
        console.error(err);
        return -1;
    }

    var books = JSON.parse(data);

    console.log("Number of books to generate XML from: " + books.length);

    booksToXML(books).then(function (xml) {
        fs.writeFile('./output-example/test-books-import-file-generator.xml', xml);
    });

});
