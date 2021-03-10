import * as TournoiModule from './modules/tournoi.js';
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
    persoChoisis = persoChoisis.value.trim().length ==0 ? "personne" : persoChoisis.value.trim();
    let nbConcurrents =  formulaireTournoi["nbConcurrents"].value;
    if(nbConcurrents < 1 || nbConcurrents >6){
        erreurSpan.innerHTML = "Attention, le nombre de concurrents doit être compris entre 1 et 6."
        return;
    }
    TournoiModule.simulerTournoi(embedMessage, typeTournoi, persosChoisis,nbConcurrents);
}