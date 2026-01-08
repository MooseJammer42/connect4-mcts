
class Node{
    constructor(Board,Map){
        // since I do a rollout setup before rootNode creation this should work for every node
        // this.possible_moves = structuredClone(Board.rollout_possible_moves);
        this.hash_value = `${Board.rollout_hash[0]},${Board.rollout_hash[1]}`;
        // terminal,result,move,anti_terminal,anti_terminal_move
        let [terminal_bool,terminal_result,terminal_move,anti_terminal,anti_terminal_move] = Board.check_node_terminal();
        this.terminal_bool = terminal_bool;
        this.terminal_result = terminal_result;
        this.terminal_move = terminal_move;
        this.anti_terminal = anti_terminal;
        this.anti_terminal_move = anti_terminal_move;
        this.next_turn = Board.rollout_turn;
        this.last_turn = Board.rollout_turn*-1;
        this.wins = 0;
        //adding this so it can go for tie worst comes to worst
        this.losses = 0;
        this.ties = 0;
        this.visits = 0;
        this.legal_children_moves = Board.legal_moves_public();
        this.children_hashes = [];
        this.children = [];
        this.children_moves = [];
        if(Map.has(this.hash_value)){
            throw new Error("Hash is already in Node Map");
        }else{
            Map.set(this.hash_value,this);
        }
    }
    back_propugate(rollout_value,node_branch){
        /* node branch is trail of nodes taken, have to be specific because multiple parents */
        for(let node of node_branch){
            if(node.last_turn === rollout_value) node.wins += 1;
            else if(rollout_value === 0) node.wins += .1;
            node.visits += 1;
        }
    }
    ucb_select(exploration = .7, if_print = false){
        const ucb_ratios = [];
        for(const child of this.children){
            // if child can win then our win ratio is 0 else ucb formula
            const ratio = (child.terminal_bool) ? 0 : (child.wins/child.visits) + (exploration * (Math.sqrt(Math.log(this.visits) / child.visits)))
            ucb_ratios.push(ratio);
        }
        let maxIndex = 0;
        let maxValue = ucb_ratios[0];

        for (let i = 1; i < ucb_ratios.length; i++) {
        if (ucb_ratios[i] > maxValue) {
            maxValue = ucb_ratios[i];
            maxIndex = i;
        }
        }
        return maxIndex;
    }
    child_most_visited(){
        let maxIndex = 0;
        let maxVisits = this.children[0].visits;

        for (let i = 1; i < this.children.length; i++) {
        if (this.children[i].visits > maxVisits) {
            maxVisits = this.children[i].visits;
            maxIndex = i;
        }
        }
        return this.children[maxIndex];
    }
    turn_most_visited(){
        let maxIndex = 0;
        let maxVisits = this.children[0].visits;

        for (let i = 1; i < this.children.length; i++) {
        if (this.children[i].visits > maxVisits) {
            maxVisits = this.children[i].visits;
            maxIndex = i;
        }
        }
        return this.children_moves[maxIndex];
    }
    examine_node(){
        console.log(`this:: win_ratio:${this.visits-this.wins}/${this.visits} | legal_children:${this.legal_children_moves} | total children: ${this.children.length} | possible_moves:${this.possible_moves} | hash:${this.hash_value}'`);
        for(cconst[i,child] of this.children.entries()){
            console.log("***");
            console.log(`child:: move:${this.children_moves[i]+1} | win_ratio:${child.wins}/${child.visits} | legal_children:${child.legal_children_moves} | possible_moves:${child.possible_moves} | hash:${child.hash_value}`);

        }
        console.log("---------------------------------------------------");
    }
}

export {Node};