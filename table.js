// import { table } from "console";
import assert from 'assert';
import {randint} from './utils.js';

class Board{
    constructor(table){
        this.table = table;
        this.height = this.table.length;
        this.width = this.table.at(0).length;
        this.lol = this.lol_createion();
        this.root_sec_list = new Array(this.width*this.height*4).fill(0);
        this.rollout_sec_list = new Array(this.width*this.height*4).fill(0);
        this.rollout_possible_moves = new Array(this.width).fill(0);
        this.rollout_find_move = new Array(this.width).fill(0);
        this.random_move_bucket = new Array(this.width).fill(0);
        this.root_turn = 0;
        this.rollout_turn = 0;
        this.root_total_moves = 0;
        this.rollout_total_moves = 0;
        this.rollout_turn = 0;
        this.root_hash = [0,0];
        this.rollout_hash = [0,0];
        this.root_setup();
        // for print table highlighting
        this.last_move = [undefined,undefined];

    }
    /*
    I forget the acronymn but I am keeping it
    These are all possible connect 4s on this board
    reads top down left to right
    down is first, right is second, down right is third, up right is fourth
    if you follow this order you only have to check these directions for each one
    */
    lol_createion() {
        const lol = new Array(this.height*this.width).fill(new Array());
        const down_constant = this.height * this.width * 0; 
        const right_constant = this.height * this.width * 1;
        const dr_constant = this.height * this.width * 2;
        const ur_constant = this.height * this.width * 3;
        let sec_list_position;
        let four_slots = [];
        for(let i = 0; i < this.height ; i++){
            for(let j = 0 ; j < this.width; j++){
                // down
                sec_list_position = (i + (j*this.height) + down_constant);
                four_slots.length = 0;
                for(let k = 0; k < 4; k++){
                    if(i+k < this.height) four_slots.push((i+k+(this.height*j)));
                }
                if(four_slots.length == 4){
                    for(let n of four_slots){
                        lol[n].push(sec_list_position);
                    }
                }
                // right
                sec_list_position = (i + (j*this.height) + right_constant);
                four_slots.length = 0;
                for(let k = 0; k < 4; k++){
                    if(j+k < this.width) four_slots.push((i+(this.height*(j+k))));
                }
                if(four_slots.length == 4){
                    for(let n of four_slots){
                        lol[n].push(sec_list_position);
                    }
                }
                // down right
                sec_list_position = (i + (j*this.height) + dr_constant);
                four_slots.length = 0;
                for(let k = 0; k < 4; k++){
                    if(j+k < this.width && i+k < this.height) four_slots.push((i+k+(this.height*(j+k))));
                }
                if(four_slots.length == 4){
                    for(let n of four_slots){
                        lol[n].push(sec_list_position);
                    }
                }
                // up right
                sec_list_position = (i + (j*this.height) + ur_constant);
                four_slots.length = 0;
                for(let k = 0; k < 4; k++){
                    if(j+k < this.width && i-k >= 0) four_slots.push((i-k+(this.height*(j+k))));
                }
                if(four_slots.length == 4){
                    for(let n of four_slots){
                        lol[n].push(sec_list_position);
                    }
                }
            }

        }
        return lol;
    }
    random_rollout(){
        let legal_moves = 0;
        for(let i = 0; i < this.width; i++){
            if(this.rollout_possible_moves[i] !== -1){
                this.random_move_bucket[legal_moves] = i;
                legal_moves += 1;
            }
        }
        legal_moves -= 1;
        while(this.rollout_total_moves < this.height*this.width){
            assert(legal_moves != -1);
            const random_i = randint(0,legal_moves);
            const random_move = this.random_move_bucket[random_i];
            if (this.sec_int_3_rollout(random_move)) return this.rollout_turn;
            this.rollout_possible_moves[random_move] -= 1;
            if(this.rollout_possible_moves[random_move] === -1){
                // like swap but only value in the front matters
                this.random_move_bucket[random_i] = this.random_move_bucket[legal_moves];
                legal_moves -= 1;
            }
            this.rollout_turn *= -1;
            this.rollout_total_moves += 1;
        }
        return 0;
    }
    rollout_set_up(){
        for(let i = 0; i < this.root_sec_list ; i++){
            this.rollout_sec_list[i] = this.root_sec_list[i];
        }
        for(let i = 0; i < this.width; i++){
            this.rollout_find_move[i] = 0;
            this.rollout_possible_moves[i] = this.root_possible_moves[i];
        }
        this.rollout_turn = this.root_turn;
        this.rollout_total_moves = this.root_total_moves
        this.rollout_hash[0] = this.root_hash[0]
        this.rollout_hash[1] = this.root_hash[1]
    }
    untired_moves(children_moves){
        for(let i = 0; i < this.width; i++){
            this.rollout_find_move[i] = 0;
        }
        for(let i = 0; i < this.width; i++){
            if(this.rollout_possible_moves[i] === -1) this.rollout_find_move[i] = -1;
        }
        for(let child_move of children_moves){
            this.rollout_find_move[child_move] = -1;
        }
        return this.random_legal_untried_move();
    }
    random_legal_untried_move(){
        const legal_moves = 0;
        for(let i = 0; i < this.width; i++){
            if(this.rollout_find_move[i] !== -1){
                this.random_move_bucket[legal_moves] = i;
                legal_moves += 1;
            }     
        }
        legal_moves -= 1;
        assert(legal_moves !== -1);
        // going to return legal moves, then can catch fully expanded right away
        const random_move = this.random_move_bucket[randint(0, legal_moves)];
        return random_move
    }

    root_setup(){
        // first whipe
        for(let n = 0; n < this.root_sec_list.length; n++){
            this.root_sec_list[n] = 0;
        }
        const totalx = 0;
        const totalo = 0;
        for(let n = 0; n < this.height; n++){
            for(let k = 0; k < this.width; k++){
                if (this.table[n][k] == 'x'){
                    totalx +=1;
                    for(let value of this.lol[n+(this.height*k)]){
                        this.root_sec_list[value] += 1
                    }
                    this.toggle_bit_setup(n+(this.height*k),1)
                }else if(this.table[n][k] == 'o'){
                    totalo +=1;
                    for(let value of this.lol[n+(this.height*k)]){
                        this.root_sec_list[value] -= 1
                    }
                    this.toggle_bit_setup(n + (this.height * k), -1)
                }
            }
        }
        this.root_turn = (totalx > totalo) ? -1 : 1;
        this.root_total_moves = totalo + totalx
        this.root_possible_moves = this.possible_simple()
    }
    sec_int_3(move,three){
        const lol_index = this.rollout_possible_moves[move] + move * this.height;
        for(let n of this.lol[lol_index]){
            if(this.rollout_sec_list[n] === three) return true;
        }
        return false;
    }
    sec_int_3_rollout(move){
        // check if 3 but if not also adds
        const three = (this.rollout_turn === 1) ? 3 : -3;
        const lol_index = this.rollout_possible_moves[move] + move * this.height;
        for(let n of this.lol[lol_index]){
            if(this.rollout_sec_list[n] === three) return true;
            else this.rollout_sec_list[n] += this.rollout_turn;
        }
        return false;
    }
    rollout_move(move){
        this.rollout_total_moves += 1;
        const lol_index = this.rollout_possible_moves[move] + move * this.height;
        for(let n of this.lol[lol_index]){
            this.rollout_sec_list[n] += this.rollout_turn;
        }
        this.toggle_bit_rollout((this.rollout_possible_moves[move] + move * this.height),this.rollout_turn);
        this.rollout_turn *= -1;
        this.rollout_possible_moves[move] -= 1;
    }
    check_node_terminal(){
        /*
        return terminal and anti_terminal; anti_terminal will be checked after terminal is determined false
        I will include antiterminal here and I will check it after game over boolean because of tie logic
        return:: terminal,result,move,anti_terminal,anti_terminal_move
        if terminal, then anti_terminal is automcatically false
        */
        const three = (this.rollout_turn === 1) ? 3 : -3;
        for(let i = 0; i < this.width; i++){
            if(this.rollout_possible_moves[i] !== -1 && this.sec_int_3(i,three)){
                return [true, this.rollout_turn, i, false, undefined];
            }
        }
        if(this.rollout_total_moves === (this.height * this.width)) return [true,0,undefined,false,undefined];
        for(let i = 0; i < this.width; i++){
            if(this.rollout_possible_moves[i] !== -1 && this.sec_int_3(i,three*-1)){
                return [false,undefined,undefined,true,i];
            }
        }
        return [false,undefined,undefined,false,undefined];

    }
    toggle_bit_setup(bit_position, turn){
        const mask = 1 << bit_position;
        const hash_i = (turn===1) ? 0 : 1;
        this.root_hash[hash_i] ^= mask;
    }
    toggle_bit_rollout(bit_position, turn){
        const mask = 1 << bit_position;
        const hash_i = (turn===1) ? 0 : 1;
        this.rollout_hash[hash_i] ^= mask;
    }
    possible_simple(){
        const possible_moves = [];
        for(let k = 0; k < this.width; k++){
            let n = this.height - 1;
            let found = false;
            while(n >= 0 && !found){
                if(this.table[n][k] === ' ') found = true;
                else n -= 1;
            }
            possible_moves.push(n);
        }
        return possible_moves;
    }
    check_root_gameover(){
        for(let n of this.root_sec_list){
            if(n === 4) return [true,1];
            if(n === -4) return [true,-1];
        }
        if(this.root_total_moves === this.height*this.width) return [true,0];
        return [false,-2];
    }
    table_update(move){
        const k = move;
        const n = this.root_possible_moves[move];
        const char = (this.root_turn === 1) ? 'x' : 'o';
        this.table[n][k] = char;
        this.last_move = [n,k];
        this.root_setup();
    }
    table_print(){
        const sl = [];
        let print_table_new = "\n\n\n\n\n\n\n\n\n\n   ";
        for(let k = 1; k < this.width + 1; k++) print_table_new += `${k}       `;
        print_table_new += "\n-";
        for(let k = 1; k < this.width + 1; k++) print_table_new += "--------";
        for(let n = 0; n < this.height; n++){
            print_table_new += "\n|";
            for(let k = 0; k < this.width; k++){
                if(this.table[n][k] === ' '){
                    print_table_new += '       |';
                }else{
                    let [normal,highlight,bright,three,four] = (this.table[n][k] === 'x') ? ["[31m","[41m","[91m",3,4] : ["[34m","[44m","[96m",-3,-4];
                    if(n === this.last_move.at(0) && k === this.last_move.at(1)){
                        print_table_new += `   \x1b${highlight}${self.table[n][k]}\x1b[0m   |`;
                    }else{
                        let broke = false;
                        for(let value of this.lol[n+(self.height*k)]){
                            if(this.root_sec_list[value] === four){
                                print_table_new += `   \x1b${highlight}${self.table[n][k]}\x1b[0m   |`;
                                broke = true;
                                break;
                            }
                        }
                        if(!broke){
                            for(let value of this.lol[n+(self.height*k)]){
                                if(this.root_sec_list[value] === three){
                                print_table_new += `   \x1b${bright}${self.table[n][k]}\x1b[0m   |`;
                                broke = true;
                                break;
                            }
                            if(!broke){
                                print_table_new +=`   \x1b${normal}${self.table[n][k]}\x1b[0m   |`;
                            }
                            }
                        }
                    }
                }
            }
        }
        print_table_new += '\n-';
        for(let k = 1; k < this.width + 1; k++) print_table_new += "--------";
        console.log(print_table_new);
    }
    legal_moves_public(){
        let legal_moves = 0;
        for(let n of this.rollout_possible_moves){
            if(n !== -1) legal_moves += 1;
        }
        return legal_moves;
    }
}

const table = new Array(6).fill(new Array(7).fill(' '))
const b = new Board(table);
b.table_print();

export{Board};