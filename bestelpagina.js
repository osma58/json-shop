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
        }
        bestelling.forEach(item => {
            this.items.push(item);
        })
        return bestelling;
    },
    toevoegen: function(el) {
        this.items = this.haalItemsOp();
        this.items.push(el);
        localStorage.setItem('besteldeBoeken', JSON.stringify(this.items))
        document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
    },
    verwijderItem: function(ean) {
        this.items.forEach((item, index) => {
            if (item.ean == ean) {
                this.items.splice(index, 1);
                ean = 4;
            }
        })
        localStorage.setItem('besteldeBoeken', JSON.stringify(this.items));
        document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
        if (this.items.length > 0) {
            document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
        } else {
            document.querySelector('.winkelwagen__aantal').innerHTML = "";
        }
        this.uitvoeren();
    },
    totaalPrijs: function() {
        let totaal = 0;
        this.items.forEach(boek => {
            totaal += boek.prijs;
        });
        return totaal;
    },
    uitvoeren: function() {
        //Uitvoer leeg maken
        document.getElementById("bestellingen").innerHTML = "";

        this.items.forEach(boek => {
            let sectie = document.createElement('section');
            sectie.className = 'besteldBoek';

            //maak cover 
            let afbeelding = document.createElement("img");
            afbeelding.className = "besteldBoek__cover";
            afbeelding.setAttribute("src", boek.cover);
            afbeelding.setAttribute("alt", keerTekstOn(boek.titel));

            //maak title
            let titel = document.createElement('h3');
            titel.className = "besteldBoek__titel";
            titel.textContent = keerTekstOn(boek.titel);

            //prijs
            let prijs = document.createElement("div");
            prijs.className = "besteldBoek__prijs";
            //format prijs naar nederlands
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', { currency: 'EUR', style: "currency" });

            //Verwijder knop
            let verwijder = document.createElement('div');
            verwijder.className = "besteldBoek__verwijder";
            verwijder.addEventListener('click', () => {
                this.verwijderItem(boek.ean);
            });


            sectie.appendChild(afbeelding);
            sectie.appendChild(titel);
            sectie.appendChild(prijs);
            sectie.appendChild(verwijder);
            document.getElementById("bestellingen").appendChild(sectie);
        });

        let sectie = document.createElement('section');
        sectie.className = 'besteldBoek';


        let totaalTekst = document.createElement('div');
        totaalTekst.className = 'besteldBoek__totaal-tekst';
        totaalTekst.innerHTML = 'Totaal: ';

        let totaalPrijs = document.createElement('div');
        totaalPrijs.className = 'besteldBoek__totaal-prijs';
        totaalPrijs.textContent = this.totaalPrijs().toLocaleString('nl-NL', { currency: 'EUR', style: 'currency' });

        sectie.appendChild(totaalTekst);
        sectie.appendChild(totaalPrijs);
        document.getElementById('bestellingen').appendChild(sectie);

        //Updat de winkel wagen
        if (this.items.length > 0) {
            document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
        } else {
            document.querySelector('.winkelwagen__aantal').innerHTML = '';
        }
    }
}

winkelwagen.haalItemsOp();
winkelwagen.uitvoeren();