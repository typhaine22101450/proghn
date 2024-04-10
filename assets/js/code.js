window.onload = function() {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');

    // On "écoute" si le fichier donné a été modifié.
    // Si on a donné un nouveau fichier, on essaie de le lire.
    fileInput.addEventListener('change', function(e) {
        // Dans le HTML (ligne 22), fileInput est un élément de tag "input" avec un attribut type="file".
        // On peut récupérer les fichiers données avec le champs ".files" au niveau du javascript.
        // On peut potentiellement donner plusieurs fichiers,
        // mais ici on n'en lit qu'un seul, le premier, donc indice 0.
        let file = fileInput.files[0];
        // on utilise cette expression régulière pour vérifier qu'on a bien un fichier texte.
        let textType = new RegExp("text.*");

        if (file.type.match(textType)) { // on vérifie qu'on a bien un fichier texte
            // lecture du fichier. D'abord, on crée un objet qui sait lire un fichier.
            var reader = new FileReader();

            // on dit au lecteur de fichier de placer le résultat de la lecture
            // dans la zone d'affichage du texte.
            reader.onload = function(e) {
                fileDisplayArea.innerText = reader.result;
            }

            // on lit concrètement le fichier.
            // Cette lecture lancera automatiquement la fonction "onload" juste au-dessus.
            reader.readAsText(file);    

            document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès</span>';
        } else { // pas un fichier texte : message d'erreur.
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

