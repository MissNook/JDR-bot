import * as TournoiModule from './modules/tournoi.js';
import * as PersoModule from './modules/persos.js';

let embedMessage;
initEmbed();
let erreurSpan = document.getElementById("erreur");
const tabEmojis = [{id:"ladder", src:"https://discord.com/assets/c9ab5c7dade3ae221f8b865b880d3f02.svg"}, 
{id:"beers", src:"https://discord.com/assets/5e2ea03aa4963cda5e91d395c2587e6b.svg"}, 
{id:"archery", src:"https://discord.com/assets/a33ea7f530f4b720a3a4c050594842fa.svg"}, 
{id:"six_pointed_star", src:"https://discord.com/assets/ba9ded4c8399e915303b1f97974a1573.svg"}, 
{id:"leaves", src:"https://discord.com/assets/40115dda7d9f615f9561a451236d9623.svg"}, 
{id:"first_place", src:"https://discord.com/assets/e2f8f101328a4b4ae7875945716345b3.svg"}, 
{id:"second_place", src:"https://discord.com/assets/c65da98dd1cd29756d4d5901ed549661.svg"}, 
{id:"third_place", src:"https://discord.com/assets/9ecf90770f4de9be7b44cb601d49722c.svg"},
{id:"star", src:"https://discord.com/assets/141d49436743034a59dec6bd5618675d.svg"},
{id:"star2", src:"https://discord.com/assets/030fc6691abd2ab36c1d90407e02505e.svg"}
];
const svgImgHTML = '<img width="20px" height="20px" src="#src#"></img>';

function simulerTournoiCompetence(){
    clearResultat();
    let formulaireTournoi = document.forms["formTournoiComp"];  
    let typeTournoiBtns = formulaireTournoi["competence"];
    let typeTournoi = "";
    for(let  i=0;i<typeTournoiBtns.length;i++){
        if(typeTournoiBtns[i].checked){
            typeTournoi = typeTournoiBtns[i].value;
            break;
        }
    }
    let persoChoisis = formulaireTournoi["persosChoisis"].value;
    persoChoisis = persoChoisis.trim().length ==0 ? "personne" : persoChoisis.trim();
    let nbConcurrents =  parseInt(formulaireTournoi["nbConcurrents"].value);
    if(nbConcurrents < 1 || nbConcurrents > 6){
        erreurSpan.innerHTML = "Attention, le nombre de concurrents doit être compris entre 1 et 6."
        return;
    }
    let persosCombat = [];		
	if(persoChoisis != "personne") {
		persosCombat = PersoModule.getPersosFromArgs(persoChoisis, TournoiModule.persosTournoi);	
	}
    let returnedEmbed = TournoiModule.simulerTournoi(embedMessage, typeTournoi, persosCombat, nbConcurrents);
    afficherEmbedDansHTML([returnedEmbed]);
}

function afficherEmbedDansHTML(embedsToShow){
    let divResultat = document.getElementById("resultat");
    let titreRes = document.getElementById("TitreRes");
    let descRes = document.getElementById("DescriptionRes");
    let fieldsRes = document.getElementById("fieldsRes");
    for(let i=0;i<embedsToShow.length;i++){
        let currEmbed = embedsToShow[i];       
        titreRes.innerHTML = formatForHTML(currEmbed.title);
        descRes.innerHTML = currEmbed.description;
        divResultat.style.border = "3px solid " + currEmbed.color;
        for(let j=0;j<currEmbed.fields.length;j++){
            let currField = currEmbed.fields[j];
            var boldText = document.createElement("b");
            boldText.innerHTML = formatForHTML(currField.name) + "<br>";
            fieldsRes.appendChild(boldText);            
            var span2 = document.createElement("span");
            span2.innerHTML = formatForHTML(currField.value);
            fieldsRes.appendChild(span2);
        }
    }
    divResultat.style.display = "block";
}

function formatForHTML(textToCheck){
    let newTextWithEmojis = changeEmojiIntoSvg(textToCheck);
    return newTextWithEmojis.replace(/\n/g, "<br>");
}

function changeEmojiIntoSvg(textToCheck){
    var splitText = textToCheck.split(":");
    let innerHTML = "";
    if(splitText.length>1){
        for(let i=0;i<splitText.length;i++){
            let hasEmoji = false;
            for(let j=0;j<tabEmojis.length;j++){
                if(splitText[i] == tabEmojis[j].id){
                    innerHTML += svgImgHTML.replace("#src#", tabEmojis[j].src);
                    hasEmoji = true;
                    break;                 
                }
            }
            if(!hasEmoji) innerHTML += splitText[i];
        }
    }else{
        innerHTML += splitText[0];
    }
    return innerHTML;
}

function initEmbed(){
    embedMessage = {
        "fields": [],
        title : "",
        description : "",
        color:"",
        addField : function addField(name, value){ this.fields.push({name : name, value : value});},
        setTitle : function setTitle(newTitle){this.title = newTitle;},
        setColor : function setColor(newColor){this.color = newColor;}
    };
    clearResultat();
}

function clearResultat(){
    let titreRes = document.getElementById("TitreRes");
    let descRes = document.getElementById("DescriptionRes");
    let fieldsRes = document.getElementById("fieldsRes");
    titreRes.innerHTML = "";
    descRes.innerHTML = "";
    fieldsRes.innerHTML = "";
    divResultat.style.display = "none";
}

//obligé de faire comme ça car le module n'est pas visible dans le HTML contrairement à un code JS standard
document.getElementById("btnValiderFormTournoiComp").onclick = simulerTournoiCompetence;
document.getElementById("btnClearEmbedTournoiComp").onclick = initEmbed;
