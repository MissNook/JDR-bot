const Discord = require("discord.js");
const { userInfo } = require("os");

const Client = new Discord.Client();

const ytdl = require("ytdl-core");

const prefix = "?";



var list = [];
var embedHelp = new Discord.MessageEmbed()
    .setColor("#800000")
    .setTitle("__**Mode d'emploie Ennuy-o-tron**__")
    .setDescription("__**commande :**__")
    .addField("commande __**? + johnny live**__", "commande pour johnny afin d'afficher son live, utiliser les apostrophes pour entrer le nom du live", false)
    .addField("commande __**? + nagir live**__", "commande pour nagir afin d'afficher son live, utiliser les apostrophes pour entrer le nom du live", false)
    .addField("commande __**? + johnny YTB**__", "commande pour afficher le liens de la chaine youtube de johnny", false)
    .addField("commande __**? + nagir YTB**__", "commande pour afficher le liens de la chaine youtube de nagir", false)
    .addField("commande __**? + play**__", "commande pour jouer de la musique", false)

/* POUR SIMULATION COMBAT ET TOURNOI*/
var embedCombat = new Discord.MessageEmbed();
var embedMessagesForCombat = [];

var tabSpecial = [];
fillTabSpecial();
var tabArmesTalents = [];
fillTabArmesTalents();
var tabPersos = createTabPersos();

var tabCibles = [];
var tabIdPersosKO = [];
const maxNiveauMat = 10; 
var persosTournoi = [];

var tabNoms = ["Fiz", "Paula", "Chop", "Kalom", "Mistra", "Fobar", "Gregor", "Abbie", "Belio", "Cibole", "Domez", "Evrid", "Foutor", "Galli", "Hecter", "Ivino", "Julor", "Kester",
	"Jouma", "Kalia", "Lomo","Mesti","Nouvin","Oplik","Passpa","Querin","Roveli","Stimiri","Topra","Ulla","Versteur","Wriss","Xera","Yourn","Zenn","Agnes","Alexandra","Anders","Andréas","Anja","Anna","Anne","Anton","Antonia","Asta","Astrid","Axel","Beata","Birgit","Birgitta","Björn","Carina","Cécilia","Christin","Dagmar","Dagny","Daniel","Edvard","Elin","Elisabeth","Emanuel","Emil","Erik","Erika","Ester","Eva","Filip","Frans","Georg","Gerda","Gudrun","Gunhild","Gustav","Hanna","Hans","Harald","Hedvig","Helena","Helga","Helge","Hella","Henrik","Henrike","Hilda","Hildegard","Hildegarde","Ida","Ingmar","Ingrid","Ingvar","Irene","Ivar","Jacob","Jakob","Jarl","Johan","Johanna","Johannes","Josef","Karl","Karla","Karolina","Kasper","Kirsten","Klara","Knut","Konrad","Kristian","Kristin","Lars","Lena","Lennart","Lotta","Lucia","Magda","Magdalena","Maja","Margareta","Margit","Maria","Martha","Martina","Mathias","Mikael","Mikaela","Monika","Nanna","Nathanaël","Nora","Nordorn","Olga","Oskar","Per","Peter","Pia","Ragnar","Rita","Robert","Rolf","Rosa","Rosemarie","Rudolf","Ruth","Sara","Sigrid","Simon","Sonja","Stéfan","Sylvia","Tekla","Teodor","Thomas","Ulla","Ulrik","Ulrika","Ursula","Valdemar","Valentin","Véronika","Viktor","Viktoria","Viola","Waldemar","Walter","Werner"];
   
Client.on("ready", () => {
    console.log("bot opérationnel");
});


Client.on("message", message => {    
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
	
	//?simulationCombat nomPerso1,nomPerso2,... typeCombat(com,sen,vig,agi,...,cac,libre) afficheDegats(degats,pasDegats) musicOnOff(musicOn,musicOff)
	//?simulationCombat Fredro,MouetteGéante sen
	if(message.content.startsWith(prefix + "simulationCombat")){
		let args = message.content.split(" ");
		//on enlève les résultats du précédent appel
		embedMessagesForCombat = [];
		tabIdPersosKO = [];
		embedCombat.spliceFields(0, embedCombat.fields.length);					
		embedCombat.setTitle("__**Combat**__");
		embedCombat.setColor("#f6ab49")
		
		if(args.length > 2){
			let argPersos = args[1].replace(/,/g, " et ");			
			embedCombat.setDescription("Combat entre " + argPersos.toString());
			
			let persosCombat = getPersosFromArgs(args[1]);			
			
			if(persosCombat.length < 2){
				message.reply("Pas assez de personnages sélectionnés pour le combat");
				return;
			}
			let afficherDegats = (args.length > 3 && args[3] == "degats");
			simulerCombatArene(args[2], afficherDegats, persosCombat);
			for(let i=0;i<embedMessagesForCombat.length;i++){
				/*console.log("MESSAGE" + embedMessagesForCombat[i].description + "/fields :" + embedMessagesForCombat[i].fields.length);
				for(let j=0;j<embedMessagesForCombat[i].fields.length;j++){
					console.log("EMBED nb:" + i + "/field:" + j + "/name:" + embedMessagesForCombat[i].fields[j].name + "/value :" +embedMessagesForCombat[i].fields[j].value);
				}*/
				message.channel.send(embedMessagesForCombat[i]);
			}			
				
		}
		else{
			message.channel.send("Cette commande a besoin des paramètres suivants :  nomPerso1,nomPerso2,... typeCombat(com,sen,vig,agi,...,cac,libre) afficheDegats(degats,pasDegats) musicOnOff(musicOn,musicOff)");
		}
    }
    //?simulationTournoi nomPerso1,nomPerso2,... typeTournoi(com,sen,vig,agi,mat) nbConcurrents afficheDegats(degats,pasDegats)
	// nomPerso à "personne" si on a aucun personnage non générés dans le tournoi
	else if(message.content.startsWith(prefix + "simulationTournoi")){
		let args = message.content.split(" ");
		//on enlève les résultats du précédent appel
		embedCombat.spliceFields(0, embedCombat.fields.length);
		
		if(args.length > 2){	
			let persosCombat = [];		
			if(args[1] != "personne") {
				let argPersos = args[1].replace(/,/g, " et ");
				persosCombat = getPersosFromArgs(args[1], persosTournoi);	
			}
			let typeTournoi = args[2];			
			embedCombat.setTitle("Tournoi " + getNomTournoi(typeTournoi));	
			embedCombat.setColor("#aef2ea");
			
			let afficherDegats = (args.length > 4 && args[4] == "degats");
			simulerTournoi(typeTournoi, afficherDegats, persosCombat, args[3]);	
			message.channel.send(embedCombat);	
		}
		else{
			message.channel.send("Cette commande a besoin des paramètres suivants :  nomPerso1,nomPerso2,... typeCombat(com,sen,vig,agi,...,cac,libre)");
		}
	}
  

	else if(message.content == prefix + "help"){
		message.reply("tu as demander mon aide ? voici quelque commande utile qui j'espere te servira ! bon maintenant je vais reprendre mes affaires");
		message.channel.send(embedHelp);
	}

	else if(message.content == prefix + "stop"){
		if(message.member.voice.channel){
			message.member.voice.channel.leave();
		}
	}
	else if(message.content.startsWith(prefix + "play")){
		if(message.member.voice.channel){
			let args = message.content.split(" ");
		   
			if(args [1] == undefined || !args [1].startsWith("https://")){
				message.reply("Lien de vidéo invalide");
			}
			else {
				if(list.length > 0){
					list.push(args[1]);
					message.reply("Son de la vidéo ajouté dans la liste");
				}
				else {
					list.push(args[1]);
					message.reply("Son de la vidéo ajouté dans la liste")

					message.member.voice.channel.join().then(connection => {
						playMusic(connection);

						connection.on("disconnect", () => {
							list = []; 
						});

					}).catch(err => {
						message.reply("Lien de vidéo invalide");
					});
				}
			}
		}
		else{
			message.reply("Vous devez être sur un channel vocal pour faire ceci");
		}
	}
});

function playMusic(connection){
    let dispatcher = connection.play(ytdl(list [0], { quality: "highestaudio"}), { volume: 0.5});

    dispatcher.on("finish", () => {
        list.shift();
        dispatcher.destroy();

        if(list.length > 0){
            playMusic(connection);
        }
        else{
            connection.disconnect();
        }
    });

   dispatcher.on("error", err => {
       console.log("erreur de dispatcher : " + err);
       dispatcher.destroy();
       connection.disconnect();
    });
}


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

//simule le combat et prépare le message d'embed en conséquences
function simulerCombatArene(typeCombat, afficherDegats, persosCombat){	
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

function testOpposition(persosCombat, typeCombat, nbPourMultiPersos){
		let nameFieldEmbed = "**Opposition de " + typeCombat.toUpperCase() + " : **";
		let valueFieldEmbedStr = "__#p1__ gagne contre __#p2__ avec un score de **#s1** contre **#s2**!!";
		let resultatDes1 = -1;
		let resultatDes2 = -1;
		let multiPersos = (typeof nbPourMultiPersos !== "undefined");
		let nbPersos = (multiPersos && nbPourMultiPersos>2)? nbPourMultiPersos : 2;		
		let resMulti = [];
		
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
				resultatDes1 = jetDesStat(combattant1, typeCombat).nbReussites;
				resMulti.push({perso : persosCombat[i], nbReussites : resultatDes1});
				continue;
			}
			if(resultatDes1 == -1) {
				combattant1 = persosCombat[i];
				resultatDes1 = jetDesStat(combattant1, typeCombat).nbReussites;
				continue;
			}

			resultatDes2 = jetDesStat(persosCombat[i], typeCombat).nbReussites;
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
			embedMessagesForCombat.push(embedCombat);
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
		
		let attaqueRes = jetDesStat(currCombattant, "com");
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
			let defenseRes = jetDesStat(currAdversaire, "def");	
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
				let degats = jetDesDegats(armeCombattant.degats, attaqueRes.nbReussites);
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
				embedMessagesForCombat.push(copyEmbedCombat(embedCombat));
				embedCombat.setDescription(embedCombat.description.replace(" et " + persosCombat[i].nom, ""));
				embedCombat.spliceFields(0, embedCombat.fields.length);	
				tabIdPersosKO.push(i);	
			}
		}
		console.log("NBPERSOKO="+ nbPersosKO +"/nbpersosCombat="+persosCombat.length);
		//il ne doit en rester qu'un!
		if(nbPersosKO >= persosCombat.length-1){
			embedMessagesForCombat[embedMessagesForCombat.length-1].addField("**Fin du Combat**", "Un seul combattant reste debout !");
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

function simulerTournoi(typeTournoi, afficherDegats, persosCombat, nbConcurrents){	
	//simuler tournoi d'un type
	
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
			return embedCombat.addField("ECHEC", "Aucun perso sélectionné, merci d'utiliser le mat_init.")
		}
		let resTest = testOpposition(persosTournoi, "vig", persosTournoi.length);
		setPlacementPersosParReussites(resTest);
		embedCombat.addField(persosTournoi.length + " participants : " + getStrNomsPersos(persosTournoi), getMatAvecPersosPlaces());
	}else if(typeTournoi == "mat_tombe"){	
		console.log("*************MAT TOMBE:" + getStrNomsPersos(persosCombat));
		setPlacementPersosTombes(persosCombat);
		embedCombat.addField(persosTournoi.length + " participants : " + getStrNomsPersos(persosTournoi), getMatAvecPersosPlaces());
	}
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

//retourne le nombre de réussite et l'effet spécial s'il existe
function jetDesStat(combattant,stat){
	let nbDes = combattant.stats[stat];
	let specialActifs = [];
	console.log("Combattant : " + combattant.nom + " **** Stat : "+ stat + "/nbDes = " + nbDes);
	if(nbDes ==0) return {nbReussites : 0, specialActifs : specialActifs};
	
	let nbReussites = 0;
	for(let i=0;i<nbDes;i++){
		let resDe = getRndInteger(1,6);
		//console.log("resDe = " + resDe);
		if(resDe > 3){
			nbReussites++;
			//relance sur 6
			if(resDe == 6){
				nbDes++; 
			}
		}
		if(combattant.special != null){
			specialActifs = getSpecialActifs(combattant, stat, resDe);	
			//RAF PLUS TARD - gérer le spécial
		}	
	}
	
	console.log("NbReussites = " + nbReussites);
	return {nbReussites : nbReussites, specialActifs : specialActifs};
}

function jetDesDegats(deDegat, nbReussites){
	let resDegats = 0;
	for(let i=0;i<nbReussites;i++){
		resDegats += getRndInteger(1,deDegat);
	}
	return resDegats;
}

//entre min et max inclus
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//vérifie si on active un spécial sur ce résultat et renvoie la liste des attaques spéciales activées
function getSpecialActifs(combattant, stat, resDe){
	let specialActifs = [];
	for(let j=0;j<combattant.special.length;j++){
		let currSpecial = combattant.special[j];				
		if(currSpecial.typeTest == stat){
			var desSpecial = currSpecial.des.split(",");
			for(let k=0;k<combattant.special.length;k++){
				if(parseInt(k,10) == resDe){
					specialActifs.push(currSpecial);
				}
			}
		}
	}	
}


Client.login("ODA0MTM4NzQxMjgyNzY2ODU5.YBH-kA.Hccbu68X7QpUSoFYQATNbkO5A3s");