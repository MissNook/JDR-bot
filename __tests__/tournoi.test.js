// LANCER TESTS avec "npm run test"
import * as ModuleTournoi from '../modules/tournoi.js';

describe('avec vérification du message retourné', () => {
  var embedMessage;

  beforeEach(() => {
    embedMessage = {
      "fields": [],
      title : "",
      description : "",
      color:"",
      addField : function addField(name, value){ this.fields.push({name : name, value : value});},
      setTitle : function setTitle(newTitle){this.title = newTitle;},
      setColor : function setColor(newColor){this.color = newColor;}
    };
  }); 

  test('simulerTournoi mat init', () => {
    let resSimu = ModuleTournoi.simulerTournoi(embedMessage, "mat_init", false, [], 3);
    expect(ModuleTournoi.persosTournoi.length).toEqual(3);
    expect(resSimu.fields.length).toBeGreaterThan(0);
  });
});

describe('sans vérification du message retourné', () => {

  
});
/*
test('renvoie un entier aléatoire', () => {
  expect(lanceurDes.getRndInteger(1,2)).toBeLessThanOrEqual(2);
});*/