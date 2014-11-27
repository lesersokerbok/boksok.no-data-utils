'use strict';

var fs = require('fs'),
    _ = require('underscore');


fs.readFile('./output-example/test-json-conversion.json', function (err, data) {
    var books = JSON.parse(data);

    _.each(books, function (book) {
        var id = book.id,
            slug = book.slug,
            appendString = "";

        appendString += "RewriteCond %{QUERY_STRING} menu=[0-9]+&id=" + id + "\n",
        appendString += "RewriteRule ^default\\.aspx /bok/" + slug + "/? [NC,L,R=301]\n";

        fs.appendFileSync('./output-example/book-redirects.txt', appendString);

        console.log("Appended redirect rewrite rule for book with id: " + id);

    });
});
