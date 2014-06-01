boksok.no-data-utils
====================

Conversion tools for exported boksok.no data.

The original data exported from boksok.no is located in ```./original-data/boksok.xlsx```. Each table is exported from its corresponding excel sheet into a CSV file in ```./original-data/CSV-FROM-EXCEL/```, then converted into JSON in ```./original-data/JSON-FROM-CSV/```. Images are located in ```./original-data/bilder.xlsx```
.

## Notes about the exported data

Documents (books) may belong to several categories of each category type, and be linked to multiple menu items.

The main table is DOC, whose entries correspond to books.

## Category types:

The values in the CUSTOM_CAT_X fields correspond to the TEXT_ID values in the
TEXT table. The X in CUSTOM_CAT_X corresponds to the TEXT_GROUP_ID which
determines which "category type" the category is in. The TEXT_GROUP_ID
can be looked up in the TEXT_GROUP table.

Example:

*Alder* is the TEXT_GROUP_ID 1, which corresponds to the CUSTOM_CAT_1 field in
DOC. The value *Voksne* is TEXT_ID 3, and has the TEXT_GROUP_ID 1.

* Alder (CUSTOM_CAT_1, TEXT_GROUP_ID == 1)
  - Barn
  - Ungdom
  - Voksne
* Ekstra (CUSTOM_CAT_2, TEXT_GROUP_ID == 2)
  - Mange bilder
  - Lydbok
* Sjanger (CUSTOM_CAT_3, TEXT_GROUP_ID == 3)
  - Prosa
  - Dikt
  - Faglitteratur
  - Dokumentar/Fakta
  - Andre sjangre
* Emne (CUSTOM_CAT_4, TEXT_GROUP_ID == 4)
  - Krim/Spenning
  - Eventyr
  - Humor
  - Historie/samfunn
  - Kjærlighet
  - Hus/hjem/hage
  - Mat/Helse
  - Sport
  - Natur
  - Mennesker i mellom
  - Annet
* Språk (CUSTOM_CAT_5, TEXT_GROUP_ID == 5)
  - Nynorsk
  - Bokmål
  - Nordsamisk
  - Sørsamisk
  - Lulesamisk

## Menu items

The menu is described in the MENU table. It has 6 top menu items, which
correspond to "LSB support categories". The remaining menu items all have
one of these top menu items has their parent.

Books are linked to the menu through the MENU_LINK table. A book may be linked
to multiple menu items.

* Litt å lese
    * Skjønnlitteratur
    * Faglitteratur
    * Bilder
    * Ny i Norge
* Storskrift
* Punktskrift & følebilder
* Enkelt innhold
    * Utviklingshemmede
    * Demente
* Tegnspråk & NMT
    * Tegnspråk
    * Tegn til tale /NMT
* Bliss & Piktogram

## Image mapping

Images may be retrieved by constructing a URL of the form:

    http://www.boksok.no/thumb.aspx?file=upload_images/<object_id>.<EXTENSION>&height=<actual_height>&width=<actual_width>

 The fields object_id, EXTENTION (sic), actual_height, and actual_width may be extracted from the IMAGES table ```original-data/JSON-FROM-CSV/images.json```, linked to book objects by ```DOC_ID```.

 Full attribute set example for image objects:

 ```json
 {
    "DOC_ID":27,
    "param_id":2,
    "xsl_id":"0",
    "pos":10,
    "description":"Dokumentbilde",
    "width":259,
    "height":337,
    "section_id":2,
    "att_id":602,
    "object_type_id":27,
    "object_type":"d",
    "object_id":"40345289C0DF45A3B10D4EC8282B233A",
    "title":"Julie og sofia.jpg",
    "att_descr":"",
    "att_param_id":2,
    "NAME":"Julie og sofia.jpg",
    "EXTENTION":"jpg",
    "OBJECT_SIZE":708103,
    "changed":"6/17/10 13:10",
    "actual_width":"259",
    "actual_height":"337",
    "IMG":"prod_images/doc_27_2.jpg"
  }
```

# Book Data Structure

Old field | New field | New field data type | Default value or optional
--- | --- | --- | ---
title | title | wp text | ?
content | lsb_review | acf wysiwyg (full, no media) (2) | ?
custom_ingress | lsb_quote | acf wysiwyg (basic, no media) | ?
ingress | excerpt | wp text | ?
custom_author | lsb_author | wp custom taxonomy (tag) (1) | ?
custom_illustrator | lsb_illustrator | wp custom taxonomy (tag) (1) | ?
custom_translation | ? | ? (3) | ?
custom_publishing_house | lsb_publisher | wp custom taxonomy (tag) (1) | ?
custom_year | lsb_published_year | acf text | ?
custom_isbn | lsb_isbn | acf text | ?
custom_pages | lsb_pages | acf text | ?
custom_supports_lsb | lsb_supported | true / false | ?
 | lsb_support_cat | purple (Litt å lese), yellow (Storskrift), orange (Punktskrift & Følebilder), green (Enkelt innhold), red (Tegnspråk & NMT), blue (Bliss & Piktogram) | ?
  

1. So the user can easily add another and the ui will "type ahead" and that might help combat spelling differences.  
2. With acf wysiwyg one can limit the user more, ie. no possibility of media upload.
3. Added by @testower - leaving to @raae to determine new field name and type. Possibly should be "translator" rather than "translation"

### Implementation note for lsb_support_cat

```
// pseudo-code
if (lsb_supported) {
    // From MENU_LINK, top_menu_items is the list of all menu items
    // that a book is linked to, where sub menu items are listed as
    // their parent
    top_menu_items = concat(top_menu_items, sub_menu_items.parent)
    if (top_menu_items == 1) {
        lsb_support_cat = top_menu_items[0]
    } else {
        log_to_file(id, title, top_menu_items)
        // set lsb_support_cat to the first found in the list
        lsb_support_cat = first(top_menu_items, [7,5,8,6,4,3])
    }
}

```

## Categorization

We might have to rethink some of the categorization, but this is a mapping of
fieldnames for the categorization of the the original data.

Old field | New field | New field data type | Values
--- | --- | --- | ---
Alder | lsb_age | wp custom taxonomy (category) | barn, ungdom, voksen
Ekstra (4) | ? | ? | ?
Sjanger | lsb_genre | wp custom taxonomy (category) | skjønnlitteratur, prosa, dikt, faglitteratur, dokumentar/fakta, annet
Emne | lsb_topic | wp custom taxonomy (tag) | free form (3)
Språk | lsb_language | wp custom taxonomy (category) | nynorsk, bokmål, nordsamisk, sørsamisk, lulesamisk
Tilpasning | lsb_customization (1) | wp custom taxonomy (category) | storskrift, bliss, piktogram, tegnspråk, nmt, punktskrift, følebilder, enkelt innhold (demente, utviklingshemmede), litt å lese (mye bilder, ny i Norge) (2)

1. Find a better term
2.    On import split original groups like Bliss & Piktogram into the seperate customazation categories: Bliss, Piktogram.  
    Record the book id so one can manually go through and pic the correct category/categories.  
3. In import split groups like hus/hjem/hage into the seperate topic tags: hus, hjem, hage.  
      Record the book id so one can manually go through and pic the correct tags.
4. Added by @testower. ```CUSTOM_CAT_2``` / ```TEXT_GROUP_ID == 2```. Possible values
    according to data is "Mange bilder", "Lydbok". Possibly merge with one
    of the other fields?

### Implementation notes for lsb_customization

These values are derived from the MENU and MENU_LINK tables, and are duplicated
in the case that ```lsb_supported == true```. However, they are split on ```&```
and ```/```, and all menu items are added.

*Question: Should the parent menu items of sub menu items be added separately?*

```
// pseudo-code
// menu_items is a list of all menu items that a book is
// linked to in MENU_LINK

var all_items = [];

for (item in menu_items) {
    items = split(item, ['&', '/']);
    if (items.length > 1) {
        log_to_file(id, title, items);
        all_items.concat(items);
    } else {
        all_items.push(item);
    }
}
```
