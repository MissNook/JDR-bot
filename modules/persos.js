import {getRndInteger} from "./lanceurDes.js"

var tabNoms = ["Fiz", "Paula", "Chop", "Kalom", "Mistra", "Fobar", "Gregor", "Abbie", "Belio", "Cibole", "Domez", "Evrid", "Foutor", "Galli", "Hecter", "Ivino", "Julor", "Kester",
	"Jouma", "Kalia", "Lomo","Mesti","Nouvin","Oplik","Passpa","Querin","Roveli","Stimiri","Topra","Ulla","Versteur","Wriss","Xera","Yourn","Zenn","Agnes","Alexandra","Anders","Andréas","Anja","Anna","Anne","Anton","Antonia","Asta","Astrid","Axel","Beata","Birgit","Birgitta","Björn","Carina","Cécilia","Christin","Dagmar","Dagny","Daniel","Edvard","Elin","Elisabeth","Emanuel","Emil","Erik","Erika","Ester","Eva","Filip","Frans","Georg","Gerda","Gudrun","Gunhild","Gustav","Hanna","Hans","Harald","Hedvig","Helena","Helga","Helge","Hella","Henrik","Henrike","Hilda","Hildegard","Hildegarde","Ida","Ingmar","Ingrid","Ingvar","Irene","Ivar","Jacob","Jakob","Jarl","Johan","Johanna","Johannes","Josef","Karl","Karla","Karolina","Kasper","Kirsten","Klara","Knut","Konrad","Kristian","Kristin","Lars","Lena","Lennart","Lotta","Lucia","Magda","Magdalena","Maja","Margareta","Margit","Maria","Martha","Martina","Mathias","Mikael","Mikaela","Monika","Nanna","Nathanaël","Nora","Nordorn","Olga","Oskar","Per","Peter","Pia","Ragnar","Rita","Robert","Rolf","Rosa","Rosemarie","Rudolf","Ruth","Sara","Sigrid","Simon","Sonja","Stéfan","Sylvia","Tekla","Teodor","Thomas","Ulla","Ulrik","Ulrika","Ursula","Valdemar","Valentin","Véronika","Viktor","Viktoria","Viola","Waldemar","Walter","Werner"];

var tabSpecial = [];
fillTabSpecial();
var tabArmesTalents = [];
fillTabArmesTalents();

var tabPersos = createTabPersos();

function createTabPersos(){
	let tableauPersos = [];
		
	tableauPersos.push(createPerso("Fredro",4,2,5,1,2,1,1,26,26,7,5, [getSpecialInfo("Torgnole")], [getArmesEtTalentsInfo("Bras mécanique")]));
	tableauPersos.push(createPerso("MouetteGéante",2,3,2,0,3,0,0,6,6,0,1,null,[getArmesEtTalentsInfo("Frappe")]));
	tableauPersos.push(createPerso("BernardLHermite",3,1,3,0,1,3,1,6,6,0,1,null,[getArmesEtTalentsInfo("Frappe")]));
	tableauPersos.push(createPerso("Espadon",2,2,2,0,1,2,0,12,12,0,1,[getSpecialInfo("Dissimulation")], [getArmesEtTalentsInfo("Frappe moyenne")]));
	tableauPersos.push(createPerso("CombattantD",3,2,2,0,1,0,0,15,15,0,1,null,[getArmesEtTalentsInfo("Sabre")])); //COM
	tableauPersos.push(createPerso("CombattantC",3,3,2,0,1,0,0,15,15,0,2,null,[getArmesEtTalentsInfo("Sabre")]));//COM + AGI
	tableauPersos.push(createPerso("CombattantB",4,2,2,0,1,0,0,15,15,0,2,null,[getArmesEtTalentsInfo("Sabre")]));//COM
	tableauPersos.push(createPerso("CombattantA",4,3,2,0,1,0,0,20,20,0,3,null,[getArmesEtTalentsInfo("Sabre")]));//COM + AGI
	tableauPersos.push(createPerso("CombattantE",5,2,2,0,1,0,0,25,25,0,5,null,[getArmesEtTalentsInfo("Sabre")]));//COM
	tableauPersos.push(createPerso("GabierA",3,4,2,0,1,0,0,20,20,0,3,null,[getArmesEtTalentsInfo("Dague")]));
	tableauPersos.push(createPerso("GabierB",3,3,2,0,1,0,0,15,15,0,2,null,[getArmesEtTalentsInfo("Dague")]));
	tableauPersos.push(createPerso("CombattantF",3,1,3,0,1,0,0,15,15,0,2,null,[getArmesEtTalentsInfo("Dague")])); //vigoureux
	
	//Identifiant unique à chaque perso
	for(let i=0;i<tableauPersos.length;i++){
		tableauPersos[i].idPerso = i;
	}
	return tableauPersos;
}

// special est à null s'il n'y en a pas, les stats sont à 0 dans le même cas
function createPerso(nom, com, agi, vig, esp, sen, def, defSpe, pv, pvMax, mana, lvl, special, armes){	
	return {nom:nom,
		stats : {com : com, agi :agi, vig :vig, esp: esp, sen :sen, def :def, defSpe:defSpe, pvMax :pvMax, manaMax : mana, lvl:lvl },
		statsTemp : {com : com, agi :agi, vig :vig, esp: esp, sen :sen, def :def, defSpe:defSpe, pv : pv, mana : mana},		
		special : special,
		armes : armes};
}

function getRandomPersos(nbRandomPersos, nomsPersosAcceptes){
	let persosChoisis = [];
	let tabPersosAChoisir = [];
	let i;
	for(i=0;i<tabPersos.length;i++){
		for(let j=0;j<nomsPersosAcceptes.length;j++){
			if(tabPersos[i].nom.startsWith(nomsPersosAcceptes[j])){
				tabPersosAChoisir.push(JSON.parse(JSON.stringify(tabPersos[i])));
			}			
		}
	}
	
	let idDejaChoisis = "";
	while(persosChoisis.length < nbRandomPersos){
		for(i=0;i<tabPersosAChoisir.length;i++){
			if(persosChoisis.length >= nbRandomPersos) break;
			let resChoixId = getRndInteger(0,tabPersosAChoisir.length-1);
			if(idDejaChoisis.indexOf("/" + resChoixId + "/") == -1) {
				idDejaChoisis += "/" + resChoixId + "/";
				tabPersosAChoisir[resChoixId].nom = getNomPourPersosRandom();
				persosChoisis.push(tabPersosAChoisir[resChoixId]);
			}
		}	
	}	
	return persosChoisis;
}

function getNomPourPersosRandom(){
	let idCHoisi = getRndInteger(0,tabNoms.length-1);
	return tabNoms[idCHoisi];
}

function getStrNomsPersos(tabPersosAConcat, withIdForMJ){
	let noms = "";
	for(let i=0;i<tabPersosAConcat.length;i++){
		noms += tabPersosAConcat[i].nom;
		if(withIdForMJ) noms += "(" + tabPersosAConcat[i].idPerso + ")";
		noms += (i != tabPersosAConcat.length-1) ? ", " : ".";
	}
	return noms;
}

function getPersosFromArgs(argsPerso, tabPersosAVerifierEnPlus){
	let nomsPersosCombat = argsPerso.split(",");
	let nbPersos = nomsPersosCombat.length;
	let persosCombat = [];
	let i,j;
	
	if(typeof tabPersosAVerifierEnPlus !== "undefined" && tabPersosAVerifierEnPlus.length>0){
		console.log("Persos récupérés dans tablePersos particulière");
		persosCombat = getPersosFromNoms(nomsPersosCombat, tabPersosAVerifierEnPlus, false);
		if(persosCombat.length == nbPersos){
			return persosCombat;
		}
	}
	
	// on récupère les infos des combattants
	console.log("PersonnagesCombat = " + nomsPersosCombat);
	persosCombat = persosCombat.concat(getPersosFromNoms(nomsPersosCombat, tabPersos, true));

	return persosCombat;
}

function getPersosFromNoms(tabNoms, tabRecherches, avecNomsIncomplets){
	let persosRecuperes = [];
	let nbPersos = tabNoms.length;
	
	for(let i=0;i<tabNoms.length;i++){
		for(let j=0;j<tabRecherches.length;j++){
			if(tabNoms[i] == tabRecherches[j].nom){
				let perso = JSON.parse(JSON.stringify(tabRecherches[j]));
				persosRecuperes.push(perso);
			}
			else if(avecNomsIncomplets && tabNoms[i].startsWith(tabRecherches[j].nom)){
				//on clone pour ne pas garder la référence du tableau et donc le modifier!
				let perso = JSON.parse(JSON.stringify(tabRecherches[j]));
				perso.nom = tabNoms[i];
				persosRecuperes.push(perso);
				break;
			}
			if(persosRecuperes.length == nbPersos){
				return persosRecuperes;
			}	
		}
	}
	return persosRecuperes;
}

function fillTabSpecial(){
	//		dés = chiffres "1,2,3"
	//		zoneEffet = self, ally, enemy, we, them 
	//		typeEffet = degats, degatsParTour, soin, buff, debuff, invoc, testOpposition, augmenteReussites, augmenteDes
	//		resultatEffetOpposition = noMvt, noSen, buffCOM (COM +1D)

	tabSpecial.push({ nom : "Torgnole", typeTest : "com", des : "4,6", zoneEffet  : "enemy", 
		typeEffet:"testOpposition", typeTestOpposition : "VIG,AGI", valeurEffet :2, resultatEffetOpposition : "noMvt"});
	tabSpecial.push({ nom : "Dissimulation", typeTest : "com", des : "3,4", zoneEffet  : "self", 
		typeEffet:"testOpposition", typeTestOpposition : "SEN", valeurEffet :1, resultatEffetOpposition : "buffCOM"});
}

function getSpecialInfo(nomSpecial){
	for(let i=0;i<tabSpecial.length;i++){
		if(tabSpecial[i].nom == nomSpecial){
			return tabSpecial[i];
		}
	}
	 return null;
}

function fillTabArmesTalents(){
	//dégats correspond au type de dé (8 pour d8)
	//ARMES CAC	
	tabArmesTalents.push({nom : "Bras mécanique", typeTest: "com", degats: 8});
	tabArmesTalents.push({nom : "Sabre", typeTest: "com", degats: 6});
	tabArmesTalents.push({nom : "Dague", typeTest: "com", degats: 4});
	tabArmesTalents.push({nom : "Frappe forte", typeTest: "com", degats: 8});
	tabArmesTalents.push({nom : "Frappe moyenne", typeTest: "com", degats: 6});
	tabArmesTalents.push({nom : "Frappe", typeTest: "com", degats: 4});
	//ARMES DIST
	tabArmesTalents.push({nom : "Arc", typeTest: "sen", degats: 4});
	tabArmesTalents.push({nom : "Pistolet", typeTest: "sen", degats: 6});
	//MAGIE
}

function getArmesEtTalentsInfo(nomArme){
	for(let i=0;i<tabArmesTalents.length;i++){
		if(tabArmesTalents[i].nom == nomArme){
			return tabArmesTalents[i];
		}
	}
	return null;
}

export { tabPersos, getRandomPersos, getStrNomsPersos, getPersosFromArgs };