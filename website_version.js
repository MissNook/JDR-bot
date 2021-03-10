import * as TournoiModule from './modules/tournoi.js';
import * as PersoModule from './modules/persos.js';

let embedMessage = {
    "fields": [],
    title : "",
    description : "",
    color:"",
    addField : function addField(name, value){ this.fields.push({name : name, value : value});},
    setTitle : function setTitle(newTitle){this.title = newTitle;},
    setColor : function setColor(newColor){this.color = newColor;}
};

function simulerTournoiCompetence(){
    let formulaireTournoi = document.forms["formTournoiComp"];
    let erreurSpan = formulaireTournoi["erreur"];
    let typeTournoiBtns = formulaireTournoi["competence"];
    let typeTournoi = "";
    for(let  i=0;i<typeTournoiBtns.length;i++){
        if(typeTournoiBtns[i].checked){
            typeTournoi = typeTournoiBtns[i].value;
            break;
        }
    }
    let persoChoisis = formulaireTournoi["persosChoisis"].value;
    persoChoisis = persoChoisis.trim().length ==0 ? "personne" : persoChoisis.value.trim();
    let nbConcurrents =  parseInt(formulaireTournoi["nbConcurrents"].value);
    if(nbConcurrents < 1 || nbConcurrents >6){
        erreurSpan.innerHTML = "Attention, le nombre de concurrents doit être compris entre 1 et 6."
        return;
    }
    let persosCombat = [];		
	if(persoChoisis != "personne") {
		persosCombat = PersoModule.getPersosFromArgs(persoChoisis, TournoiModule.persosTournoi);	
	}
    TournoiModule.simulerTournoi(embedMessage, typeTournoi, persosCombat, nbConcurrents);
}
//obligé de faire comme ça car le module n'est pas visible dans le HTML contrairement à un code JS standard
document.getElementById("btnValiderFormTournoiComp").onclick = simulerTournoiCompetence;