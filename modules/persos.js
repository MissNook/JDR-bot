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
	
	//createPerso(nom, com, agi, vig, esp, sen, def, defSpe, pv, pvMax, mana, lvl, special, armes){	
	tableauPersos.push(createPerso("Fredro",4,2,5,1,2,1,1,26,26,7,5, [getSpecialInfo("Torgnole")], [getArmesEtTalentsInfo("Bras mécanique")],true));
	tableauPersos.push(createPerso("MouetteGéante",2,3,2,0,3,0,0,6,6,0,1,null,[getArmesEtTalentsInfo("Frappe")],true));
	tableauPersos.push(createPerso("BernardLHermite",3,1,3,0,1,3,1,6,6,0,1,null,[getArmesEtTalentsInfo("Frappe")],true));
	tableauPersos.push(createPerso("Espadon",2,2,2,0,1,2,0,12,12,0,1,[getSpecialInfo("Dissimulation")], [getArmesEtTalentsInfo("Frappe moyenne")], true));
	tableauPersos.push(createPerso("Combattant_D",3,2,2,0,1,0,0,15,15,0,1,null,[getArmesEtTalentsInfo("Sabre")])); //COM
	tableauPersos.push(createPerso("Combattant_C",3,3,2,0,1,0,0,15,15,0,2,null,[getArmesEtTalentsInfo("Sabre")]));//COM + AGI
	tableauPersos.push(createPerso("Combattant_B",4,2,2,0,1,0,0,15,15,0,2,null,[getArmesEtTalentsInfo("Sabre")]));//COM
	tableauPersos.push(createPerso("Combattant_A",4,3,2,0,1,0,0,20,20,0,3,null,[getArmesEtTalentsInfo("Sabre")]));//COM + AGI
	tableauPersos.push(createPerso("Combattant_E",5,2,2,0,1,0,0,25,25,0,5,null,[getArmesEtTalentsInfo("Sabre")]));//COM
	tableauPersos.push(createPerso("Combattant_F",3,1,3,0,1,0,0,15,15,0,2,null,[getArmesEtTalentsInfo("Dague")])); //vigoureux
	tableauPersos.push(createPerso("Gabier_A",3,4,2,0,1,0,0,20,20,0,3,null,[getArmesEtTalentsInfo("Dague")]));
	tableauPersos.push(createPerso("Gabier_B",3,3,2,0,1,0,0,15,15,0,2,null,[getArmesEtTalentsInfo("Dague")]));
	tableauPersos.push(createPerso("Gabier_C",2,4,2,0,1,0,0,15,15,0,2,null,[getArmesEtTalentsInfo("Dague")]));
	tableauPersos.push(createPerso("Gabier_D",3,4,2,1,1,0,0,15,15,0,3,null,[getArmesEtTalentsInfo("Dague")]));
	tableauPersos.push(createPerso("Gabier_E",3,4,2,0,1,1,0,15,15,0,3,null,[getArmesEtTalentsInfo("Dague")])); //AGI + DEF
	tableauPersos.push(createPerso("Gabier_F",3,5,2,0,1,0,0,15,15,0,4,null,[getArmesEtTalentsInfo("Dague")]));
	tableauPersos.push(createPerso("Gabier_G",3,5,2,0,1,1,0,15,15,0,5,null,[getArmesEtTalentsInfo("Dague")])); //AGI + DEF
	tableauPersos.push(createPerso("Archer_A",1,2,1,0,3,0,0,15,15,0,1,null,[getArmesEtTalentsInfo("Arc")])); //SEN
	tableauPersos.push(createPerso("Archer_B",1,2,1,0,3,1,0,15,15,0,2,null,[getArmesEtTalentsInfo("Arc")])); //SEN + DEF
	tableauPersos.push(createPerso("Archer_C",1,3,1,0,3,0,0,15,15,0,2,null,[getArmesEtTalentsInfo("Arc")])); //SEN + AGI
	tableauPersos.push(createPerso("Archer_D",1,2,1,0,5,0,0,20,20,0,5,null,[getArmesEtTalentsInfo("Arc")])); //SEN
	tableauPersos.push(createPerso("Archer_E",1,2,1,0,4,0,0,15,15,0,3,null,[getArmesEtTalentsInfo("Arc")])); //SEN
	tableauPersos.push(createPerso("Archer_F",1,2,1,2,4,0,0,20,20,0,4,null,[getArmesEtTalentsInfo("Arc")])); //SEN + ESP
	tableauPersos.push(createPerso("Archer_G",3,2,1,2,3,0,0,15,15,0,3,null,[getArmesEtTalentsInfo("Arc")])); //SEN + COM
	tableauPersos.push(createPerso("Mage_A",1,2,1,3,3,0,0,15,15,15,3,null,[getArmesEtTalentsInfo("Dague")])); //ESP + SEN
	tableauPersos.push(createPerso("Mage_B",1,2,1,3,1,0,2,15,15,15,2,null,[getArmesEtTalentsInfo("Dague")])); //ESP + DEFSPE
	tableauPersos.push(createPerso("Mage_C",1,3,1,4,1,0,0,15,15,20,3,null,[getArmesEtTalentsInfo("Dague")])); //ESP 
	tableauPersos.push(createPerso("Mage_D",3,2,1,3,1,0,0,20,20,20,4,null,[getArmesEtTalentsInfo("Dague")])); //ESP + COM
	tableauPersos.push(createPerso("Mage_E",1,2,1,5,1,0,0,15,15,20,5,null,[getArmesEtTalentsInfo("Dague")])); //ESP
	tableauPersos.push(createPerso("Mage_F",1,2,1,3,4,1,1,15,15,20,2,null,[getArmesEtTalentsInfo("Dague")])); //ESP + DEF + DEFSPE

	
	//Identifiant unique à chaque perso
	for(let i=0;i<tableauPersos.length;i++){
		tableauPersos[i].idPerso = i;
	}
	return tableauPersos;
}

function getTabPersosCategories(){
	let categoriesPersos = { uniques : [], types : []};
	tabPersos.sort();
	let previousPerso;
	let currPerso;
	for(let i=0;i<tabPersos.length;i++){
		currPerso = tabPersos[i];
		if(currPerso.unique){
			categoriesPersos.uniques.push({idPerso : currPerso.idPerso , nom :currPerso.nom});
		}
		else{			
			previousPerso = tabPersos[i-1];
			let prevNomSansSuffixe = previousPerso.nom.split("_")[0];
			let currNomSansSuffixe = currPerso.nom.split("_")[0];
			if(currNomSansSuffixe == prevNomSansSuffixe && categoriesPersos.types.indexOf(currNomSansSuffixe) == -1){
				categoriesPersos.types.push(currNomSansSuffixe);
			}
		}
	}
	return categoriesPersos;
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

// special est à null s'il n'y en a pas, les stats sont à 0 dans le même cas
function createPerso(nom, com, agi, vig, esp, sen, def, defSpe, pv, pvMax, mana, lvl, special, armes, isUnique){
	if(!isUnique) isUnique = false;	
	return {nom:nom,
		stats : {com : com, agi :agi, vig :vig, esp: esp, sen :sen, def :def, defSpe:defSpe, pvMax :pvMax, manaMax : mana, lvl:lvl },
		statsTemp : {com : com, agi :agi, vig :vig, esp: esp, sen :sen, def :def, defSpe:defSpe, pv : pv, mana : mana},		
		special : special,
		armes : armes,
		unique : isUnique};
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
	//ATTENTION BOUCLE INFINIE DES QU'ON DEPASSE LE NOMBRE DE PROFILS DISPO (donc 6) - A CHANGER
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

function getSpecialInfo(nomSpecial){
	for(let i=0;i<tabSpecial.length;i++){
		if(tabSpecial[i].nom == nomSpecial){
			return tabSpecial[i];
		}
	}
	 return null;
}

function getArmesEtTalentsInfo(nomArme){
	for(let i=0;i<tabArmesTalents.length;i++){
		if(tabArmesTalents[i].nom == nomArme){
			return tabArmesTalents[i];
		}
	}
	return null;
}

export { tabPersos, getRandomPersos, getStrNomsPersos, getPersosFromArgs, getTabPersosCategories };