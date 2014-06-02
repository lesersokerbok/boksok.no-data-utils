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
    _ = require('underscore');

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

function convertToXML(books) {
    return new Promise(function (resolve, reject) {

        var channelArray = [
            { "wp:wxr_version": "1.2" }
        ];

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

            if (book.lsb_author !== undefined)
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_author", nicename: niceName(book.lsb_author) },
                        _cdata: book.lsb_author
                    }
                });

            if (book.lsb_publisher !== undefined)
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_publisher", nicename: niceName(book.lsb_publisher) },
                        _cdata: book.lsb_publisher
                    }
                });

            if (book.lsb_illustrator !== undefined)
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_illustrator", nicename: niceName(book.lsb_illustrator) },
                        _cdata: book.lsb_illustrator
                    }
                });

            // if (book.lsb_translator !== undefined)
            //     item.push({
            //         category: {
            //             _attr: { domain: "lsb_tax_translator", nicename: niceName(book.lsb_translator) },
            //             _cdata: book.lsb_translator
            //         }
            //     });

            _.each(book.lsb_age, function (age) {
                item.push({
                    category: {
                        _attr: { domain: "lsb_tax_age", nicename: niceName(age) },
                        _cdata: age
                    }
                });
            });

            // _.each(book.lsb_extra, function (extra) {
            //     item.push({
            //         category: {
            //             _attr: { domain: "lsb_tax_extra", nicename: niceName(extra) },
            //             _cdata: extra
            //         }
            //     });
            // });

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

            channelArray.push({
                item: item
            });
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
