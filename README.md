boksok.no-data-utils
====================

Conversion tools for exported boksok.no data.

The original data exported from boksok.no is located in ```./original-data/boksok.xlsx```. Each table is exported from its corresponding excel sheet into a CSV file in ```./original-data/CSV-FROM-EXCEL/```, then converted into JSON in ```./original-data/JSON-FROM-CSV/```. Images are located in ```./original-data/bilder.xlsx```
.

A proof-of-concept Node.js conversion script in ```./util/aggregateTablesToSingleJSON.js``` converts the JSON data into a test JSON data structure in ```./output-example/test-json-conversion.json```. To run the script, first install Node.js dependencies (```npm install```) then run ```node util/aggregateTablesToSingleJSON.js```.


# Notes about the exported data

Documents (books) may belong to several categories of each category type, and be linked to multiple menu items.

## Category types:

* Alder: Barn, Ungdom, Voksne
* Ekstra: Mange bilder, Lydbok
* Sjanger: Prosa, Dikt, Faglitteratur, Dokumentar/Fakta, Andre sjangre
* Emne: Krim/Spenning, Eventyr, Humor, Historie/samfunn, Kjærlighet, Hus/hjem/hage, Mat/Helse, Sport, Natur, Mennesker i mellom, Annet
* Språk: Nynorsk, Bokmål, Nordsamisk, Sørsamisk, Lulesamisk

## Menu items
* Litt å lese
* Storskrift
* Punktskrift & følebilder
* Enkelt innhold
* Tegnspråk & NMT
* Bliss & Piktogram
* Skjønnlitteratur
* Faglitteratur
* Bilder
* Ny i Norge
* Tegn til tale /NMT
* Utviklingshemmede
* Demente

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

Old field | New field | New field data type
--- | --- | ---
title | title | wp text
content | lsb_review | acf wysiwyg (full, no media) (2)
custom_ingress | lsb_quote | acf wysiwyg (basic, no media)
ingress | excerpt | wp text
custom_author | lsb_author | wp custom taxonomy (tag) (1)
custom_illustrator | lsb_illustrator | wp custom taxonomy (tag) (1)
custom_publishing_house | lsb_publisher | wp custom taxonomy (tag) (1)
custom_year | lsb_published_year | acf text
custom_isbn | lsb_isdn | acf text
custom_pages | lsb_pages | acf text
custom_supports_lsb | lsb_supported | true / false
 | lsb_support_cat | purple (Litt å lese), yellow (Storskrift), orange (Punktskrift & Følebilder), green (Enkelt innhold), red (Tegnspråk & NMT), blue (Bliss & Piktogram)
  
(1): So the user can easily add another and the ui will "type ahead" and that might help combat spelling differences.  
(2): With acf wysiwyg one can limit the user more, ie. no possibility of media upload.  

## Categorization

We might have to rethink some of the categorization, but this is a mapping of fieldnames for the categorization of the the original data.

Old field | New field | New field data type | Values
--- | --- | --- | ---
Alder | lsb_age | wp custom taxonomy (category) | barn, ungdom, voksen
Sjanger | lsb_genre | wp custom taxonomy (category) | skjønnlitteratur, prosa, dikt, faglitteratur, dokumentar/fakta, annet
Tilpassning | lsb_customization (1) | wp custom taxonomy (category) | storskrift, bliss, piktogram, tegnspråk, nmt, punktskrift, følebilder, enkelt innhold (demente, utviklingshemmede), litt å lese (mye bilder, ny i Norge) (2)
Språk | lsb_language | wp custom taxonomy (category) | nynorsk, bokmål, nordsamisk, sørsamisk, lulesamisk
Emne | lsb_topic | wp custom taxonomy (tag) | free form (3)


(1): Find a better term  
(2): On import split original groups like Bliss & Piktogram into the seperate customazation categories: Bliss, Piktogram.  
     Record the book id so one can manually go through and pic the correct category/categories.  
(3): In import split groups like hus/hjem/hage into the seperate topic tags: hus, hjem, hage.  
     Record the book id so one can manually go through and pic the correct tags.
