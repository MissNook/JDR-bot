import * as LanceurDes from "./lanceurDes.js";
var tabCibles = [];
var tabIdPersosKO = [];
var messagesForEmbed = [];
var embedCombat;

//simule le combat et prépare le message d'embed en conséquences
function simulerCombatArene(embedMessage, typeCombat, afficherDegats, persosCombat){	
    tabIdPersosKO = [];
    messagesForEmbed = [];
    embedCombat = embedMessage;

	let listeIdCombattantParInitiative = calculerInitiative(persosCombat);	
	initCibles(listeIdCombattantParInitiative);
	//reinitStatsTemp(persosCombat);
	let finCombat = false;
	
	while(!finCombat){
		let apresCoups = echangeCoups(persosCombat, listeIdCombattantParInitiative, typeCombat, afficherDegats);
		//on récupère le nouvel état des combattants
		persosCombat = apresCoups.persosCombatUpdated;
		finCombat = apresCoups.finCombat;		
	}
}

// Retourne un objet {persosCombatUpdated : persosCombat, KO : true/false}
function echangeCoups(persosCombat, listeIdCombattantParInitiative, typeCombat, afficherDegats){
	let finCombat = false;
	let deroulementCoup = "";
	let casCombat = "";
	switch(typeCombat){
		case "com" :
		case "agi" :
		case "vig" :
		case "esp" :
		case "sen" :
			casCombat = "opposition";
			break;
		case "cac" :
		case "libre":
		case "tournoi":
			casCombat = typeCombat;
			break;		
	}
	
	let messageCombat = "";
	switch(casCombat) {
		case "opposition" :
			console.log("test d'opposition");
			testOpposition(persosCombat, typeCombat);
			finCombat = true;	
			break;
		case "cac" :
			console.log("test de CAC");
			testCAC(persosCombat, listeIdCombattantParInitiative, afficherDegats);
			finCombat = getFinCombat(persosCombat);	
			break;	
		case "libre" :
			console.log("test libre");
			testCombatLibre(persosCombat, listeIdCombattantParInitiative);
			finCombat = getFinCombat(persosCombat);
			break;
		case "tournoi":
			console.log("tournoi");
			testTournoi(typeCombat, persosCombat);
			break;
	}
	return {persosCombatUpdated :persosCombat, finCombat : finCombat};
}

function calculerInitiative(persosCombat){
	let listeIdCombattantParInitiative = [];
	let listInits = [];
	for(let i=0;i<persosCombat.length;i++){
		let currInit = persosCombat[i].stats.agi*10 + persosCombat[i].stats.com;
		listInits.push({init : currInit, idCombattant : i});
	}
	listInits.sort(sortInitiative);
	for(let i=0;i<listInits.length;i++){
		console.log("ListInits[" + i + "] = " + listInits[i].idCombattant);
		listeIdCombattantParInitiative.push(listInits[i].idCombattant);
	}
	
	return listeIdCombattantParInitiative;
}

function sortInitiative(init1, init2){
	//En cas d'égalité d'initiative, on choisit aléatoirement un des joueurs
	if(init1.init == init2.init){
		return (Math.floor(Math.random() * 2)==0)? -1 :1;
	}	
	if(init1.init > init2.init)
		return -1;	
	else
		return 1;
	
}

function testOpposition(persosCombat, typeCombat, nbPourMultiPersos, embedToUse){
    let nameFieldEmbed = "**Opposition de " + typeCombat.toUpperCase() + " : **";
    let valueFieldEmbedStr = "__#p1__ gagne contre __#p2__ avec un score de **#s1** contre **#s2**!!";
    let resultatDes1 = -1;
    let resultatDes2 = -1;
    let multiPersos = (typeof nbPourMultiPersos !== "undefined");
    let nbPersos = (multiPersos && nbPourMultiPersos>2)? nbPourMultiPersos : 2;		
    let resMulti = [];
    if(embedToUse) embedCombat = embedToUse;
    
    // Un test d'opposition ne prend que les deux premiers personnages dans l'ordre d'initiative
    if(!multiPersos && persosCombat.length>2){
        embedCombat.setDescription(embedCombat.description + " (Attention, les tests d'opposition ne prennent en compte que les 2 personnages à la meilleure initiative).")
    }

    let valueFieldEmbed = valueFieldEmbedStr;
    let gagnant = "";
    let perdant = "";
    let reussitesGagnant = 0;
    let reussitesPerdant = 0;
    let combattant1;		
    for(let i=0;i<nbPersos;i++){
        if(multiPersos){				
            combattant1 = persosCombat[i];
            resultatDes1 = LanceurDes.jetDesStat(combattant1, typeCombat).nbReussites;
            resMulti.push({perso : persosCombat[i], nbReussites : resultatDes1});
            continue;
        }
        if(resultatDes1 == -1) {
            combattant1 = persosCombat[i];
            resultatDes1 = LanceurDes.jetDesStat(combattant1, typeCombat).nbReussites;
            continue;
        }

        resultatDes2 = LanceurDes.jetDesStat(persosCombat[i], typeCombat).nbReussites;
        console.log("ResDes1 = " + resultatDes1 + "/ResDes2 = " + resultatDes2);
        if(resultatDes2 == resultatDes1) {
            console.log("égalité");
            valueFieldEmbed = "C'est une égalité entre __#p1__ et __#p2__ avec un score de **#s1**!!";
        }				
        if(resultatDes2 > resultatDes1) {
            console.log("Gagnant = " + persosCombat[i].nom);
            gagnant = persosCombat[i].nom;
            perdant = combattant1.nom;
            reussitesGagnant = resultatDes2;
            reussitesPerdant = resultatDes1;
        }
        else{	
            console.log("Gagnant2 = " + combattant1.nom);
            gagnant = combattant1.nom;
            perdant = persosCombat[i].nom;
            reussitesGagnant = resultatDes1;
            reussitesPerdant = resultatDes2;
        }
    }
    
    if(!multiPersos){
        valueFieldEmbed = valueFieldEmbed.replace("#p1", gagnant).replace("#p2", perdant);
        valueFieldEmbed = valueFieldEmbed.replace("#s1", reussitesGagnant ).replace("#s2", reussitesPerdant);
        embedCombat.addField(nameFieldEmbed, valueFieldEmbed);
        messagesForEmbed.push(embedCombat);
    }
    
    return resMulti;		
}

function testCAC(persosCombat, listeIdCombattantParInitiative, afficherDegats){
	console.log("TestCAC");
	let nameFieldEmbed = "**Combat au corps à corps**";
	let valueFieldEmbedStr = "__#p1__ attaque __#p2__ "; //#d2 correspond à la défense du p2 
	let valueFieldEmbed = "";
	
	for(let i=0;i<listeIdCombattantParInitiative.length;i++){
		let attaqueFaitDegats = false;
		let idCombattant = listeIdCombattantParInitiative[i];
		let currCombattant = persosCombat[idCombattant];
		if(currCombattant.statsTemp.pv <= 0) continue;
		
		let attaqueRes = LanceurDes.jetDesStat(currCombattant, "com");
		let idAdversaire = getCible(persosCombat, listeIdCombattantParInitiative, idCombattant);
		console.log("IdAdversaire = " + idAdversaire);
		//il n'y a plus d'adversaires
		if(idAdversaire == -1) break;
		let currAdversaire = persosCombat[idAdversaire];
		let armeCombattant = getArmeCombattant(currCombattant, "com");
		console.log("TestCAC - idCombattant=" + idCombattant+ " / idAdversaire=" + idAdversaire);
		console.log("nomCombattant="+ currCombattant.nom + "/ nomCible=" + currAdversaire.nom);
		//RAF check des spécials??
		
		if(attaqueRes.nbReussites ==0 || armeCombattant == null){
			console.log("Attaque échouée de "+ currCombattant.nom +" / nbReussites = " + attaqueRes.nbReussites);
			valueFieldEmbed += "__#p1__ a totalement échoué son attaque contre __#p2__ !!"
			valueFieldEmbed = valueFieldEmbed.replace("#p1", currCombattant.nom).replace("#p2", currAdversaire.nom);				
		}else{
			let defenseRes = LanceurDes.jetDesStat(currAdversaire, "def");	
			valueFieldEmbed += valueFieldEmbedStr;
			valueFieldEmbed = valueFieldEmbed.replace("#p1", currCombattant.nom).replace("#p2", currAdversaire.nom);
			if(defenseRes.nbReussites ==0){	
				console.log("Défense échouée de "+ currAdversaire.nom);
				valueFieldEmbed += ". __" + currAdversaire.nom + "__ n'arrive pas à se défendre et se prend";
				valueFieldEmbed += afficherDegats ?	" **#degats** dégâts ! " : " l'attaque !"; 
				attaqueFaitDegats = true;
			}
			else{
				attaqueRes.nbReussites = attaqueRes.nbReussites - defenseRes.nbReussites;
				if(attaqueRes.nbReussites <= 0){
					console.log("Défense totale de "+ currAdversaire.nom);
					valueFieldEmbed += "mais __" + currAdversaire.nom + "__ a une bonne armure qui le protège totalement de l'attaque !!";
				}
				else{
					valueFieldEmbed += afficherDegats ? " et assène **#degats** dégâts !" : "";
					attaqueFaitDegats = true;
				}
			}
			if(attaqueFaitDegats){
				let degats = LanceurDes.jetDesDegats(armeCombattant.degats, attaqueRes.nbReussites);
				console.log("Dégats = "+ degats + "/ PV avant dégâts =" + currAdversaire.statsTemp.pv);
				valueFieldEmbed = valueFieldEmbed.replace("#degats",degats);
				currAdversaire.statsTemp.pv -= degats;							
				if(currAdversaire.statsTemp.pv <= 0){
					embedCombat.addField(nameFieldEmbed, valueFieldEmbed);
					valueFieldEmbed = "";
				}else {
					setCible(idAdversaire, idCombattant);
				}
				
			}			
		}
		valueFieldEmbed += "\n";
		//RAF SPECIAL - attention spécial peut être sur autre type que COM, voir comment faire (p-e avant de comptabiliser combat)
	}
	if(valueFieldEmbed != "" && valueFieldEmbed != "\n")
		embedCombat.addField(nameFieldEmbed, valueFieldEmbed);
}

function testCombatLibre(persosCombat, listeIdCombattantParInitiative){
	//simuler distance combattants
	
}

function getFinCombat(persosCombat){
	let nbPersosKO = 0;
	for(let i=0;i<persosCombat.length;i++){
		console.log("PERSOS /  nom:" + persosCombat[i].nom + " - PV :" + persosCombat[i].statsTemp.pv);
		if(persosCombat[i].statsTemp.pv <= 0){				
			nbPersosKO++;			
			if(!isInTabIdPersosKO(i)) {
				embedCombat.addField("**Combattant KO**", persosCombat[i].nom + " est KO !");
				//pour éviter un trop long message, on stock le message à chaque KO
				messagesForEmbed.push(copyEmbedCombat(embedCombat));
				embedCombat.setDescription(embedCombat.description.replace(" et " + persosCombat[i].nom, ""));
				embedCombat.spliceFields(0, embedCombat.fields.length);	
				tabIdPersosKO.push(i);	
			}
		}
		console.log("NBPERSOKO="+ nbPersosKO +"/nbpersosCombat="+persosCombat.length);
		//il ne doit en rester qu'un!
		if(nbPersosKO >= persosCombat.length-1){
			messagesForEmbed[messagesForEmbed.length-1].addField("**Fin du Combat**", "Un seul combattant reste debout !");
			return true;
		}			
	}	
	return false;
}

function isInTabIdPersosKO(idToCheck){
	for(let i=0;i<tabIdPersosKO.length;i++){
		if(idToCheck == tabIdPersosKO[i]) return true;
	}
	return false;
}

function copyEmbedCombat(embedToCopy){
	let newEmbed = new Discord.MessageEmbed();
	newEmbed.setTitle(embedToCopy.title);
	newEmbed.setColor(embedToCopy.color);
	newEmbed.setDescription(embedToCopy.description);
	for(let i=0;i<embedToCopy.fields.length;i++){
		let currField = embedToCopy.fields[i];
		newEmbed.addField(currField.name, currField.value);
	}
	return newEmbed;
}

function reinitStatsTemp(persosCombat){
	for(let i=0;i<persosCombat.length;i++){
		persosCombat[i].statsTemp.com = persosCombat[i].stats.com;
		persosCombat[i].statsTemp.agi = persosCombat[i].stats.agi;
		persosCombat[i].statsTemp.vig = persosCombat[i].stats.vig;
		persosCombat[i].statsTemp.esp = persosCombat[i].stats.esp;
		persosCombat[i].statsTemp.sen = persosCombat[i].stats.sen;
		persosCombat[i].statsTemp.def = persosCombat[i].stats.def;
		persosCombat[i].statsTemp.defSpe = persosCombat[i].stats.defSpe;
		persosCombat[i].statsTemp.pv = persosCombat[i].stats.pvMax;
		persosCombat[i].statsTemp.mana = persosCombat[i].stats.manaMax;
	}	
}
function getArmeCombattant(combattant, typeTest){
	if(combattant.armes == null) return null;
	for(let i=0;i<combattant.armes.length;i++){
		if(combattant.armes[i] == null) return null;
		if(combattant.armes[i].typeTest == typeTest){
			return combattant.armes[i];
		}
	}
	return null;
}

function getCible(persosCombat, listeIdCombattantParInitiative, idCurrCombattant){
	console.log("getCible pour idCombattant=" + idCurrCombattant + "/nbCiblesRestantes =" + tabCibles.length);
	removeCiblesKO(persosCombat);
	//il n'en reste plus qu'un
	if(tabCibles.length == 1) return;
	
	for(let i=0;i<tabCibles.length;i++){
		let currTabCibleItem = tabCibles[i];
		if(currTabCibleItem.idCombattant == idCurrCombattant){
			console.log("idCibleFAV :" + currTabCibleItem.idCibleFav);
			if(currTabCibleItem.idCibleFav == -1) {
				setRandomCible(persosCombat, listeIdCombattantParInitiative, idCurrCombattant, i);
			}
			if(persosCombat[currTabCibleItem.idCibleFav].statsTemp.pv > 0){
				console.log("CIBLE AVEC PV = " + persosCombat[currTabCibleItem.idCibleFav].nom);
				return currTabCibleItem.idCibleFav;
			}else{
				setRandomCible(persosCombat, listeIdCombattantParInitiative, idCurrCombattant, i);
			}	
			if(persosCombat[currTabCibleItem.idCombattant].statsTemp.pv <= 0){
				return -1;
			} 			
		}
	}
	return -1;
}

function removeCiblesKO(persosCombat){
	for(let i=0;i<tabCibles.length;i++){
		let currIdCombattant = tabCibles[i].idCombattant; 
		if(persosCombat[currIdCombattant].statsTemp.pv <= 0){
			console.log("CIBLE KO = " + persosCombat[currIdCombattant].nom);
			tabCibles.splice(i,1);
			i--;
		}		
	}	
}

function setRandomCible(persosCombat, listeIdCombattantParInitiative, idCurrCombattant, idTabCible){
	console.log("setRandomCible");
	for(let i=0;i<listeIdCombattantParInitiative.length;i++){
		let idCombattantToCheck = listeIdCombattantParInitiative[i];
		if(idCombattantToCheck != idCurrCombattant && persosCombat[idCombattantToCheck].statsTemp.pv > 0){
			tabCibles[idTabCible].idCibleFav = idCombattantToCheck;
			return;
		}
	}
}

function setCible(idCombattant, idNewCible){
	//attribuer une sorte d'aggro
	console.log("SetCIBLE idComb=" + idCombattant + "/idNewCible=" + idNewCible);
	for(let i=0;i<tabCibles.length;i++){
		if(tabCibles[i].idCombattant == idCombattant && idCombattant != idNewCible){
			tabCibles[i].idCibleFav = idNewCible;
			return;
		}			
	}	
}

function initCibles(listeIdCombattantParInitiative){
	tabCibles = [];
	for(let i=0;i<listeIdCombattantParInitiative.length;i++){
		tabCibles.push({idCombattant : listeIdCombattantParInitiative[i], idCibleFav : -1})
	}
}

export { messagesForEmbed, embedCombat, simulerCombatArene, testOpposition };