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


function segmentation() {
    var file = document.getElementById('fileInput').files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var content = e.target.result;
        var words = content.split(/\s+/);
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
            table += '<tr><td>' + length + '</td><td>' + stats.count + '</td><td>' + Array.from(stats.uniqueForms).join(', ') + '</td></tr>';
        }
        table += '</table>';

        var analysisDiv = document.getElementById('page-analysis');
        analysisDiv.innerHTML = table;
    };

    reader.readAsText(file);
}

function tokenizer(text) {
    var words = text.split(/\s+/);
    return words;
}


function afficherCooccurrents() {
    var mot = document.getElementById('poleID').value;
    var minLength = parseInt(document.getElementById('minLengthInput').value);
    var maxLength = parseInt(document.getElementById('maxLengthInput').value);
    var intervalleDeLongueur = [minLength, maxLength];


    if (!mot.trim()) {
        alert("Veuillez entrer un terme.");
        return;
    }

    if (isNaN(minLength) || isNaN(maxLength) || minLength < 0 || maxLength < minLength) {
        alert("Veuillez entrer des valeurs valides pour l'intervalle de longueur.");
        return;
    }

    var file = document.getElementById('fileInput').files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var content = e.target.result;
        var words = tokenizer(content);
        var cooccurrents = [];
        var coFrequence = 0;
        var frequenceGauche = 0;
        var frequenceDroite = 0;

        if (!words.includes(mot)) {
            alert("Le terme '" + mot + "' ne se trouve pas dans le texte.");
            return;
        }

        words.forEach(function (word, index) {
            if (word.length >= intervalleDeLongueur[0] && word.length <= intervalleDeLongueur[1] && word !== mot) {
                if (word.includes(mot) || mot.includes(word)) {
                    cooccurrents.push(word);
                    coFrequence++;
                    if (index > 0 && words[index - 1] === mot) {
                        frequenceGauche++;
                    }
                    if (index < words.length - 1 && words[index + 1] === mot) {
                        frequenceDroite++;
                    }
                }
            }
        });

        var table = '<table border="1"><tr><th>Cooccurrent(s)</th><th>Co-fréquence</th><th>Fréquence gauche</th><th>% Fréquence gauche</th><th>Fréquence droite</th><th>% Fréquence droite</th></tr>';
        cooccurrents.forEach(function (cooccurrent) {
            var pourcentageFrequenceGauche = (frequenceGauche / coFrequence) * 100;
            var pourcentageFrequenceDroite = (frequenceDroite / coFrequence) * 100;
            table += '<tr>';
            table += '<td>' + cooccurrent + '</td>';
            table += '<td>' + coFrequence + '</td>';
            table += '<td>' + frequenceGauche + '</td>';
            table += '<td>' + pourcentageFrequenceGauche.toFixed(2) + '%</td>';
            table += '<td>' + frequenceDroite + '</td>';
            table += '<td>' + pourcentageFrequenceDroite.toFixed(2) + '%</td>';
            table += '</tr>';
        });
        table += '</table>';

        var analysisDiv = document.getElementById('page-analysis');
        analysisDiv.innerHTML = table;
    };

    reader.readAsText(file);
}
