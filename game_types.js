import { Board } from './table.js';
import { monte_simulation } from './mcts.js';
import prompt from 'prompt-sync';
const p = prompt();
import assert from 'assert';
import asci_art from './asci_art/art.json' with { type: 'json' };


function play_itself(table,simulations=1000,save_time="",verbose = 0){
    const board = new Board(table);
    let [is_game_over,winner] = board.check_root_gameover();
    while(!is_game_over){
        try{
            const start = new Date();
            const move = monte_simulation(board,simulations,verbose=verbose);
            const end = new Date();
            board.table_update(move);
            [is_game_over,winner] = board.check_root_gameover();
        }catch (e){
            console.log(board.table);
            board.table_print();
            console.log(`turn: ${board.root_turn}`);
            console.error('Error:',e.message);
            process.exit(1);
            // or throw error;
        }
        if(verbose > 0){
            const ans = parseInt(p("press 4 to finish game, 5 to skip game: "));
            if(ans === 4){
                verbose = 0;
            }else if(ans === 5){
                is_game_over = true;
                winner = 0;
            }
        }

    }
    console.log(board.table);
    board.print_table();
    if(winner === 1){
        console.log('x wins!');
    }else if(winner === -1){
        console.log('o wins!');
    }else{
        console.log('tie!');
    }
}

function man_vs_machine(table,{simulations = 100000,player_turn= true,verbose= 0}={}){
    const board = new Board(table)
    let old_board = '';
    let [is_game_over,winner] = board.check_root_gameover();
    board.table_print();
    let lets_play = true;
    let move;
    while(!is_game_over && lets_play){
        if(player_turn){
            while(1){
                try{
                    move = parseInt(p(`input 1-${board.width}: `)) - 1
                    assert(Number.isInteger(move));
                    if(move < board.width && move >= 0){
                        if(board.root_possible_moves[move] != -1){
                            break;
                        }
                    }
                }catch{
                    console.log("\nEnter a valid number!");
                    move = parseInt(p(`2 to exit or try again: `))
                    if(move===2) process.exit(0);
                }
            }
        }else{
            const start = new Date();
            move = monte_simulation(board,simulations,{verbose:verbose,print_eval:true});
            const end = new Date();
            console.log(`time: ${(end-start)/1000}`)
        }
        if(!lets_play) break;
        if(player_turn) old_board = structuredClone(board);
        board.table_update(move);
        console.log(board.table);
        board.table_print();
        [is_game_over,winner] = board.check_root_gameover();
        player_turn = !player_turn;
    }
    if(winner === 1){
        console.log(asci_art.x_wins_title);
    }else if(winner === -1){
        console.log(asci_art.o_wins_title);
    }else{
        console.log(asci_art.tie_title);
    }
}

export {play_itself,man_vs_machine};