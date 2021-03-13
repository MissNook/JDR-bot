import { getStrNomsPersos, getRandomPersos } from './persos.js';
import { testOpposition } from './combat.js';

const maxNiveauMat = 10; 
var persosTournoi = [];
var positionGagnant = 1;
const emoteBonResultat = ":star:";
const emoteTresBonResultat = ":star2:";

function getInfoAffichageTournoi(typeTournoi){
	let infoTournoi = {emote : "", nomTournoi :"", nomParticipants :""};
	switch(typeTournoi){
		case "com":
			infoTournoi.nomTournoi = "de combat";
			infoTournoi.nomParticipants = "combattants";
			break;
		case "agi":
			infoTournoi.nomTournoi = "d'agilité";
			infoTournoi.nomParticipants = "gabiers et autres loustics";
			break;
		case "sen":
			infoTournoi.nomTournoi = "d'archerie";
			infoTournoi.emote = ":archery:";
			infoTournoi.nomParticipants = "archers";
			break;
		case "vig":
			infoTournoi.nomTournoi = "de boisson";
			infoTournoi.emote = ":beers:";
			infoTournoi.nomParticipants = "pirates";
			break;
		case "esp":
			infoTournoi.nomTournoi = "de magie";
			infoTournoi.emote = ":six_pointed_star:";
			infoTournoi.nomParticipants = "mages";
			break;
		case "mat" :
		case "mat_tombe":
			infoTournoi.nomTournoi = "Haut de la Hune"
			break;
	}
	return infoTournoi;	
}

function simulerTournoi(embedMessageTournoi, typeTournoi, persosCombat, nbConcurrents, forInit, nomsAcceptes, modeColonnes){	
	//simuler tournoi d'un type
	embedMessageTournoi.setTitle("Tournoi " + getInfoAffichageTournoi(typeTournoi).nomTournoi);	
	embedMessageTournoi.setColor("#aef2ea");
	console.log("Simuler Tournoi : " + typeTournoi + "/" + persosCombat.length + "/" + nbConcurrents + "/" + forInit);
	
	switch(typeTournoi){
		case "mat" :
		case "mat_tombe":
			embedMessageTournoi = simulerTournoiMonteeDuMat(embedMessageTournoi, typeTournoi, persosCombat, nbConcurrents, forInit , nomsAcceptes);
			break;
		case "com" :
		case "agi" :
		case "vig" :
		case "esp" :
		case "sen" :
			embedMessageTournoi = simulerTournoiSurUneStat(embedMessageTournoi, typeTournoi, persosCombat, nbConcurrents, forInit, nomsAcceptes, modeColonnes);
			break;
	}	
	return embedMessageTournoi;
}

function initPersosTournoi(persosCombat, nbConcurrents, nomsPersosAcceptes){
	console.log("Initialisation persos Tournoi");
	let nbPersosAChoisir = (nbConcurrents-persosCombat.length);
	let persosChoisis = getRandomPersos(nbPersosAChoisir,nomsPersosAcceptes);
	persosTournoi = persosChoisis.concat(persosCombat);
	console.log("FIN Initialisation persos Tournoi : " + persosTournoi.length);
}

function simulerTournoiMonteeDuMat(embedMessageTournoi, typeTournoi, persosCombat, nbConcurrents, forInit, nomsAcceptes){
	if(forInit || persosTournoi.length == 0){
		console.log("*************MAT INIT:");
		let noms = ["Combattant", "Gabier"];
		if(typeof nomsChoisis != "undefined" && nomsChoisis.length > 0){
			noms = nomsAcceptes;
		}
		initPersosTournoi(persosCombat, nbConcurrents, noms);	
		forInit = true;	
		//init des placements au sol et de la place gagnante
		for(let i=0;i<persosTournoi.length;i++){
			persosTournoi[i].placement = 0;
			persosTournoi[i].ordreArrivee = -1;
		}
		positionGagnant = 1;
		console.log("persosTournoi:" + getStrNomsPersos(persosTournoi));		
	}
	
	if(typeTournoi == "mat"){	
		console.log("*************MAT:");
		let resTest = testOpposition(persosTournoi, "vig", persosTournoi.length, embedMessageTournoi);
		setPlacementPersosParReussites(resTest);
		embedMessageTournoi.addField(persosTournoi.length + " participants : " + getStrNomsPersos(persosTournoi), getMatAvecPersosPlaces(forInit));
	}else if(typeTournoi == "mat_tombe"){	
		console.log("*************MAT TOMBE:" + getStrNomsPersos(persosCombat));
		setPlacementPersosTombes(persosCombat);
		embedMessageTournoi.addField(persosTournoi.length + " participants : " + getStrNomsPersos(persosTournoi), getMatAvecPersosPlaces(forInit));
	}
	return embedMessageTournoi;
}

function simulerTournoiSurUneStat(embedMessageTournoi,typeTournoi,persosCombat, nbConcurrents, forInit, nomsAcceptes, modeColonnes){
	console.log("simulerTournoiSurUneStat");
	if(forInit || persosTournoi.length == 0){
		forInit = true;
		initTournoiSurUneStat(typeTournoi, persosCombat,nbConcurrents, nomsAcceptes);
	}	
	let resTest = testOpposition(persosTournoi,typeTournoi, persosTournoi.length, embedMessageTournoi);
	let infoTournoi = getInfoAffichageTournoi(typeTournoi);	
	if(infoTournoi.emote != ""){
		embedMessageTournoi.title = infoTournoi.emote + embedMessageTournoi.title + infoTournoi.emote;
	}
	let msgRes = getMessageResultatTournoiSurUneStat(resTest, modeColonnes);
	embedMessageTournoi.addField("Résultat du tour des " + infoTournoi.nomParticipants, msgRes);

	return embedMessageTournoi;
}

function initTournoiSurUneStat(typeTournoi, persosCombat, nbConcurrents, nomsChoisis){
	let nomsAcceptes;
	if(typeof nomsChoisis != "undefined" && nomsChoisis.length > 0){
		nomsAcceptes = nomsChoisis;
	}
	else{
		switch(typeTournoi){
			case "com" :
				nomsAcceptes = ["Combattant", "Gabier"];
				break;
			case "agi" :
				nomsAcceptes = ["Gabier"];
				break;
			case "vig" :
				nomsAcceptes = ["Combattant"];
				break;
			case "esp" :
				nomsAcceptes = ["Mage"];
				break;
			case "sen" :
				nomsAcceptes = ["Archer"];
				break;
		}
	}
	initPersosTournoi(persosCombat, nbConcurrents, nomsAcceptes)
}

function getMessageResultatTournoiSurUneStat(resTests, modeColonnes){
	let msgRes = "";
	for(let i=0;i<resTests.length;i++){
		let currRes = resTests[i];
		for(let j=0;j<persosTournoi.length;j++){
			if(currRes.perso.idPerso == persosTournoi[j].idPerso){
				let marqueurReussites = "";
				let currPerso = persosTournoi[j];
				if(typeof currPerso.nbReussitesTotal == "undefined"){
					currPerso.reussitesParTour = [];
					currPerso.nbReussitesTotal = currRes.nbReussites;
				}
				else{
					currPerso.nbReussitesTotal += currRes.nbReussites;
				}			
				currPerso.reussitesParTour.push(currRes.nbReussites);

				if(modeColonnes){
					msgRes += currRes.perso.nom  + "(" + currPerso.idPerso + ") ";
					for(let k=0;k<currPerso.reussitesParTour.length;k++){
						msgRes += "\t -> " + currPerso.reussitesParTour[k] + " " + getMarqueurReussite(currPerso.reussitesParTour[k]);
					}
					msgRes += " --- Total = " + currPerso.nbReussitesTotal + "\n";
				}
				else{
					marqueurReussites = getMarqueurReussite(currRes.nbReussites);
					msgRes += currRes.nbReussites + " réussites pour "+ currPerso.nom + "(" + currPerso.idPerso + ") " + marqueurReussites + "\n";
				}
			}
		}		
	}
	return msgRes;
}

function getMarqueurReussite(nbReussites){
	if(nbReussites >=5){
		marqueurReussites = emoteTresBonResultat;
	}else if(nbReussites >=3){
		marqueurReussites = emoteBonResultat;
	}
}

function sortResTest(res1, res2){
	if(res1.nbReussites > res2.nbReussites)
		return -1;	
	else
		return 1;	
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

export { persosTournoi, getInfoAffichageTournoi, simulerTournoi, getRandomPersos };