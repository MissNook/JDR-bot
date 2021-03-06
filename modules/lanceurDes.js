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
			for(let k=0;k<desSpecial.length;k++){
				if(parseInt(k,10) == resDe){
					specialActifs.push(currSpecial);
				}
			}
		}
	}	
}


export { jetDesStat, jetDesDegats, getRndInteger };