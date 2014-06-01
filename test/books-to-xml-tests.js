/*
 * Unit test(s) for books-to-xml.js
 */

'use strict'

var booksToXML = require('../lib/books-to-xml'),
    parseString = require('xml2js').parseString,
    fs = require('fs'),
    testFixture = [{
        "id": 27,
        "title": "Julie og Sofia ",
        "description": "Dette er den andre boka i   serien om Julie. ",
        "longDescription": "En dag Julie ringer Sofia,   blir alt plutselig veldig rart.   - Husk bursdagen min på lørdag, sier Julie,   skal vi finne på noe koselig?   Men Sofia svarer ikke.   Hun bare mumler at de får prates senere. ",
        "author": "Johanne Emilie Andersen",
        "illustrator": "Johanne Emilie Andersen",
        "publishingHouse": "Orkana",
        "publishingYear": "2010",
        "ISBN": "9788281040854",
        "numberOfPages": "63",
        "supportsLSB": "1",
        "tags": [
            "Ungdom",
            "Voksne",
            "Mange bilder",
            "Prosa",
            "Mennesker i mellom",
            "Bokmål",
            "Utviklingshemmede"
        ],
        "content": "  <div>Julie og Sofia er bestevenner. </div>  <div>De liker de samme filmene, </div>  <div>de samme klærne og de samme guttene. </div>  <div>Men en dag Julie ringer, blir Sofia så rar. </div>  <div>Hun svarer ikke på det Julie spør om. </div>  <div>Neste dag på jobben vil ikke Sofia </div>  <div>se på Julie. Julie blir veldig lei seg. </div>  <div>Hva har skjedd? </div>  <div>Når hun kommer hjem fra jobben </div>  <div>går hun rett inn og legger seg i senga. </div>  <div>Der blir hun liggende å tenke ... </div>  <div>&#160;</div>  <div><strong>Julie og Sofia</strong> har store illustrasjoner i farger. </div>  <div>Illustrasjonene viser hva som skjer. </div>  <div>Boka har lite tekst på hver side og er lett å lese. </div>  <div>For de som ikke forstår alt selv, </div>  <div>er dette en fin samtalebok. </div>  <div>&#160;</div>  <div><strong>Johanne Emilie Andersen</strong> </div>  <div>er forfatter og illustratør. </div>  "
    },    {
        "id": 28,
        "title": "Julie er forelsket",
        "description": "Julie er forelsket i    Norges beste fotballspiller, Piggen Skåre. ",
        "longDescription": "Piggen kan sparke ballen   fra midt-banen på Ullevål,  rundt hele jord-kloden,   og rett i mål.",
        "author": "Johanne Emilie Andersen",
        "illustrator": "Johanne Emilie Andersen",
        "publishingHouse": "Orkana ",
        "publishingYear": "2003",
        "ISBN": "9788281040014",
        "numberOfPages": "",
        "supportsLSB": "1",
        "tags": [
            "Ungdom",
            "Voksne",
            "Mange bilder",
            "Prosa",
            "Mennesker i mellom",
            "Bokmål",
            "Utviklingshemmede"
        ],
        "content": "  <p>Hun gjør som hun pleier;<br />  dusjer, lager middag og går på jobb,<br />  men i tankene er hun helt andre steder.<br />  Hun er sammen med sin store helt,<br />  den berømte fotballspilleren Piggen Skåre. </p>  <div>Gjennom hele boka har drømmene sterke farger,<br />  mens Julies hverdag er laget i sort/hvitt.<br />  Til slutt møter Julie noen <br />  i sitt virkelige liv.</div>  <div>&#160;</div>  <div><strong>Julie er forelsket</strong> er ei voksenbok <br />  med lite tekst, enkelt innhold <br />  og flotte tegninger.</div>  <div>For de som ikke forstår alt selv, </div>  <div>er dette en fin samtalebok. </div>  <div>&#160;</div>  <div>Boka ble prøvd ut i et studieopplegg i regi av NFU. </div>  <div>Den ble godt mottatt blant de kvinnelige leserne, </div>  <div>som fortalte at de ville lese den sammen med kjæresten. </div>  <div><br />  Både teksten og tegningene er laget av <br />  <strong>Johanne Emilie Andersen</strong>, som er illustratør.<br />  Hun har tidligere utgitt barneboka KanLand.</div>  <div>&#160;</div>  <div>Det finnes to andre bøker om Julie. </div>  <div>Den heter<strong> Julie og Sofia</strong> og <strong>Den nye Julie</strong>. </div>  "
    },
    {
        "id": 29,
        "title": "Asylsøker ",
        "description": "En viktig bok om enkeltmenneskene som skjuler seg bak asylsøkere i Norge. ",
        "author": "Bjørn Gabrielsen",
        "publishingHouse": "Press",
        "publishingYear": "2009",
        "ISBN": "9788275473217",
        "numberOfPages": "178",
        "tags": [
            "Voksne",
            "Mange bilder",
            "Faglitteratur",
            "Mennesker i mellom",
            "Bokmål",
            "Ny i Norge"
        ],
        "content": "  <div>Boka <strong>Asylsøker</strong> handler om <br />  åtte ulike asylsøkere i Norge. <br />  Noen av dem bor fortsatt på asylmottak <br />  og venter på svar. <br />  Andre har vært i Norge en stund <br />  og har fått seg et nytt liv her. <br />  Alle har de en historie det er verdt <br />  å lytte til. </div>  <div>&#160;</div>  <p><strong>Asylsøker</strong> er en viktig bok om <br />  enkeltmennesker. <br />  Boka har flotte fotografier <br />  av menneskene som forteller.  <br />  Boka er laget i samarbeid med NOAS.</p>  "
    }];

module.exports = {
    testBooksToXML: function (test) {
        booksToXML(testFixture).then(function (xml) {

           fs.writeFile('./output-example/test-books-import-file-generator.xml', xml);

            var preamble = '<?xml version="1.0" encoding="UTF-8"?>';
            test.ok(typeof xml === 'string', 'Result should be a string.');
            test.ok(xml.substring(0, preamble.length) === preamble, 'Result should have xml preamble.');

            parseString(xml, function (err, result) {
                test.ifError(err);

                test.ok(result.rss instanceof Object, 'Result should contain rss object.');
                test.ok(result.rss.channel instanceof Object, 'rss should contain channel');

                test.done();
            });


        }, function (err) {
            test.ifError(err);
            test.done();
        });
    }
};
