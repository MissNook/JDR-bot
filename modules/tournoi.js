import { getStrNomsPersos, getRandomPersos } from './persos.js';
import { testOpposition } from './combat.js';

const maxNiveauMat = 10; 
var persosTournoi = [];

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

function simulerTournoi(embedCombat, typeTournoi, afficherDegats, persosCombat, nbConcurrents){	
	//simuler tournoi d'un type
	embedCombat.setTitle("Tournoi " + getNomTournoi(typeTournoi));	
	embedCombat.setColor("#aef2ea");
	
	if(typeTournoi == "mat_init"){
		console.log("*************MAT INIT:");
		let nbPersosAChoisir = (nbConcurrents-persosCombat.length);
		let persosChoisis = getRandomPersos(nbPersosAChoisir,["Combattant", "Gabier"]);
		persosTournoi = persosChoisis.concat(persosCombat);
		
		//init des placements au sol
		for(let i=0;i<persosTournoi.length;i++){
			persosTournoi[i].placement = 0;
		}
		console.log("persosTournoi:" + getStrNomsPersos(persosTournoi));
		
		embedCombat.addField(nbConcurrents + " participants : " + getStrNomsPersos(persosTournoi), getMatAvecPersosPlaces(true));
	}else if(typeTournoi == "mat"){	
		console.log("*************MAT:");
		if(persosTournoi.length == 0){
			embedCombat.addField("ECHEC", "Aucun perso sélectionné, merci d'utiliser le mat_init.")
			return embedCombat;
		}
		let resTest = testOpposition(persosTournoi, "vig", persosTournoi.length, embedCombat);
		setPlacementPersosParReussites(resTest);
		embedCombat.addField(persosTournoi.length + " participants : " + getStrNomsPersos(persosTournoi), getMatAvecPersosPlaces());
	}else if(typeTournoi == "mat_tombe"){	
		console.log("*************MAT TOMBE:" + getStrNomsPersos(persosCombat));
		setPlacementPersosTombes(persosCombat);
		embedCombat.addField(persosTournoi.length + " participants : " + getStrNomsPersos(persosTournoi), getMatAvecPersosPlaces());
	}
	return embedCombat;
}

function getMatAvecPersosPlaces(forInit){
	let valueForField = ":ladder:#10#\n:ladder:#9#\n:ladder:#8#\n:ladder:#7#\n:ladder:#6#\n:ladder:#5#\n:ladder:#4#\n:ladder:#3#\n:ladder:#2#\n:ladder:#1#\n:leaves:#0#";
	
	for(let i=0;i<=maxNiveauMat;i++){
		let nomsPersosACeNiveau = "";
		for(let j=0;j<persosTournoi.length;j++){
			if(persosTournoi[j].placement == i){
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

export { persosTournoi, getNomTournoi, simulerTournoi, getRandomPersos };