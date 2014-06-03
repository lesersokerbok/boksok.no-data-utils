/*
 * Convert Book JSON structure to Wordpress friendly XML import file
 */

 /*
    xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/"
 */

'use strict';

var Promise = require('promise'),
    xml = require('xml'),
    _ = require('underscore'),
    fs = require('fs'),
    images = JSON.parse(fs.readFileSync('./original-data/JSON-FROM-CSV/IMAGES.json'));

function niceName(name) {
    return name.replace(/\s/g, '-').toLowerCase();
}

function languageCodeFromString(language) {
    if (language === "bokmål")
        return "no_nb";
    else if (language === "nynorsk")
        return "no_nn";
    else if (language === "nordsamisk")
        return "no_sme";
    else if (language === "lulesamisk")
        return "no_smj";
    else if (language === "sørsamisk")
        return "no_sma";

    console.error("ERROR_LANGUAGE_CODE_NOT_FOUND_FOR_LANGUAGE: " + language);
    return undefined;
}

function supportCategoryColor(supportCategory) {

    supportCategory = supportCategory.trim();

    if (supportCategory === "Litt å lese")
        return "purple";
    else if (supportCategory === "Storskrift")
        return "yellow";
    else if (supportCategory === "Punktskrift & følebilder")
        return "orange";
    else if (supportCategory === "Enkelt innhold")
        return "green";
    else if (supportCategory === "Tegnspråk & NMT")
        return "red";
    else if (supportCategory === "Bliss & piktogram")
        return "blue";

    console.error("ERROR_SUPPORT_CATEGORY_COLOR_NOT_FOUND_FOR_SUPPORT_CATEGORY: " + supportCategory);
    return undefined;
}

function imageItemForBook(bookID, imageItemId) {

    var imageObject = _.findWhere(images, { "DOC_ID": bookID } );

    if (imageObject === undefined)
        return undefined;

    var url = 'https://raw.githubusercontent.com/lesersokerbok/boksok.no-data-utils/master/output-example/images/'
        + imageObject.object_id
        + '.'
        + imageObject.EXTENTION;

    return [
        { "title": imageObject.title },
        { "wp:post_id": parseInt(imageItemId, 10) },
        { "wp:status": "inherit" },
        { "wp:post_type": "attachment" },
        { "wp:attachment_url": url }
    ];
}

function convertToXML(books) {
    return new Promise(function (resolve, reject) {

        var channelArray = [
            { "wp:wxr_version": "1.2" }
        ],
            imageItemCounter = 0;

        _.each(books, function (book) {

            var item = [
                { "wp:post_type": "lsb_book" },
                { "wp:status": "publish"},
                { title: book.title },
                { "excerpt:encoded": { _cdata: book.excerpt } },
                { "wp:postmeta": [
                    { "wp:meta_key": "lsb_isbn" },
                    { "wp:meta_value": { _cdata: book.lsb_isbn } }
                ]},
                { "wp:postmeta": [
                    { "wp:meta_key": "_lsb_isbn" },
                    { "wp:meta_value": { _cdata: "lsb_acf_isbn" } }
                ]},
                { "wp:postmeta": [
                    { "wp:meta_key": "lsb_published_year" },
                    { "wp:meta_value": { _cdata: book.lsb_published_year } }
                ]},
                { "wp:postmeta": [
                    { "wp:meta_key": "_lsb_published_year" },
                    { "wp:meta_value": { _cdata: "lsb_acf_published_year" } }
                ]},
                { "wp:postmeta": [
                    { "wp:meta_key": "lsb_pages" },
                    { "wp:meta_value": { _cdata: book.lsb_pages } }
                ]},
                { "wp:postmeta": [
                    { "wp:meta_key": "_lsb_pages" },
                    { "wp:meta_value": { _cdata: "lsb_acf_pages" } }
                ]},
                { "wp:postmeta": [
                    { "wp:meta_key": "lsb_review" },
                    { "wp:meta_value": { _cdata: book.lsb_review } }
                ]},
                { "wp:postmeta": [
                    { "wp:meta_key": "_lsb_review" },
                    { "wp:meta_value": { _cdata: "lsb_acf_review" } }
                ]},
                { "wp:postmeta": [
                    { "wp:meta_key": "lsb_quote" },
                    { "wp:meta_value": { _cdata: book.lsb_quote } }
                ]},
                { "wp:postmeta": [
                    { "wp:meta_key": "_lsb_quote" },
                    { "wp:meta_value": { _cdata: "lsb_acf_quote" } }
                ]}
            ];

            item.push({
                "wp:postmeta": [
                    { "wp:meta_key": "lsb_supported" },
                    { "wp:meta_value": { _cdata: book.lsb_supported === true ? '1' : '0' } } // convert to integer
                ]
            });

            item.push({
                "wp:postmeta": [
                    { "wp:meta_key": "_lsb_supported" },
                    { "wp:meta_value": { _cdata: "lsb_acf_supported" } }
                ]
            });

            if (book.lsb_supported) {

                item.push({
                    "wp:postmeta": [
                        { "wp:meta_key": "lsb_support_cat" },
                        { "wp:meta_value": { _cdata: supportCategoryColor(book.lsb_support_cat) } }
                    ]
                });

                item.push({
                    "wp:postmeta": [
                        { "wp:meta_key": "_lsb_support_cat" },
                        { "wp:meta_value": { _cdata: "lsb_acf_support_cat" } }
                    ]
                });

            }

            if (book.lsb_publisher !== undefined)
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_publisher", nicename: niceName(book.lsb_publisher) },
                        _cdata: book.lsb_publisher
                    }
                });

            if (book.lsb_look_inside !== undefined) {

                item.push({
                    "wp:postmeta": [
                        { "wp:meta_key": "lsb_look_inside" },
                        { "wp:meta_value": { _cdata: book.lsb_look_inside } }
                    ]
                });

                item.push({
                    "wp:postmeta": [
                        { "wp:meta_key": "_lsb_look_inside" },
                        { "wp:meta_value": { _cdata: "lsb_acf_look_inside" } }
                    ]
                });
            }

            _.each(book.lsb_author, function (author) {
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_author", nicename: niceName(author) },
                        _cdata: author
                    }
                });
            });

            _.each(book.lsb_illustrator, function (illustrator) {
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_illustrator", nicename: niceName(illustrator) },
                        _cdata: illustrator
                    }
                });
            });

            _.each(book.lsb_translator, function (translator) {
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_translator", nicename: niceName(translator) },
                        _cdata: translator
                    }
                });
            });

            if (book.lsb_translator !== undefined)


            _.each(book.lsb_age, function (age) {
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_age", nicename: niceName(age) },
                        _cdata: age
                    }
                });
            });

            _.each(book.lsb_genre, function (genre) {
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_genre", nicename: niceName(genre) },
                        _cdata: genre
                    }
                });
            });

            _.each(book.lsb_topic, function (topic) {
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_topic", nicename: niceName(topic) },
                        _cdata: topic
                    }
                });
            });

            _.each(book.lsb_language, function (language) {
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_language", nicename: languageCodeFromString(language) },
                        _cdata: language
                    }
                });
            });

            _.each(book.lsb_customization, function (customization) {
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_customization", nicename: niceName(customization) },
                        _cdata: customization
                    }
                });
            });

            _.each(book.lsb_extra, function (extra) {
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_customization", nicename: niceName(extra) },
                        _cdata: extra
                    }
                });
            });

            var imageItemId = 5000 + imageItemCounter++,
                imageItem = imageItemForBook(book.id, imageItemId);

            if (imageItem !== undefined) {
                item.push({
                    "wp:postmeta": [
                        { "wp:meta_key": "_thumbnail_id" },
                        { "wp:meta_value": { _cdata: imageItemId } }
                    ]
                });
            }

            channelArray.push({
                item: item
            });

            if (imageItem !== undefined) {
                channelArray.push({
                    item: imageItemForBook(book.id, imageItemId)
                });
            }
        });

        var rssArray = [{
            _attr: {
                version: "2.0",
                "xmlns:excerpt": "http://wordpress.org/export/1.2/excerpt/",
                "xmlns:content": "http://purl.org/rss/1.0/modules/content/",
                "xmlns:wfw": "http://wellformedweb.org/CommentAPI/",
                "xmlns:dc": "http://purl.org/dc/elements/1.1/",
                "xmlns:wp": "http://wordpress.org/export/1.2/"
            },
        },
        { channel: channelArray }];

        resolve( xml(
            {
                rss: rssArray
            },
            {
                declaration: { version: "1.0", encoding: "UTF-8" },
                indent: '    '
            }
        ));
    });
};

module.exports = convertToXML;
