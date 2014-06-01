'use strict';

var fs = require('fs'),
    _ = require('underscore'),
    textCategories = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/TEXT.json')),
    menuLinks = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/MENU_LINK.json')),
    menuItems = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/MENU.json')),
    contentItems = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/CONTENT.json'));

function preprocess(value) {
    if (value === 'NULL')
        return undefined;

    return value
}

function contentForBook(bookID) {
    var contentItem = _.findWhere(contentItems, { "CONTENT_TYPE_ID": bookID });
    return contentItem !== undefined ? contentItem["CONTENT"] : undefined;
}

function arrayFromItemCategory(itemCat) {

    if (itemCat === '' || itemCat === 'NULL')
        return [];

    var ids,
        categories = [];

    if (itemCat.indexOf(',') > -1)
        ids = itemCat.split(',');
    else
        ids = [ itemCat ];


    _.each(ids, function (id) {

        _.each(textCategories, function (cat) {
            if (cat['TEXT_ID'] == id) {
                categories.push(cat['TEXT1']);
            }

        });

    });

    return categories;
}

function arrayFromMenuLink(docID) {
    var menuIds = [],
        menuItemTags = [];

    _.each(menuLinks, function (link) {
        if (link['DOC_ID'] == docID) {
            menuIds.push(link['MENU_ID']);
        }
    });

    _.each(menuIds, function (menuId) {

        _.each(menuItems, function (menuItem) {
            if (menuItem['MENU_ID'] == menuId) {
                menuItemTags.push(menuItem['NAME']);
            }
        });

    });

    return menuItemTags;
}

fs.readFile('./original-data/JSON-FROM-CSV/DOC.json', function (err, data) {

    var list = JSON.parse(data);

    var books = [];

    for (var i = 0; i<list.length; i++) {
        var item = list[i],
            book = {
                id: preprocess(item['DOC_ID']),
                title: preprocess(item['TITLE']),
                description: preprocess(item['INGRESS']),
                longDescription: preprocess(item['CUSTOM_INGRESS']),
                author: preprocess(item['CUSTOM_AUTHOR']),
                illustrator: preprocess(item['CUSTOM_ILLUSTRATOR']),
                translation: preprocess(item['CUSTOM_TRANSLATION']),
                publishingHouse: preprocess(item['CUSTOM_PUBLISHING_HOUSE']),
                publishingYear: preprocess(item['CUSTOM_YEAR']),
                ISBN: preprocess(item['CUSTOM_ISBN']),
                numberOfPages: preprocess(item['CUSTOM_PAGES']),
                supportsLSB: preprocess(item['CUSTOM_SUPPORTS_LSB']),
                tags: _.flatten([
                    arrayFromItemCategory(item['CUSTOM_CAT_1']),
                    arrayFromItemCategory(item['CUSTOM_CAT_2']),
                    arrayFromItemCategory(item['CUSTOM_CAT_3']),
                    arrayFromItemCategory(item['CUSTOM_CAT_4']),
                    arrayFromItemCategory(item['CUSTOM_CAT_5']),
                ])
            };

        if (book.id) {
            book.tags = _.flatten([
                book.tags,
                arrayFromMenuLink(book.id)
            ]);

            book.content = contentForBook(book.id);
        }

        books.push(book);
    }

    fs.writeFile('./output-example/test-json-conversion.json', JSON.stringify(books, null, 4), function (err) {
        if (err)
            console.log(err);
    });

});
