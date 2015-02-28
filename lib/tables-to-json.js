'use strict';

var _ = require('underscore');

function preprocess(value) {
    if (value === 'NULL')
        return undefined;

    return value
}

function supportCategoryForBook(bookID, menuItems, menuLinks) {

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
        //console.log('INFO_MULTIPLE_TOP_MENU_ITEMS_BOOK_ID: ' + bookID);

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

function cleanContent(content) {
    // remove span tags
    content = content.replace(/<\/?span[^>]*>/g, '');

    // remove font tags
    content = content.replace(/<\/?font[^>]*>/g, '');

    // remove <div>&#160;</div>(...)
    content = content.replace(/(<div>&#160;<\/div>\s*)+\s*$/, '');

    // <div>&#160;</div>(...)&#160;</div> -> </div>
    content = content.replace(/(<div>&#160;<\/div>\s*)+\s*&#160;\s*<\/div>\s*$/, '</div>');

    return content;
}

function contentForBook(bookID, contentItems) {
    var contentItem = _.findWhere(contentItems, { "CONTENT_TYPE_ID": bookID });

    if (contentItem === undefined)
        return contentItem;

    return cleanContent(contentItem["CONTENT"]);
}

function tagsArrayFromItemCategory(itemCat, bookID, lsbCatKey, textCategories) {

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
                //console.log('INFO_' + lsbCatKey + '_CAT_VALUE_SPLIT_BY_/_BOOKID: ' + bookID);
            }

            return categoryText.split('/');
        })
        .flatten()
        .map(function (categoryText) {
            if (categoryText.indexOf('&') > -1) {
                //console.log('INFO_LSB_' + lsbCatKey + '_CAT_VALUE_SPLIT_BY_&_BOOKID: ' + bookID);
            }

            return categoryText.split('&');
        })
        .flatten()
        .map(function (categoryText) {
            return categoryText.trim();
        })
        .map(function (categoryText) {
            return categoryText.toLowerCase();
        }).value();
}

function tagsArrayFromMenuLink(bookID, menuItems, menuLinks) {

    return _.chain(menuLinks)
        .where({ "DOC_ID": bookID })
        .pluck('MENU_ID')
        .map(function (menuId) {
            return _.findWhere(menuItems, { "MENU_ID": menuId });
        })
        .filter(function (menuItem) { return menuItem !== undefined} )
        .map(function (menuItem) {
            var result = [
                menuItem['NAME']
            ];

            if (menuItem['PARENT_ID'] !== 'NULL') {
                var parent = _.findWhere(menuItems, { "MENU_ID": parseInt(menuItem["PARENT_ID"], 10) });
                result.push(parent['NAME']);
            }

            return result;
        })
        .flatten()
        .map(function (menuItemName) {
            if (menuItemName.indexOf('/') > -1) {
                //console.log('INFO_LSB_CUSTOMIZATION_VALUE_SPLIT_BY_/_BOOKID: ' + bookID);
            }

            return menuItemName.split('/');
        })
        .flatten()
        .map(function (menuItemName) {
            if (menuItemName.indexOf('&') > -1) {
                //console.log('INFO_LSB_CUSTOMIZATION_VALUE_SPLIT_BY_&_BOOKID: ' + bookID);
            }

            return menuItemName.split('&');
        })
        .flatten()
        .map(function (menuItemName) {
            return menuItemName.toLowerCase();
        })
        .map(function (menuItemName) {
            return menuItemName.trim();
        })
        .value();
}

function contributorArrayFromText(text) {
    if (text === undefined)
        return [];

    return _.chain(text.trim().split(','))
        .map(function (res) {
            return res.trim().split(' og ');
        })
        .flatten()
        .map(function (res) {
            return res.trim();
        })
        .value();
}

function uniqueSlugFromTitle(title, books) {
    var slug = title
        .toLowerCase()
        .trim()
        .replace(/æ/g, 'ae')
        .replace(/ø/g, 'oe')
        .replace(/å/g, 'aa')
        .replace(/ +(?= )/g, '')
        .replace(/[\.,\/#!$%\^&\*;:{}=-\`~()]/g, '')
        .replace(/ +(?= )/g, '')
        .replace(/\s/g, "-")
        .replace(/---/g, "-");

    if (_.findWhere(books, {slug: slug}) !== undefined) {
        slug = uniqueSlugFromTitleRecursive(slug, books, 1);
    }

    return slug;
}

function uniqueSlugFromTitleRecursive(slug, books, index) {
    if (_.findWhere(books, { slug: slug+"-"+index }) !== undefined) {
        return uniqueSlugFromTitleRecursive(slug, books, ++index);
    } else {
        return slug + "-" + index;
    }
}

function cleanCustomIngress(string) {
    if (string === undefined) {
        return string;
    }

    string = string.replace(/\s{5,}/g, ' <br />');
    string = string.replace(/\s{4}/g, ' <br /> <br />');
    string = string.replace(/\s{2,3}/g, ' <br />');

    return string;
}

function convertItemToJSON(books, item, textCategories, menuLinks, menuItems, contentItems) {
    var book = {};

    book.id = preprocess(item['DOC_ID']); // not needed for import later?
    book.title = preprocess(item['TITLE']);
    book.slug = uniqueSlugFromTitle(book.title, books);
    book.lsb_review = contentForBook(book.id, contentItems);
    book.lsb_quote = preprocess(cleanCustomIngress(item['CUSTOM_INGRESS']));
    book.excerpt = preprocess(item['INGRESS']);
    book.lsb_author = contributorArrayFromText(preprocess(item['CUSTOM_AUTHOR']));
    book.lsb_illustrator = contributorArrayFromText(preprocess(item['CUSTOM_ILLUSTRATOR']));
    book.lsb_translator = contributorArrayFromText(preprocess(item['CUSTOM_TRANSLATION']));
    book.lsb_publisher = preprocess(item['CUSTOM_PUBLISHING_HOUSE']);
    book.lsb_published_year = preprocess(item['CUSTOM_YEAR']);
    book.lsb_isbn = preprocess(item['CUSTOM_ISBN']);
    book.lsb_pages = preprocess(item['CUSTOM_PAGES']);

    book.lsb_supported = preprocess(item['CUSTOM_SUPPORTS_LSB']) == '1';
    if (book.lsb_supported) {
        book.lsb_support_cat = supportCategoryForBook(book.id, menuItems, menuLinks);
    }

    book.lsb_age = tagsArrayFromItemCategory(item['CUSTOM_CAT_1'], book.id, 'LSB_AGE', textCategories);
    book.lsb_extra = tagsArrayFromItemCategory(item['CUSTOM_CAT_2'], book.id, 'LSB_EXTRA', textCategories);
    book.lsb_genre = tagsArrayFromItemCategory(item['CUSTOM_CAT_3'], book.id, 'LSB_GENRE', textCategories);
    book.lsb_topic = tagsArrayFromItemCategory(item['CUSTOM_CAT_4'], book.id, 'LSB_TOPIC', textCategories);
    book.lsb_language = tagsArrayFromItemCategory(item['CUSTOM_CAT_5'], book.id, 'LSB_LANGUAGE', textCategories);

    book.lsb_customization = tagsArrayFromMenuLink(book.id, menuItems, menuLinks);

    book.lsb_look_inside = preprocess(item['CUSTOM_BLA_I_BOKA']);

    books.push(book);

}

function convertToJSON(list, textCategories, menuLinks, menuItems, contentItems) {

    var books = [];

    for (var i = 0; i<list.length; i++) {
        var item = list[i];
        convertItemToJSON(books, item, textCategories, menuLinks, menuItems, contentItems);
    }

    console.log("Generated number of books to JSON: " + books.length);

    return books;
}

module.exports = {
    convertToJSON: convertToJSON
};
