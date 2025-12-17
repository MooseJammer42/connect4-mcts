import prompt from 'prompt-sync';
import asci_art from './asci_art/art.json' with { type: 'json' };
import assert from 'assert';
import test_tables from './test_tables/tables.json' with {type:'json'};
import {play_itself, man_vs_machine} from './game_types.js';
const args = process.argv.slice(2);
const p = prompt();

// Set defaults first
const params = {
  width: 0,
  height: 0,
  simuli: 0,
  verbose: 0,
  playitself: 0,
  games: 20,
  testtable: ""
};

// Override with command line arguments
args.forEach(arg => {
  const [key, value] = arg.split('=');
  if (key in params) {  // Only override if key exists
    params[key] = isNaN(value) ? (value === 'true' ? true : value) : parseInt(value);
  }
});

function myMain(){
    console.log(asci_art.connect_4_title);
    let games_played = 0;
    let test_table;
    if(args.testtable !== ""){
        if(args.testtable in test_tables){
            test_table = test_tables[args.testtable];
        }
    }
    let height = params.height;
    let width = params.width;
    while(height===0 && width===0 || test_table !== undefined){
        try{
            console.log("1 for yes; 2 for no");
            const ans = p("Would you like to play on a 7x6 board? ");
            if(ans === "1"){
                height = 6;
                width = 7;
                break;
            }else{
                width = parseInt(p("enter width: "));
                height = parseInt(p("enter height: "));
                assert(Number.isInteger(width));
                assert(Number.isInteger(height));
                if(width < 1) width = 1;
                if(width > 20) width = 20;
                if(height < 1) height = 1;
                if(height > 20) height = 20;
            }
        }catch{
            console.log("Enter valid numbers");
        }
    }
    while(1){
        games_played += 1;
        if(games_played > params.games){
            console.log("Reached total games played");
            break;
        }
        let table;
        if(test_table !== undefined){
            table = structuredClone(test_table);
        }else{
            table = new Array(height).fill(NaN).map(()=>new Array(width).fill(' '));
            console.log(table);
        }
        let simuli = params.simuli;
        while(simuli === 0){
            console.log('Easy: 100-300 ; Medium 300-800 ; Hard 800+\n')
            try{
                const ans = parseInt(p('Choose difficulty 100-50000: '));
                assert(Number.isInteger(ans));
                if(ans < 10) simuli = 10;
                else if(ans > 100000) simuli = 100000;
                else simuli = ans;
            }catch{
                console.log("Enter an integer")
            }
        }
        console.log(simuli,height,width);
        if(params.playitself > 0){
            play_itself(table,simulations = simuli,save_time=params.timefile,verbose=params.verbose);
        }else{
            man_vs_machine(table,{simulations: simuli,verbose:params.verbose});
        }
        break
    }


}

if (process.argv[1] === import.meta.filename) {
    // console.log("test!");
    myMain();
}
