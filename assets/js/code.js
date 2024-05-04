window.onload = function() {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function(e) {
        
        let file = fileInput.files[0];

        let textType = new RegExp("text.*");

        if (file.type.match(textType)) { 
            var reader = new FileReader();

            reader.onload = function(e) {
                fileDisplayArea.innerText = reader.result;
            }

            reader.readAsText(file);    

            document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès</span>';
        } else { 
            fileDisplayArea.innerText = "";
            document.getElementById("logger").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
}

var afficherAide = false;
function ChangerAide() {
    let div = document.getElementById('help')

    if (afficherAide) {
        afficherAide = false;
        div.classList = ""
    }
    else {
        afficherAide = true;
        div.classList = "show"
    }

}

function readFile(ready) {
    var file = document.getElementById('fileInput').files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var content = e.target.result;
        ready(tokenizer(content.toLowerCase()));
    }

    reader.readAsText(file)
}

function segmentation() {
    readFile(function(content) {
        var words = content;
        var wordStats = {};
    
        words.forEach(function (word) {
            var length = word.length;
    
            if (!wordStats[length]) {
                wordStats[length] = {
                    count: 0,
                    uniqueForms: new Set()
                };
            }
    
            wordStats[length].count++;
            wordStats[length].uniqueForms.add(word);
        });
    
       
        var table = '<table border="1"><tr><th>Nombre de caractères</th><th>Nombre d\'occurrences</th><th>Forme(s) unique(s)</th></tr>';
        for (var length in wordStats) {
            var stats = wordStats[length];
            var uniqueForms = Array.from(stats.uniqueForms);
            table += `<tr>
                        <td>
                            ${length}
                        </td>
                        <td>
                            ${stats.count}
                        </td>
                        <td>
                            ${uniqueForms.join(', ')}
                            (${uniqueForms.length})
                        </td>
                    </tr>`
    
        }
        table += '</table>';
    
        var analysisDiv = document.getElementById('page-analysis');
        analysisDiv.innerHTML = table;
    });
}

function tokenizer(text) {
    let delims = document.getElementById('delimID').value;
    const regex = new RegExp("[" + Array.from(delims).map((e) => '\\' + e + '\n' + "\r") + "]");
    var words = text.split(regex);
    words = words.filter((word) => word.length && word !== " ");
    return words;
}

function calculerCooccurrents(ready) {
    var mot = document.getElementById('poleID').value;
    var maxDistance = parseInt(document.getElementById('lgID').value) + 1;
    
    if (!mot.trim()) {
        alert("Veuillez entrer un terme.");
        return;
    }
    
    if (isNaN(maxDistance)) {
        alert("Veuillez entrer des valeurs valides pour l'intervalle de distance.");
        return;
    }
    
    readFile(function(words) {
        var cooccurrents = {};
    
        if (!words.includes(mot)) {
            alert("Le terme '" + mot + "' ne se trouve pas dans le texte.");
            return;
        }
    
        words.forEach(function (word, index) {
            if (word === mot) {
                const wordsLeft = words.slice(index - maxDistance, index);
                const wordsRight = words.slice(index, index + maxDistance);
                wordsLeft.forEach(function (word) {
                    if (word !== mot) {
                        let cooccurrent = cooccurrents[word];
                        if (cooccurrent)
                            cooccurrent.frequenceGauche = cooccurrent.frequenceGauche + 1;
                        else
                            cooccurrents[word] = { frequenceGauche: 1, frequenceDroite: 0 };
                    }
                })
                wordsRight.forEach(function (word) {
                    if (word !== mot) {
                        let cooccurrent = cooccurrents[word];
                        if (cooccurrent)
                            cooccurrent.frequenceDroite = cooccurrent.frequenceDroite + 1;
                        else
                            cooccurrents[word] = { frequenceGauche: 0, frequenceDroite: 1 };
                    }
                })
            }
        });
    
        for (let word in cooccurrents) {
            var cooccurrent = cooccurrents[word];
            var coFrequence = cooccurrent.frequenceGauche + cooccurrent.frequenceDroite;
            var pourcentageFrequenceGauche = cooccurrent.frequenceGauche / coFrequence * 100;
            var pourcentageFrequenceDroite = cooccurrent.frequenceDroite / coFrequence * 100;
            
            cooccurrent.mot = word;
            cooccurrent.coFrequence = coFrequence;
            cooccurrent.pourcentageFrequenceGauche = pourcentageFrequenceGauche;
            cooccurrent.pourcentageFrequenceDroite = pourcentageFrequenceDroite;
        }
    
        ready(cooccurrents);
    })
}


function afficherCooccurrents() {
    calculerCooccurrents(function(cooccurrents) {
        var table = '<table border="1"><tr><th>Cooccurrent(s)</th><th>Co-fréquence</th><th>Fréquence gauche</th><th>% Fréquence gauche</th><th>Fréquence droite</th><th>% Fréquence droite</th></tr>';
        for (let word in cooccurrents) {
            var cooccurrent = cooccurrents[word];
            table += '<tr>';
            table += '<td>' + word + '</td>';
            table += '<td>' + cooccurrent.coFrequence + '</td>';
            table += '<td>' + cooccurrent.frequenceGauche + '</td>';
            table += '<td>' + cooccurrent.pourcentageFrequenceGauche.toFixed(2) + '%</td>';
            table += '<td>' + cooccurrent.frequenceDroite + '</td>';
            table += '<td>' + cooccurrent.pourcentageFrequenceDroite.toFixed(2) + '%</td>';
            table += '</tr>';
        }
        table += '</table>';
    
        var analysisDiv = document.getElementById('page-analysis');
        analysisDiv.innerHTML = table;
    })
    
}

function afficherCooccurrentsGraphique() {
    calculerCooccurrents(function(cooccurrents) {
        var options = {
            horizontalBars: true,
        };

        var list = Object.values(cooccurrents).sort((mot1, mot2) => mot2.coFrequence - mot1.coFrequence).slice(0, 9);
        
        var data = {
            labels: list.map((cooccurrent) => cooccurrent.mot).reverse(),
            series: [
                list.map(cooccurrent => cooccurrent.frequenceDroite).reverse(),
                list.map(cooccurrent => cooccurrent.frequenceGauche).reverse(),
                list.map(cooccurrent => cooccurrent.coFrequence).reverse(),
            ]
        }
        
        var analysisDiv = document.getElementById('page-analysis');
        analysisDiv.innerHTML = '<div class="ct-chart ct-golden-section"></div>';
        new Chartist.Bar('.ct-chart', data, options);
    
    })
    
}




