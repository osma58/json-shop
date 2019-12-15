let xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        sortBookObjects.data = JSON.parse(this.responseText);
        sortBookObjects.addJSDate();

        //data moet eigenschap hebben waar titel caps is
        sortBookObjects.data.forEach(boek => {
            boek.titelUpper = boek.titel.toUpperCase();
            //ook achternaam van auteur
            boek.sortAuteur = boek.auteur[0];

        });


        sortBookObjects.sorteren();
    }
}

xmlhttp.open('GET', "books.json", true);
xmlhttp.send();

const makeHead = (arr) => {
    let kop = "<table class='boeken'><tr>";
    arr.forEach((item) => {
        kop += "<th>" + item + "</th>";
    });
    kop += "</tr>";
    return kop;
}

const giveMonthNumber = (month) => {
    let number;
    switch (month) {
        case "januari":
            number = 0;
            break;
        case "februari":
            number = 1;
            break;
        case "maart":
            number = 2;
            break;
        case "april":
            number = 3;
            break;
        case "mei":
            number = 4;
            break;
        case "juni":
            number = 5;
            break;
        case "juli":
            number = 6;
            break;
        case "augustus":
            number = 7;
            break;
        case "september":
            number = 8;
            break;
        case "oktober":
            number = 9;
            break;
        case "november":
            number = 10;
            break;
        case "december":
            number = 11;
            break;

        default:
            number = 0;
    }
    return number;
}

const makeValidDate = (monthYear) => {
    let myArray = monthYear.split(" ");
    let date = new Date(myArray[1], giveMonthNumber(myArray[0]));
    return date;
}

const makeSummary = (array) => {
    let string = "";
    for (let i = 0; i < array.length; i++) {
        switch (i) {
            case array.length - 1:
                string += array[i];
                break;
            case array.length - 2:
                string += array[i] + " en ";
                break;
            default:
                string += array[i] + ", ";
        }
    }
    return string;
}

//maak functie die de tekst achter de comma vooraan plaats
const keerTekstOn = (string) => {
    if (string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }
    return string;
}

//Winkelwagen object hier
// bevat items toe
// voeg items
// verwijder items
// aantal bijwerken

let winkelwagen = {
    items: [],
    haalItemsOp: function() {
        let bestelling;
        if (localStorage.getItem('besteldeBoeken') == null) {
            bestelling = [];
        } else {
            bestelling = JSON.parse(localStorage.getItem('besteldeBoeken'));
            bestelling.forEach(item => {
                this.items.push(item);
            });
            this.uitvoeren();
        }
        return bestelling;
    },

    toevoegen: function(el) {
        this.items = this.haalItemsOp();
        this.items.push(el);
        localStorage.setItem('besteldeBoeken', JSON.stringify(this.items))
        this.uitvoeren();
    },
    uitvoeren: function() {
        if (this.items.length > 0) {
            document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
        } else {
            document.querySelector('.winkelwagen__aantal').innerHTML = '';
        }
    }
}

winkelwagen.haalItemsOp();




//sorteer de boeken functies sorteren() + uitvoeren()
let sortBookObjects = {
    data: "",
    unique: "titelUpper",
    oplopend: 1,
    addJSDate: function() {
        this.data.forEach((item) => {
            item.JSDate = makeValidDate(item.uitgave);
        });
    },
    //Data sorteren
    sorteren: function() {
        this.data.sort((a, b) => a[this.unique] > b[this.unique] ? 1 * this.oplopend : -1 * this.oplopend);
        this.uitvoeren(this.data);
    },
    //Verwerking van tabel
    uitvoeren: function(data) {
        //Uitvoer leeg maken
        document.getElementById("boeken").innerHTML = "";

        data.forEach(boek => {
            let sectie = document.createElement('section');
            sectie.className = 'boekSelectie';

            //De grid elementen
            let main = document.createElement('main');
            main.className = "boekSelectie__main";

            //maak cover 
            let afbeelding = document.createElement("img");
            afbeelding.className = "boekSelectie__cover";
            afbeelding.setAttribute("src", boek.cover);
            afbeelding.setAttribute("alt", keerTekstOn(boek.titel));

            //maak title
            let titel = document.createElement('h3');
            titel.className = "boekSelectie__titel";
            titel.textContent = keerTekstOn(boek.titel);

            //Acteur
            let auteurs = document.createElement('p');
            auteurs.className = 'boekSelectie__auteurs';
            //voor en achter naam omdraaien
            boek.auteur[0] = keerTekstOn(boek.auteur[0]);
            auteurs.textContent = makeSummary(boek.auteur);

            //overige informatie
            let overig = document.createElement('p');
            overig.className = "boekSelectie__overig";
            overig.textContent = "Datum: " + boek.uitgave + " | Pagina's: " + boek.paginas + " | Taal: " + boek.taal + " | EAN: " + boek.ean;


            //prijs
            let prijs = document.createElement("div");
            prijs.className = "boekSelectie__prijs";
            //format prijs naar nederlands
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', { currency: 'EUR', style: "currency" });

            //voeg knop toe
            let knop = document.createElement('button');
            knop.className = "boekSelectie__knop";
            knop.innerHTML = "Voeg toe aan<br>winkelwagen"
            knop.addEventListener('click', () => {
                winkelwagen.toevoegen(boek);
            })


            sectie.appendChild(afbeelding);
            main.appendChild(titel);
            main.appendChild(auteurs);
            main.appendChild(overig);
            sectie.appendChild(main);
            prijs.appendChild(knop);
            sectie.appendChild(prijs);
            document.getElementById("boeken").appendChild(sectie);
        });
    }
}

document.getElementById('kenmerk').addEventListener('change', (e) => {
    sortBookObjects.unique = e.target.value;
    sortBookObjects.sorteren();
});

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        sortBookObjects.oplopend = parseInt(e.target.value);
        sortBookObjects.sorteren();
    })
})