import { getStrNomsPersos, getRandomPersos } from './persos.js';
import { testOpposition } from './combat.js';

const maxNiveauMat = 10; 
var persosTournoi = [];
var positionGagnant = 1;

function getNomTournoi(typeTournoi){
	let nomTournoi = "";
	switch(typeTournoi){
		case "com":
			nomTournoi = "de combat";
			break;
		case "agi":
			nomTournoi = "d'agilité";
			break;
		case "sen":
			nomTournoi = "d'archerie";
			break;
		case "vig":
			nomTournoi = "de boisson";
			break;
		case "esp":
			nomTournoi = "de magie";
			break;
		case "mat_init" :
		case "mat" :
			nomTournoi = "Haut de la Hune"
			break;
	}				
	return nomTournoi;
}

function simulerTournoi(embedMessageTournoi, typeTournoi, afficherDegats, persosCombat, nbConcurrents){	
	//simuler tournoi d'un type
	embedMessageTournoi.setTitle("Tournoi " + getNomTournoi(typeTournoi));	
	embedMessageTournoi.setColor("#aef2ea");
	
	switch(typeTournoi){
		case "mat_init" :
		case "mat" :
		case "mat_tombe":
			embedMessageTournoi = simulerTournoiMonteeDuMat(embedMessageTournoi,typeTournoi,persosCombat, nbConcurrents);
			break;
	}
	
	return embedMessageTournoi;
}

function simulerTournoiMonteeDuMat(embedMessageTournoi, typeTournoi, persosCombat, nbConcurrents){
	if(typeTournoi == "mat_init"){
		console.log("*************MAT INIT:");		
		let nbPersosAChoisir = (nbConcurrents-persosCombat.length);
		let persosChoisis = getRandomPersos(nbPersosAChoisir,["Combattant", "Gabier"]);
		persosTournoi = persosChoisis.concat(persosCombat);
		
		//init des placements au sol et de la place gagnante
		for(let i=0;i<persosTournoi.length;i++){
			persosTournoi[i].placement = 0;
			persosTournoi[i].ordreArrivee = -1;
		}
		positionGagnant = 1;
		console.log("persosTournoi:" + getStrNomsPersos(persosTournoi));
		
		embedMessageTournoi.addField(nbConcurrents + " participants : " + getStrNomsPersos(persosTournoi), getMatAvecPersosPlaces(true));
	}else if(typeTournoi == "mat"){	
		console.log("*************MAT:");
		if(persosTournoi.length == 0){
			embedMessageTournoi.addField("ECHEC", "Aucun perso sélectionné, merci d'utiliser le mat_init.")
			return embedMessageTournoi;
		}
		let resTest = testOpposition(persosTournoi, "vig", persosTournoi.length, embedMessageTournoi);
		setPlacementPersosParReussites(resTest);
		embedMessageTournoi.addField(persosTournoi.length + " participants : " + getStrNomsPersos(persosTournoi), getMatAvecPersosPlaces());
	}else if(typeTournoi == "mat_tombe"){	
		console.log("*************MAT TOMBE:" + getStrNomsPersos(persosCombat));
		setPlacementPersosTombes(persosCombat);
		embedMessageTournoi.addField(persosTournoi.length + " participants : " + getStrNomsPersos(persosTournoi), getMatAvecPersosPlaces());
	}
	return embedMessageTournoi;
}

function getMatAvecPersosPlaces(forInit){
	let valueForField = ":ladder:#10#\n:ladder:#9#\n:ladder:#8#\n:ladder:#7#\n:ladder:#6#\n:ladder:#5#\n:ladder:#4#\n:ladder:#3#\n:ladder:#2#\n:ladder:#1#\n:leaves:#0#";
	
	for(let i=0;i<=maxNiveauMat;i++){
		let nomsPersosACeNiveau = "";
		for(let j=0;j<persosTournoi.length;j++){
			if(persosTournoi[j].placement == i){
				if(i == maxNiveauMat){
					nomsPersosACeNiveau += getMedaillesParOrdreArrivee(persosTournoi[j].ordreArrivee);
				}
				nomsPersosACeNiveau += persosTournoi[j].nom;
				if(forInit) nomsPersosACeNiveau += "(" + persosTournoi[j].idPerso + ")";
				
				nomsPersosACeNiveau += ", ";				
			}
		}
		nomsPersosACeNiveau = nomsPersosACeNiveau.slice(0, nomsPersosACeNiveau.length-2);
		valueForField = valueForField.replace("#" + i + "#", nomsPersosACeNiveau);
	}	
	return valueForField;
}

function setPlacementPersosParReussites(resTests){	
	for(let i=0;i<persosTournoi.length;i++){
		for(let j=0;j<resTests.length;j++){
			//&& persosTournoi[i].placement != maxNiveauMat
			if(resTests[j].nbReussites > 0 && resTests[j].perso.idPerso == persosTournoi[i].idPerso){
				let nouveauPlacement = persosTournoi[i].placement + resTests[j].nbReussites;
				nouveauPlacement = nouveauPlacement>maxNiveauMat ? maxNiveauMat : nouveauPlacement;
				if(nouveauPlacement == maxNiveauMat && persosTournoi[i].ordreArrivee == -1) {
					persosTournoi[i].ordreArrivee = positionGagnant;
					positionGagnant++;
				}
				persosTournoi[i].placement = nouveauPlacement;
			}
		}
	}
}

function setPlacementPersosTombes(persosTombes){
	for(let i=0;i<persosTournoi.length;i++){
		for(let j=0;j<persosTombes.length;j++){
			if(persosTombes[j].idPerso == persosTournoi[i].idPerso){
				console.log("Perso tombé : " + persosTournoi[i].nom);
				persosTournoi[i].placement = 0;
			}
		}
	}
}

function getMedaillesParOrdreArrivee(currOrdreArrivee){
	let msgMedaille = "";
	if(currOrdreArrivee >3) return msgMedaille; // pas de médaille
	
	switch(currOrdreArrivee){
		case 1:
			msgMedaille = ":first_place: ";
			break;
		case 2:
			msgMedaille = ":second_place: ";
			break;
		case 3:
			msgMedaille = ":third_place: ";
			break;

	}
	return msgMedaille;
}

export { persosTournoi, getNomTournoi, simulerTournoi, getRandomPersos };