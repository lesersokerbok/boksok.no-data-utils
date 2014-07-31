'use strict';

var fs = require('fs'),
    tablesToJSON = require('../lib/tables-to-json.js'),
    textCategories = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/TEXT.json')),
    menuLinks = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/MENU_LINK.json')),
    menuItems = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/MENU.json')),
    contentItems = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/CONTENT.json'));



fs.readFile('./original-data/JSON-FROM-CSV/DOC.json', function (err, data) {

    var list = JSON.parse(data);

    var books = tablesToJSON.convertToJSON(list, textCategories, menuLinks, menuItems, contentItems);

    fs.writeFile('./output-example/test-json-conversion.json', JSON.stringify(books, null, 4), function (err) {
        if (err)
            console.log(err);
    });

});
