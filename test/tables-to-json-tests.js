/*
 * Tests for unique slugs
 */

'use strict'

var rewire = require('rewire'),
    tablesToJSON = rewire('../lib/tables-to-json');

module.exports = {

    testUniqueSlugFromTitle: function (test) {
        var uniqueSlugFromTitle = tablesToJSON.__get__('uniqueSlugFromTitle');

        var books = [];
        var book1 = {
            title: "En tittel som er den samme"
        };

        var book2 = {
            title: "En tittel som er den samme"
        };

        var book3 = {
            title: "En tittel som er den samme"
        }

        book1.slug = uniqueSlugFromTitle(book1, books);

        books.push(book1);

        book2.slug = uniqueSlugFromTitle(book2, books);

        books.push(book2);

        book3.slug = uniqueSlugFromTitle(book3, books);

        console.log(book1);
        console.log(book2);
        console.log(book3);

        test.ok(book1.slug !== book2.slug, "Slugs should be different.");
        test.ok(book1.slug !== book3.slug, "Slugs should be different.");
        test.ok(book2.slug !== book3.slug, "Slugs should be different.");
        test.done();
    }
}
