

function MaFonction() {
//Récupération du poème
let poem = document.getElementById('poeme').value.trim();

//Récupération de la zone de texte pour l'affichage des résultats
let result = document.getElementById('my-button');

//Création d'un tableau contenant toutes les lignes du poème
let lines = poem.split('\n'); 

//Création d'un tableau contenant uniquement les vers du poèmes (à partir de la 2e ligne)
let all_vers = lines.splice(2);

//Création d'un tableau contenant tous les mots du poème et d'un dictionnaire de fréquence
let all_mots = [] ;
let freq_mots = {};

all_vers.forEach (vers => {
    if (vers.length>0){
        vers = vers.trim ();
        vers = vers.replace(/([,;!:]|--)/g,'');
        vers = vers.replace(/\./g,' ');
        vers = vers.replace(/'/g,"' ");        
        mots = vers.toLowerCase().split(' ');
        mots.forEach( mot => {
            if (mot.match(/\p{L}/u)){
                all_mots.push(mot);                
                if (freq_mots.hasOwnProperty(mot)==false){
                    freq_mots[mot.toLowerCase()] = 1;
                }
                else{
                    freq_mots[mot.toLowerCase()] += 1;
                }
            }
        })
    }
})

//Affichage des dix mots les plus fréquents
let valeurs= {};
let top_dix = [];

for (elem of Object.keys(freq_mots)){
    if (valeurs.hasOwnProperty(freq_mots[elem])==false){
        valeurs[freq_mots[elem]] = [elem];
     }
     else{
        valeurs[freq_mots[elem]].push(elem);
     }
}

let freq_croiss = Object.keys(valeurs).reverse();

for (item of freq_croiss){
    for (word of valeurs[item]){
         if (top_dix.length<10){
             top_dix.push(word);
         }
      }
 }

 // Calcul de la richesse lexicale du poème
let lexical_richness = Object.keys(freq_mots).length/all_mots.length

//Nombre de phrases dans le poème
let text_string = all_vers.join(' ');
let phrases = text_string.split(/[\.\?!][\s]/g);
/*On peut aussi faire text_string.split(/[\.\?!]/g), il faudra cependant enlever le dernier élément de la liste
qui sera une chaîne de caractères vides avec filter*/



//Longueur moyenne des mots par phrase
let per_sent = "";
let ind = 0;
for (let phrase of phrases) {
    ind +=1;
    let size= 0;
    phrase = phrase.trim ();
    phrase = phrase.replace(/([,;:!?\.]|--)/g,'');
    phrase = phrase.replace(/'/g,"' ");        
    let words = phrase.split(' ');
    for (let word of words) {
        size += word.length;
    }
    longueurmoyenne = size/words.length;
    per_sent += '- Phrase ' + ind + ' : ' + longueurmoyenne.toFixed(2) + '<br/>';
}




//Décompte des strophes

let strophes = [];
let temp = [];

all_vers.forEach (vers => {
    if (vers.length===0){
        strophes.push(temp);
        temp = [];
    }
    else if (vers===all_vers[all_vers.length-1]){       
        temp.push(vers);
        strophes.push(temp);
    }
    else {
        temp.push(vers);
    }
})

//Typologie des strophes
let type_strophes = {};
for (liste_vers of strophes){
    if (type_strophes.hasOwnProperty(liste_vers.length)==false){
        type_strophes[liste_vers.length] = [strophes.indexOf(liste_vers)+1];
     }
     else{
        type_strophes[liste_vers.length].push(strophes.indexOf(liste_vers)+1);
     }
}

let result_strophes =[];

for (ens_lignes of Object.keys(type_strophes)){
    result_strophes.push(`${type_strophes[ens_lignes].length} strophe(s) de ${ens_lignes} lignes [${type_strophes[ens_lignes]}]`);
}


//Décompte des syllabes

let type_syll = {};

let cleaned_vers= [];


for (vers of all_vers) {    
    if (vers.length>0){ 
        cleaned_vers.push(vers);      
    }
}

for (let line of cleaned_vers){
        sans_espace = line.trim().replace(/\s/g,'');       
        let syll = sans_espace.match(/[aàâiîeéèêoôuù]{1,}/g).length;
        if (syll>0){
        
            if (type_syll.hasOwnProperty(syll)==false){
                type_syll[syll] = [cleaned_vers.indexOf(line)+1];
            }
            else{
            type_syll[syll].push(cleaned_vers.indexOf(line)+1);
            }                                       
        }    
}   

let result_vers=[];

for (count_syll of Object.keys(type_syll)){
    result_vers.push(`${type_syll[count_syll].length} vers de ${count_syll} syllabes [${type_syll[count_syll]}]`);
}


//Ecriture dans la balise HTML de la page

result.innerHTML= `<p style="text-align:left;">1. Les dix les plus fréquents du poème sont : ${top_dix.join(' -- ')}.</p><br/>`+
`<p style="text-align:left;">2. La richesse lexicale du poème est de ${lexical_richness}.</p><br/>` +
`<p style="text-align:left;">3. Le poème contient ${phrases.length} phrase(s).</p><br/>`+
`<p style="text-align:left;">4. Longueur moyenne des mots par phrase : </br>  ${per_sent}</p><br/>`+
`<p style="text-align:left;">5. Le poème contient ${strophes.length} strophes : ${result_strophes.join(', ')}.</p><br/>`+
`<p style="text-align:left;">6. Le poème contient également : ${result_vers.join(', ')}.</p><br/>` +
`<p style="text-align:left;">7. Ce code a été testé sur les trois poèmes suivants: La Musique de Charles Baudelaire, Le Bouquet de Marceline Desbores-Valmore et Du Mal content d'amour de Clément Marot.</p>`;

}


