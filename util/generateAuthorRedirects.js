'use strict';

var fs = require('fs'),
    _ = require('underscore');


fs.readFile('./original-data/JSON-FROM-CSV/DOC.json', function (err, data) {

    var books = JSON.parse(data);

    _.each(books, function (book) {

        var authorString = book["CUSTOM_AUTHOR"],
            authorMatch = authorString,
            authorTarget = authorString,
            appendString = "";

        authorMatch = authorMatch.replace(/\s/g, "%20");

        authorTarget = authorTarget.replace(/og/g, "");
        authorTarget = authorTarget.replace(/,/g, "");
        authorTarget = authorTarget.replace(/\s+/g, "+");

        appendString += "RewriteCond %{QUERY_STRING} view=search&author=" + authorMatch + "\n",
        appendString += "RewriteRule ^default\\.aspx /search/" + authorTarget + "? [NC,L,R=301]\n";

        fs.appendFileSync('./output-example/author-redirects.txt', appendString);

        console.log("Append redirect rewrite rule for author: " + authorString);

    });
});
