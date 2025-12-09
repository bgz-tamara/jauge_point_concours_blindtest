// Insérez ceci dans la balise <script> de votre fichier

let scores = {}; // Objet pour stocker les scores {nomEquipe: score}
let currentMaxScore = 100; // Variable pour le score maximum, initialisée à 100

// Étape 1 : Demander et enregistrer les noms des équipes
function configurerEquipes() {
    const numEquipes = document.getElementById('numEquipes').value;
    const container = document.getElementById('nomEquipesContainer');
    container.innerHTML = '';
    scores = {}; // Réinitialise les scores

    if (numEquipes > 0) {
        for (let i = 1; i <= numEquipes; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Nom de l'équipe ${i}`;
            input.id = `nomEquipe${i}`;
            container.appendChild(input);
        }
        const startButton = document.createElement('button');
        startButton.textContent = "Démarrer le Scoreboard";
        startButton.onclick = afficherScoreboard;
        container.appendChild(startButton);
    }
}

// Étape 2 : Créer et afficher le tableau de score avec les jauges
function afficherScoreboard() {
    const container = document.getElementById('scoreboardContainer');
    const nomEquipesInputs = document.querySelectorAll('#nomEquipesContainer input');
    container.innerHTML = ''; // Nettoyer l'affichage précédent
    
    // --- NOUVEAUTÉ : Lire le score maximum sélectionné ---
    const maxScoreSelect = document.getElementById('maxScoreSelect');
    currentMaxScore = parseInt(maxScoreSelect.value);

    // Masquer la section de configuration
    document.getElementById('setup').style.display = 'none';

    nomEquipesInputs.forEach(input => {
        const nom = input.value || `Équipe ${input.id.slice(-1)}`;
        scores[nom] = 0; // Initialiser le score à 0

        // Créer la colonne de l'équipe
        const col = document.createElement('div');
        col.className = 'team-column';
        
        // Nom de l'équipe
        const nameDisplay = document.createElement('h3');
        nameDisplay.textContent = nom;
        col.appendChild(nameDisplay);

        // Score numérique
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'score-display';
        scoreDisplay.id = `score-${nom.replace(/\s/g, '-')}`; // ID unique
        scoreDisplay.textContent = '0';
        col.appendChild(scoreDisplay);

        // Base de la jauge
        const gaugeBase = document.createElement('div');
        gaugeBase.className = 'gauge-base';
        
        // Remplissage de la jauge
        const gaugeFill = document.createElement('div');
        gaugeFill.className = 'gauge-fill';
        gaugeFill.id = `fill-${nom.replace(/\s/g, '-')}`; // ID unique
        gaugeFill.style.height = '0%'; // Commence à zéro
        gaugeFill.style.backgroundColor = 'gold';
        gaugeBase.appendChild(gaugeFill);
        
        col.appendChild(gaugeBase);

        // Boutons de modification du score
        const btnPlus = document.createElement('button');
        btnPlus.textContent = "+1"; // Mieux de préciser la valeur
        btnPlus.onclick = () => mettreAJourScore(nom, 1);
        col.appendChild(btnPlus);

        const btnMinus = document.createElement('button');
        btnMinus.textContent = "-1"; // Mieux de préciser la valeur
        btnMinus.onclick = () => mettreAJourScore(nom, -1);
        col.appendChild(btnMinus);

        // Bouton pour les demi-points
        const btnHalfPlus = document.createElement('button');
        btnHalfPlus.textContent = "+0.5";
        btnHalfPlus.onclick = () => mettreAJourScore(nom, 0.5); // Ajout de 0.5
        btnHalfPlus.classList.add('btn-demi-point'); // <-- AJOUT DE LA CLASSE
        col.appendChild(btnHalfPlus);

        // Nouveau bouton pour retirer les demi-points
        const btnHalfMinus = document.createElement('button');
        btnHalfMinus.textContent = "-0.5";
        btnHalfMinus.onclick = () => mettreAJourScore(nom, -0.5); // Retire 0.5
        btnHalfMinus.classList.add('btn-demi-point'); // <-- AJOUT DE LA CLASSE
        col.appendChild(btnHalfMinus);
        
        container.appendChild(col);
    });
}

// Étape 3 : Gérer l'incrémentation/décrémentation et la mise à jour visuelle
function mettreAJourScore(nomEquipe, changement) {
    // 1. Mettre à jour la valeur du score
    scores[nomEquipe] += changement;
    
    // Assurez-vous que le score est correctement arrondi pour éviter les erreurs de float de JS 
    scores[nomEquipe] = parseFloat(scores[nomEquipe].toFixed(2)); 

    if (scores[nomEquipe] < 0) {
        scores[nomEquipe] = 0; // Empêcher les scores négatifs
    }
    
    const score = scores[nomEquipe];

    // 2. Mettre à jour l'affichage numérique
    const scoreDisplay = document.getElementById(`score-${nomEquipe.replace(/\s/g, '-')}`);
    if (scoreDisplay) {
        // Affiche avec un point décimal seulement si ce n'est pas un nombre entier (ex: 10 vs 10.5)
        scoreDisplay.textContent = Number.isInteger(score) ? score : score.toFixed(1);
    }

    // 3. Mettre à jour la hauteur de la jauge (en pourcentage)
    // --- UTILISE MAINTENANT currentMaxScore ---
    const pourcentage = Math.min(100, (score / currentMaxScore) * 100);
    const gaugeFill = document.getElementById(`fill-${nomEquipe.replace(/\s/g, '-')}`);
    if (gaugeFill) {
        gaugeFill.style.height = `${pourcentage}%`;
    }

    // Optionnel : Mettre en évidence l'équipe en tête
    determinerEtAfficherLeader();
}

// Étape 4 (Optionnel) : Déterminer le leader et appliquer le style au nom
function determinerEtAfficherLeader() {
    let maxScore = -1;
    let leader = null;
    
    // Trouver le score maximum
    for (const nom in scores) {
        if (scores[nom] > maxScore) {
            maxScore = scores[nom];
            leader = nom;
        }
    }

    // Mettre à jour visuellement les colonnes
    document.querySelectorAll('.team-column').forEach(col => {
        const nomEquipeElement = col.querySelector('h3');
        if (!nomEquipeElement) return; // Sécurité

        // 1. Enlever la couleur de l'ancien leader
        nomEquipeElement.classList.remove('team-leader-name');
        
        // 2. Appliquer la couleur au nouveau leader
        // On vérifie que le score maximum est supérieur à 0 pour désigner un leader
        if (nomEquipeElement.textContent === leader && maxScore > 0) {
            nomEquipeElement.classList.add('team-leader-name');
        }
    });
}

// Fonction pour terminer la partie, calculer et afficher le gagnant
function terminerPartie() {
    const nomGagnantElement = document.getElementById('nomGagnant');
    const scoreGagnantElement = document.getElementById('scoreGagnant');
    const classementListElement = document.getElementById('classementList');
    
    // Vider les anciens contenus
    classementListElement.innerHTML = '';
    scoreGagnantElement.textContent = '';
    
    // 1. Convertir l'objet scores en tableau d'équipes et trier
    // Trier par score décroissant.
    let equipesClassees = Object.keys(scores).map(nom => {
        return { nom: nom, score: scores[nom] };
    }).sort((a, b) => b.score - a.score);

    const maxScore = equipesClassees.length > 0 ? equipesClassees[0].score : 0;
    
    // 2. Identifier les leaders (pour gérer les égalités en première place)
    const leaders = equipesClassees.filter(equipe => equipe.score === maxScore);

    // 3. Préparer l'affichage du nom du gagnant principal
    let nomAffichage;
    let scoreGagnantAffichage = maxScore.toFixed(1);

    if (maxScore === 0) {
        nomAffichage = "Aucun score enregistré.";
        scoreGagnantAffichage = ""; // Pas de score à afficher si tout est à zéro
        nomGagnantElement.style.color = '#4A148C';
        nomGagnantElement.style.fontSize = '3em';
        nomGagnantElement.style.fontFamily = "'Montserrat', sans-serif";
    } else if (leaders.length > 1) {
        // Gérer les égalités en première place
        nomAffichage = "Égalité : " + leaders.map(e => e.nom).join(' et ');
        nomGagnantElement.style.color = 'orange';
        nomGagnantElement.style.fontSize = '3em';
        nomGagnantElement.style.fontFamily = "'Bungee Shade', cursive";
        
        // Cacher le score principal pour les égalités complexes, ou le laisser si c'est clair
        scoreGagnantAffichage = `Score : ${scoreGagnantAffichage} points`;    
    } else {
        // Un seul gagnant
        nomAffichage = leaders[0].nom;
        nomGagnantElement.style.color = 'gold';
        nomGagnantElement.style.fontSize = '5em'; 
        nomGagnantElement.style.fontFamily = "'Bungee Shade', cursive"; 
        
        // Cacher le score principal pour les égalités complexes, ou le laisser si c'est clair
        scoreGagnantAffichage = `Score : ${scoreGagnantAffichage} points`;  
    }

    // Afficher le score du gagnant principal
    scoreGagnantElement.textContent = scoreGagnantAffichage;

    // 4. Afficher le classement détaillé (à partir du 2ème/3ème...)
    
    // Le classement détaillé commence après les leaders
    const equipesNonLeaders = equipesClassees.slice(leaders.length);
    
    if (equipesNonLeaders.length > 0 || leaders.length > 1) {
        // Si plus d'une équipe existe, ou s'il y a égalité, on affiche le classement complet
        // Le classement détaillé commence après les leaders
        const equipesPourListe = equipesClassees; // On utilise la liste complète pour le parcours

        let position = 1;
        let rankHtml = ''; // Utilisation d'une variable pour construire le HTML de la liste
        
        // Parcourir toutes les équipes classées
        equipesPourListe.forEach((equipe, index) => {
            
            // Mettre à jour la position : si le score est inférieur au précédent, on incrémente le rang
            if (index > 0 && equipe.score < equipesPourListe[index - 1].score) {
                position = index + 1;
            } else if (index === 0) {
                position = 1;
            }

            // Si le gagnant est unique, on ignore l'affichage de cette équipe dans la liste détaillée.
            // On affiche toutes les autres.
            if (leaders.length === 1 && index === 0) {
                // L'équipe gagnante unique est déjà affichée en grand, on passe à la suivante
                return; 
            }

            // Préparer la ligne de classement
            const scoreFormatte = Number.isInteger(equipe.score) ? equipe.score : equipe.score.toFixed(1);
            
            // Début de la chaîne HTML pour l'élément de liste (avec backticks pour l'injection)
            let listItemHtml = `<p>`;
            
            // Mettre en gras le rang et le nom
            listItemHtml += `<strong>#${position}</strong> - ${equipe.nom} : <em><strong>${scoreFormatte}</strong> points</em>`;
            
            listItemHtml += `</p>`;

            // Ajouter l'élément à la liste
            rankHtml += listItemHtml;
        });
        
        // Injecter le HTML construit dans le conteneur
        classementListElement.innerHTML = rankHtml;
    }

    // 5. Afficher le résultat et masquer le tableau de bord
    document.getElementById('scoreboardContainer').style.display = 'none';
    document.querySelector('div[style="margin-top: 20px;"]').style.display = 'none'; 
    document.getElementById('setup').style.display = 'none'; 
    document.getElementById('resultatContainer').style.display = 'block';
    
    nomGagnantElement.textContent = nomAffichage;
}

// Fonction pour recommencer la partie
function recommencerPartie() {
    // 1. Réinitialiser les scores
    scores = {};

    location.reload();
}
