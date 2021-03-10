import * as PersoModule from './modules/persos.js';
import * as CombatModule from './modules/combat.js';
import * as TournoiModule from './modules/tournoi.js';
import * as MusiqueModule from './modules/musique.js';

import * as Discord from 'discord.js';

const Client = new Discord.Client();
const prefix = "?";

var list = [];
var embedHelp = new Discord.MessageEmbed()
    .setColor("#800000")
    .setTitle("**Mode d'emploie JDR-bot**")
    .setDescription("Ce bot permet de faire des actions automatiques pour du JDR, comme des tests d'opposition et des combats entre PNJ.")
    .addField("__**?simulationCombat**__", "commande")
    .addField("__**?simulationTournoi**__", "commande ")
    .addField("__**?play**__", "commande pour jouer de la musique", false);

/* POUR SIMULATION COMBAT ET TOURNOI*/
var embedMessage = new Discord.MessageEmbed();
var embedMessagesForCombat = [];

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
		embedMessage.spliceFields(0, embedMessage.fields.length);					
		embedMessage.setTitle("__**Combat**__");
		embedMessage.setColor("#f6ab49")
		
		if(args.length > 2){
			let argPersos = args[1].replace(/,/g, " et ");			
			embedMessage.setDescription("Combat entre " + argPersos.toString());
			
			let persosCombat = PersoModule.getPersosFromArgs(args[1]);			
			
			if(persosCombat.length < 2){
				message.reply("Pas assez de personnages sélectionnés pour le combat");
				return;
			}
			let afficherDegats = (args.length > 3 && args[3] == "degats");
			CombatModule.simulerCombatArene(embedMessage, args[2], afficherDegats, persosCombat);			
			for(let i=0;i< CombatModule.messagesForEmbed.length;i++){
				/*console.log("MESSAGE" + embedMessagesForCombat[i].description + "/fields :" + embedMessagesForCombat[i].fields.length);
				for(let j=0;j<embedMessagesForCombat[i].fields.length;j++){
					console.log("EMBED nb:" + i + "/field:" + j + "/name:" + embedMessagesForCombat[i].fields[j].name + "/value :" +embedMessagesForCombat[i].fields[j].value);
				}*/
				message.channel.send(CombatModule.messagesForEmbed[i]);
			}
		}
		else{
			message.channel.send("Cette commande a besoin des paramètres suivants :  nomPerso1,nomPerso2,... typeCombat(com,sen,vig,agi,...,cac,libre) afficheDegats(degats,pasDegats) musicOnOff(musicOn,musicOff)");
		}
    }
    //?simulationTournoi nomPerso1,nomPerso2,... typeTournoi(com,sen,vig,agi,mat) nbConcurrents init(init ou n'importe) afficheDegats(degats,pasDegats)
	// nomPerso à "personne" si on a aucun personnage non générés dans le tournoi
	else if(message.content.startsWith(prefix + "simulationTournoi")){
		let args = message.content.split(" ");
		//on enlève les résultats du précédent appel
		embedMessage.spliceFields(0, embedMessage.fields.length);
		
		if(args.length > 2){	
			let persosCombat = [];		
			if(args[1] != "personne") {
				persosCombat = PersoModule.getPersosFromArgs(args[1], TournoiModule.persosTournoi);	
			}
			let typeTournoi = args[2];			
			
			let forInit = (args.length > 4 && args[4] == "init");
			let afficherDegats = (args.length > 5 && args[5] == "degats");
			embedMessage = TournoiModule.simulerTournoi(embedMessage, typeTournoi, persosCombat, args[3], forInit, afficherDegats);	
			message.channel.send(embedMessage);	
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
						MusiqueModule.playMusic(connection);

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

Client.login("ODA0MTM4NzQxMjgyNzY2ODU5.YBH-kA.Hccbu68X7QpUSoFYQATNbkO5A3s");