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

        book1.slug = uniqueSlugFromTitle(book1.title, books);

        books.push(book1);

        book2.slug = uniqueSlugFromTitle(book2.title, books);

        books.push(book2);

        book3.slug = uniqueSlugFromTitle(book3.title, books);

        test.ok(book1.slug !== book2.slug, "Slugs should be different.");
        test.ok(book1.slug !== book3.slug, "Slugs should be different.");
        test.ok(book2.slug !== book3.slug, "Slugs should be different.");
        test.done();
    },
    testCleanCustomIngress: function (test) {
        var cleanCustomIngress = tablesToJSON.__get__('cleanCustomIngress'),
            toTest, expect, result;

        toTest = 'Et par av spillerne løper mot ambulansen.  De veiver med armene for å vise ambulansesjåføren at han må kjøre ut på moloen.  Den gule bilen svinger ut på moloen. Ambulansepersonalet stormer ut. De er tre personer, to menn og en kvinne. Kvinnen plasserer en flat pakke, som må være en hjertestarter, på Jorginhos bryst. Den ene av mennene står parat med noe som ser ut til å være en oksygenmaske, som kanskje skal presses mot Jorginhos blåfiolette lepper.  "Er det håp, tror du" hvisker Thygesen andpustent til Levin.  "Det ser ikke sånn ut," hvisker Levin tilbake. "Det ser ut som om løpet er kjørt for ham, for Jorge Miguel da Silva."';
        expect = 'Et par av spillerne løper mot ambulansen. <br />De veiver med armene for å vise ambulansesjåføren at han må kjøre ut på moloen. <br />Den gule bilen svinger ut på moloen. Ambulansepersonalet stormer ut. De er tre personer, to menn og en kvinne. Kvinnen plasserer en flat pakke, som må være en hjertestarter, på Jorginhos bryst. Den ene av mennene står parat med noe som ser ut til å være en oksygenmaske, som kanskje skal presses mot Jorginhos blåfiolette lepper. <br />"Er det håp, tror du" hvisker Thygesen andpustent til Levin. <br />"Det ser ikke sånn ut," hvisker Levin tilbake. "Det ser ut som om løpet er kjørt for ham, for Jorge Miguel da Silva."';
        result = cleanCustomIngress(toTest);
        test.ok(result === expect, 'Should get expected result.');

        toTest = '- For siste gang, Påsan!   Du må slutte å barbere Bjarne!   - Men han svetter med all den pelsen!   - Sludder! Dessuten ødelegger du høvelen min!   Se her!   - Stakkars deg, Bjarne... Det neste   blir vel at du ikke får låne tannbørsten hans. ';
        expect = '- For siste gang, Påsan! <br />Du må slutte å barbere Bjarne! <br />- Men han svetter med all den pelsen! <br />- Sludder! Dessuten ødelegger du høvelen min! <br />Se her! <br />- Stakkars deg, Bjarne... Det neste <br />blir vel at du ikke får låne tannbørsten hans. ';
        result = cleanCustomIngress(toTest);
        test.ok(result === expect, 'Should get expected result.');

        toTest = 'STATSMINISTEREN HAR EIN UVANE  Statsministeren   som er så flink  til å hugse på nistepakken  og styre det store stortinget  og til å sløkkje lyset  på badet                har ein uvane:    Han går i eplehagen  og rister på alle trea  så alle epla fell ned.'
        expect = 'STATSMINISTEREN HAR EIN UVANE <br />Statsministeren <br />som er så flink <br />til å hugse på nistepakken <br />og styre det store stortinget <br />og til å sløkkje lyset <br />på badet <br />har ein uvane: <br /> <br />Han går i eplehagen <br />og rister på alle trea <br />så alle epla fell ned.';
        result = cleanCustomIngress(toTest);
        test.ok(result === expect, 'Should get expected result.');

        toTest = 'Siv:   - SKJØNNER MEG  IKKE PÅ DERE GIFTE  SOM KUTTER KONTAKTEN  MED VENNENE DERES.    Mari:   - HUN ER JO FORLATT   AV MANNEN SIN.  OG VENNINNENE HAR HUN  MISTET FOR HUNDRE  ÅR SIDEN    Siv:   - JEG SKJØNNER   IKKE AT DERE GIFTE  BARE FÅR SÅNN OPP I   HVERANDRE.    - SÅ BLIR MANNEN LEI,  OG SÅ SITTER DERE DER.    Terapeuten:  - FINT AT DU UTTRYKKER  FRUSTRASJONEN DIN.  GRUPPA SKAL VÆRE ET STED  HVOR VI KAN UTFORSKE   GRENSENE VÅRE.    Steinar:  - HER GIKK DU OVER   GRENSEN.  GRETE GRÅTER!    Grete:  - DET ER IKKE SÅ   FARLIG, JEG GRÅTER  SÅ MYE UANSETT    Siv:  - UNNSKYLD, DA!';
        expect = 'Siv: <br />- SKJØNNER MEG <br />IKKE PÅ DERE GIFTE <br />SOM KUTTER KONTAKTEN <br />MED VENNENE DERES. <br /> <br />Mari: <br />- HUN ER JO FORLATT <br />AV MANNEN SIN. <br />OG VENNINNENE HAR HUN <br />MISTET FOR HUNDRE <br />ÅR SIDEN <br /> <br />Siv: <br />- JEG SKJØNNER <br />IKKE AT DERE GIFTE <br />BARE FÅR SÅNN OPP I <br />HVERANDRE. <br /> <br />- SÅ BLIR MANNEN LEI, <br />OG SÅ SITTER DERE DER. <br /> <br />Terapeuten: <br />- FINT AT DU UTTRYKKER <br />FRUSTRASJONEN DIN. <br />GRUPPA SKAL VÆRE ET STED <br />HVOR VI KAN UTFORSKE <br />GRENSENE VÅRE. <br /> <br />Steinar: <br />- HER GIKK DU OVER <br />GRENSEN. <br />GRETE GRÅTER! <br /> <br />Grete: <br />- DET ER IKKE SÅ <br />FARLIG, JEG GRÅTER <br />SÅ MYE UANSETT <br /> <br />Siv: <br />- UNNSKYLD, DA!';
        result = cleanCustomIngress(toTest);
        test.ok(result === expect, 'Should get expected result.');

        toTest = 'BRAND  Da den ungen presten Brand  skal gi en døende den siste  nattverd, blir Agnes så   forelsket i ham at hun  dumper kjæresten.    De gifter seg og får barn.  Barnet dør, Agnes dør,  Brands mamma dør, og han  bestemmer seg for at det  skal bygges en ny   kirke.    Brand oppdager at Gud  finnes oppe i fjellet og begir  seg opp dit, men han  omkommer i et snøras.';
        expect = 'BRAND <br />Da den ungen presten Brand <br />skal gi en døende den siste <br />nattverd, blir Agnes så <br />forelsket i ham at hun <br />dumper kjæresten. <br /> <br />De gifter seg og får barn. <br />Barnet dør, Agnes dør, <br />Brands mamma dør, og han <br />bestemmer seg for at det <br />skal bygges en ny <br />kirke. <br /> <br />Brand oppdager at Gud <br />finnes oppe i fjellet og begir <br />seg opp dit, men han <br />omkommer i et snøras.'
        result = cleanCustomIngress(toTest);
        test.ok(result === expect, 'Should get expected result.');

        test.done();
    },
    testCleanContent: function (test) {
        var cleanContent = tablesToJSON.__get__('cleanContent'),
            toTest, expect, result;

        toTest = '  <div><strong>Spor snø</strong> er en samling med <br />  veldig korte dikt. <br />  De fleste diktene er bare på <br />  tre linjer. <br />  Diktene lager fine, rare<br />  og morsomme bilder. </div>  <div>&#160;</div>  <div>Disse diktene er lette å lese, <br />  samtidig er det stor poesi. <br />  Bildene diktene skaper er<br />  lette å se for seg.  <br />  De får deg til å tenke<br />  og lage egne bilder. </div>  <div>&#160;</div>  <div><strong>Jan Erik Vold</strong> er en av Norges <br />  mest kjente diktere. <br />  Spor snø kom ut i 1970. <br />  Den er ikke lenger i salg, <br />  men finnes i samligen \"<strong>Huset er hvitt</strong>\". </div>  <div>Diktene i samlingen er dessverre satt </div>  <div>med tettere font og mindre luft </div>  <div>enn diktene i den opprinnelige utgaven. </div>  <div>Det kan derfor lønne seg å låne boka </div>  <div>på biblioteket. </div>  <div>&#160;</div>  ';
        expect = '  <div><strong>Spor snø</strong> er en samling med <br />  veldig korte dikt. <br />  De fleste diktene er bare på <br />  tre linjer. <br />  Diktene lager fine, rare<br />  og morsomme bilder. </div>  <div>&#160;</div>  <div>Disse diktene er lette å lese, <br />  samtidig er det stor poesi. <br />  Bildene diktene skaper er<br />  lette å se for seg.  <br />  De får deg til å tenke<br />  og lage egne bilder. </div>  <div>&#160;</div>  <div><strong>Jan Erik Vold</strong> er en av Norges <br />  mest kjente diktere. <br />  Spor snø kom ut i 1970. <br />  Den er ikke lenger i salg, <br />  men finnes i samligen \"<strong>Huset er hvitt</strong>\". </div>  <div>Diktene i samlingen er dessverre satt </div>  <div>med tettere font og mindre luft </div>  <div>enn diktene i den opprinnelige utgaven. </div>  <div>Det kan derfor lønne seg å låne boka </div>  <div>på biblioteket. </div>  ';
        result = cleanContent(toTest);
        test.ok(result === expect, 'Should get expected result');

        toTest = '  <div>Boka er delt inn i tre deler. </div>  <div>Første del, <em>Inn i mørket</em>, <br />  handler om Sigrid Beates barndom <br />  og overgrepene faren henne utsatte henne for. <br />  Samtidig forteller hun om hva hverdagen handler om nå; <br />  hennes lungesyke sønn, Tobias.&#160;</div>  <div>&#160;</div>  <div>Del to er utdrag fra&#160;Sigrid Beates&#160;dagbøker, <br />  samt brev hun skrev til Tobias og ektemannen, <br />  mens hun satt i fengsel for drapet på faren.</div>  <div>&#160;</div>  <div>Siste del heter<em> Ut av mørket</em> og er en oppsummering </div>  <div>av det som skjedde rett før drapet, og tida etter. </div>  <div>Hvordan hun ble flytta rundt fra fengsel til fengsel, </div>  <div>og på ulike avdelinger. <br />  Hvordan det gikk da hun ble gravid med Mathias. </div>  <div>Den lille familien endte til slutt opp på et familiehjem <br />  der hun kunne sone ferdig dommen <br />  sammen med mann og barn.&#160;</div>  <div>&#160;</div>  <div>Boka har stor skrift og er lett å lese, <br />  selv om det er trist lesning. <br />  Sigrid Beate bruker et muntlig, ukomplisert språk. <br />  Det er mange avsnitt og mye luft i teksten.&#160;</div>  <div>&#160;</div>  <div>&#160;</div>  <div>&#160;</div>  <div>&#160;</div>  <div>&#160;</div>  <div>&#160;</div>  <div>&#160;</div>  ';
        expect = '  <div>Boka er delt inn i tre deler. </div>  <div>Første del, <em>Inn i mørket</em>, <br />  handler om Sigrid Beates barndom <br />  og overgrepene faren henne utsatte henne for. <br />  Samtidig forteller hun om hva hverdagen handler om nå; <br />  hennes lungesyke sønn, Tobias.&#160;</div>  <div>&#160;</div>  <div>Del to er utdrag fra&#160;Sigrid Beates&#160;dagbøker, <br />  samt brev hun skrev til Tobias og ektemannen, <br />  mens hun satt i fengsel for drapet på faren.</div>  <div>&#160;</div>  <div>Siste del heter<em> Ut av mørket</em> og er en oppsummering </div>  <div>av det som skjedde rett før drapet, og tida etter. </div>  <div>Hvordan hun ble flytta rundt fra fengsel til fengsel, </div>  <div>og på ulike avdelinger. <br />  Hvordan det gikk da hun ble gravid med Mathias. </div>  <div>Den lille familien endte til slutt opp på et familiehjem <br />  der hun kunne sone ferdig dommen <br />  sammen med mann og barn.&#160;</div>  <div>&#160;</div>  <div>Boka har stor skrift og er lett å lese, <br />  selv om det er trist lesning. <br />  Sigrid Beate bruker et muntlig, ukomplisert språk. <br />  Det er mange avsnitt og mye luft i teksten.&#160;</div>  ';
        result = cleanContent(toTest);
        test.ok(result === expect, 'Should get expected result');
        
        test.done();
    }
}
