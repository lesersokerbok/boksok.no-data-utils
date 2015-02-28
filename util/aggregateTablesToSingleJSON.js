'use strict';

var fs = require('fs'),
    tablesToJSON = require('../lib/tables-to-json.js'),
    textCategories = JSON.parse(fs.readFileSync('./input/01-15/JSON-FROM-CSV/TEXT.json')),
    menuLinks = JSON.parse(fs.readFileSync('./input/01-15/JSON-FROM-CSV/MENU_LINK.json')),
    menuItems = JSON.parse(fs.readFileSync('./input/01-15/JSON-FROM-CSV/MENU.json')),
    contentItems = JSON.parse(fs.readFileSync('./input/01-15/JSON-FROM-CSV/CONTENT.json'));



fs.readFile('./input/01-15/JSON-FROM-CSV/DOC.json', function (err, data) {

    var list = JSON.parse(data);

    var books = tablesToJSON.convertToJSON(list, textCategories, menuLinks, menuItems, contentItems);

    fs.writeFile('./output/01-15/test-json-conversion.json', JSON.stringify(books, null, 4), function (err) {
        if (err)
            console.log(err);
    });

});
