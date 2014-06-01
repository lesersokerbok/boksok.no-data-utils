'use strict';

var fs = require('fs'),
    _ = require('underscore'),
    textCategories = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/TEXT.json')),
    menuLinks = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/MENU_LINK.json')),
    menuItems = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/MENU.json')),
    contentItems = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/CONTENT.json')),
    imageItems = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/IMAGES.json'));

function preprocess(value) {
    if (value === 'NULL')
        return undefined;

    return value
}

function supportCategoryForBook(bookID) {

    // construct topMenuItems for this book
    // a topMenuItem is
    // 1. a menu item whose ('PARENT_ID' == 'NULL')
    // 2. the parent of a menu item

    var topMenuItems = _.chain(menuLinks)
        .where({ "DOC_ID": bookID })
        .pluck('MENU_ID')
        .map(function (menuId) {
            return _.findWhere(menuItems, { "MENU_ID": menuId });
        })
        .map(function (menuItem) {
            if (menuItem["PARENT_ID"] == 'NULL') {
                return menuItem;
            } else {
                return _.findWhere(menuItems, { "MENU_ID": parseInt(menuItem["PARENT_ID"], 10) });
            }
        })
        .filter(function (menuItem) {
            return menuItem !== undefined;
        })
        .uniq()
        .value();

    // determine what to return

    if (topMenuItems.length === 0 || topMenuItems[0] === undefined) {
        // no topMenuItems
        // this is an error an should be logged to file
        console.log('ERROR_MISSING_SUPPORT_CATEGORY_BOOK_ID: ' + bookID);
        return 'ERROR_MISSING_SUPPORT_CATEGORY';

    } else if (topMenuItems.length == 1) {
        // only one topMenuItem, return its name property
        return _.first(topMenuItems)["NAME"];
        // return _.chain(topMenuItems).first().value()["TEXT1"];
    } else {
        // multiple topMenuItems, determine which one to chose
        // then return its text property

        // this is a special case, so we log it to file
        console.log('INFO_MULTIPLE_TOP_MENU_ITEMS_BOOK_ID: ' + bookID);

        return _.chain(topMenuItems)
            .sortBy(function (menuItem) {
                // sort the topMenuItems by this special function
                return [7,5,8,6,4,3].indexOf(menuItem["MENU_ID"]);
            })
            .pluck("NAME")
            .first()
            .value();
    }
}

function imageObjectForBook(bookID) {
    var imageItem = _.findWhere(imageItems, { "DOC_ID": bookID });

    if (imageItem === undefined)
        return undefined;

    var url = "http://www.boksok.no/thumb.aspx?file=upload_images/"
        + imageItem.object_id
        + "."
        + imageItem.EXTENTION
        + "&height="
        + imageItem.actual_height
        + "&width="
        + imageItem.actual_width;

    return {
        url: url
    };
}

function contentForBook(bookID) {
    var contentItem = _.findWhere(contentItems, { "CONTENT_TYPE_ID": bookID });
    return contentItem !== undefined ? contentItem["CONTENT"] : undefined;
}

function tagsArrayFromItemCategory(itemCat, bookID, lsbCatKey) {

    if (itemCat === '' || itemCat === 'NULL')
        return [];

    itemCat = itemCat.trim();

    return _.chain(itemCat.split(','))
        .map(function (id) {
            return _.findWhere(textCategories, { "TEXT_ID": parseInt(id, 10) });
        })
        .map(function (category) {
            return category['TEXT1'];
        })
        .map(function (categoryText) {
            if (categoryText.indexOf('/') > -1) {
                console.log('INFO_' + lsbCatKey + '_CAT_VALUE_SPLIT_BY_/_BOOKID: ' + bookID);
            }

            return categoryText.split('/');
        })
        .flatten()
        .map(function (categoryText) {
            if (categoryText.indexOf('&') > -1) {
                console.log('INFO_LSB_' + lsbCatKey + '_CAT_VALUE_SPLIT_BY_&_BOOKID: ' + bookID);
            }

            return categoryText.split('&');
        })
        .flatten()
        .map(function (category) {
            return category.toLowerCase();
        }).value();
}

function tagsArrayFromMenuLink(bookID) {

    return _.chain(menuLinks)
        .where({ "DOC_ID": bookID })
        .pluck('MENU_ID')
        .map(function (menuId) {
            return _.findWhere(menuItems, { "MENU_ID": menuId });
        })
        .map(function (menuItem) {
            return menuItem['NAME'];
        })
        .map(function (menuItemName) {
            return menuItemName.trim();
        })
        .map(function (menuItemName) {
            if (menuItemName.indexOf('/') > -1) {
                console.log('INFO_LSB_CUSTOMIZATION_VALUE_SPLIT_BY_/_BOOKID: ' + bookID);
            }

            return menuItemName.split('/');
        })
        .flatten()
        .map(function (menuItemName) {
            if (menuItemName.indexOf('&') > -1) {
                console.log('INFO_LSB_CUSTOMIZATION_VALUE_SPLIT_BY_&_BOOKID: ' + bookID);
            }

            return menuItemName.split('&');
        })
        .flatten()
        .map(function (menuItemName) {
            return menuItemName.toLowerCase();
        })
        .value();
}

fs.readFile('./original-data/JSON-FROM-CSV/DOC.json', function (err, data) {

    var list = JSON.parse(data);

    var books = [];

    for (var i = 0; i<list.length; i++) {
        var item = list[i],
            book = {};

        book.id = preprocess(item['DOC_ID']); // not needed for import later?
        book.title = preprocess(item['TITLE']);
        book.lsb_review = contentForBook(book.id);
        book.lsb_quote = preprocess(item['CUSTOM_INGRESS']);
        book.excerpt = preprocess(item['INGRESS']);
        book.lsb_author = preprocess(item['CUSTOM_AUTHOR']);
        book.lsb_illustrator = preprocess(item['CUSTOM_ILLUSTRATOR']);
        // book.lsb_translator = preprocess(item['CUSTOM_TRANSLATION']);
        book.lsb_publisher = preprocess(item['CUSTOM_PUBLISHING_HOUSE']);
        book.lsb_published_year = preprocess(item['CUSTOM_YEAR']);
        book.lsb_isbn = preprocess(item['CUSTOM_ISBN']);
        book.lsb_pages = preprocess(item['CUSTOM_PAGES']);

        book.lsb_supported = preprocess(item['CUSTOM_SUPPORTS_LSB']) == '1';
        if (book.lsb_supported) {
            book.lsb_support_cat = supportCategoryForBook(book.id);
        }

        book.lsb_age = tagsArrayFromItemCategory(item['CUSTOM_CAT_1'], book.id, 'LSB_AGE');
        // book.lsb_extra = tagsArrayFromItemCategory(item['CUSTOM_CAT_2'], book.id, 'LSB_EXTRA');
        book.lsb_genre = tagsArrayFromItemCategory(item['CUSTOM_CAT_3'], book.id, 'LSB_GENRE');
        book.lsb_topic = tagsArrayFromItemCategory(item['CUSTOM_CAT_4'], book.id, 'LSB_TOPIC');
        book.lsb_language = tagsArrayFromItemCategory(item['CUSTOM_CAT_5'], book.id, 'LSB_LANGUAGE');

        book.lsb_customization = tagsArrayFromMenuLink(book.id);

        //     var imageObject = imageObjectForBook(book.id);
        //
        //     if (imageObject !== undefined)
        //         book.coverImageUrl = imageObject.url;

        books.push(book);
    }

    fs.writeFile('./output-example/test-json-conversion.json', JSON.stringify(books, null, 4), function (err) {
        if (err)
            console.log(err);
    });

});
