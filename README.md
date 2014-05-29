boksok.no-data-utils
====================

Conversion tools for exported boksok.no data. 

The original data exported from boksok.no is located in ```./original-data/boksok.xlsx```. Each table is exported from its corresponding excel sheet into a CSV file in ```./original-data/CSV-FROM-EXCEL/```, then converted into JSON in ```./original-data/JSON-FROM-CSV/```.

A proof-of-concept Node.js conversion script in ```./util/convert.js``` converts the JSON data into a test JSON data structure in ```./output/test.json```. To run the script, first install Node.js dependencies (```npm install```) then run ```node util/convert.js```.


# Notes about the exported data

Category types:

* Alder: Barn, Ungdom, Voksne
* Ekstra: Mange bilder, Lydbok
* Sjanger: Prosa, Dikt, Faglitteratur, Dokumentar/Fakta, Andre sjangre
* Emne: Krim/Spenning, Eventyr, Humor, Historie/samfunn, Kjærlighet, Hus/hjem/hage, Mat/Helse, Sport, Natur, Mennesker i mellom, Annet
* Språk: Nynorsk, Bokmål, Nordsamisk, Sørsamisk, Lulesamisk

Menu items: Litt å lese, Storskrift, Punktskrift & følebilder, Enkelt innhold, Tegnspråk & NMT, Bliss & Piktogram,Skjønnlitteratur, Faglitteratur, Bilder, Ny i Norge, Tegn til tale /NMT, Utviklingshemmede, Demente

Documents (books) may belong to several categories of each category type, and be linked to multiple menu items.
