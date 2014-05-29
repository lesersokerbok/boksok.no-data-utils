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

function convertToXML(books) {
    return new Promise(function (resolve, reject) {

        var channelArray = [
            { "wp:wxr_version": "1.2" }
        ];

        _.each(books, function (book) {
            channelArray.push({
                item: [
                    { title: book.title },
                    { description: book.description },
                    { "content:encoded": { _cdata: book.content } },
                    { "excerpt:encoded": { _cdata: book.longDescription } },
                    { "wp:post_type": "boksok_books" },
                    { "wp:postmeta": [
                        { "wp:meta_key": "ISBN" },
                        { "wp:meta_value": { _cdata: book.ISBN } }
                    ]},
                    { "wp:postmeta": [
                        { "wp:meta_key": "_ISBN" },
                        { "wp:meta_value": { _cdata: "field_5384fbd4ca44b" } }
                    ]},
                    { "wp:postmeta": [
                        { "wp:meta_key": "numberOfPages" },
                        { "wp:meta_value": { _cdata: book.numberOfPages } }
                    ]},
                    { "wp:postmeta": [
                        { "wp:meta_key": "_numberOfPages" },
                        { "wp:meta_value": { _cdata: "field_5384fdbb01bb8" } }
                    ]}
                ]
            });
        });

        var rssArray = [{
            _attr: {
                "version": "2.0",
                "xmlns:excerpt": "http://wordpress.org/export/1.2/excerpt/",
                "xmlns:content": "http://purl.org/rss/1.0/modules/content/",
                "xmlns:wfw": "http://wellformedweb.org/CommentAPI/",
                "xmlns:dc": "http://purl.org/dc/elements/1.1/",
                "xmlns:wp": "http://wordpress.org/export/1.2/"
            },
        },
        { channel: channelArray }];

        resolve( xml({ rss: rssArray }, { declaration: { version: "1.0", encoding: "UTF-8" } }) );
    });
};

module.exports = convertToXML;
