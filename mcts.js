import Node from './nodes.js';
import assert from 'assert';

function monte_simulation(board,simulations,verbose=0,print_eval=false){
    board.rollout_set_up();
    const map = new Map();
    rootNode = Node(board,map);
    if(rootNode.terminal_bool){
        if(verbose > 0) console.log("winning move",rootNode.terminal_move);
        return rootNode.terminal_move;
    }
    if(rootNode.anti_terminal) return rootNode.anti_terminal_move;
    let node;
    let nodeBranch = [];
    while(rootNode.visits < simulations){
        node = root_node;
        nodeBranch.length = 0;
        board.rollout_set_up()
        while(1){
            while(node.legal_children_moves === node.children.length && !node.terminal_bool || node.anti_terminal){
                //TODO take this assert out when comfy
                for(const child_move of node.children_moves) assert(node.children_moves.filter(m=>m===child_move).length===1);
                nodeBranch.push(node);
                if(node.anti_terminal){
                    board.rollout_move(node.anti_terminal_move);
                    node = node.children[0];
                }else{
                    const ucbIndex = node.ucb_select();
                    board.rollout_move(node.children_moves[ucbIndex]);
                    node = node.children[ucbIndex];
                }
            }
            if(node.terminal_bool) break;
            randomMove = board.untried_moves(node.children_moves);
            nodeBranch.push(node);
            let inHash;
            [node,inHash] = add_child(node,board,randomMove,map);
            while(node.anti_terminal && !inHash){
                nodeBranch.push(node);
                [node,inHash] = add_child(node,board,node.anti_terminal_move,map);
            }
            // a new node so we will do it's first random rollout
            if(!inHash) break;
        }
        if(node.terminal_bool){
            nodeBranch.push(node);
            node.back_propugate(node.terminal_result,nodeBranch);
        }else{
            const rolloutValue = board.random_rollout();
            nodeBranch.push(node);
            node.back_propugate(rolloutValue,nodeBranch)
        }
    }
    node = rootNode.child_most_visited();
    const rolloutMove = rootNode.turn_most_visited();
    if(verbose > 0){

    }
    if(print_eval){
        console.log("eval: ",(node.wins/node.visits))
    }
    return rolloutMove;
}

function add_child(Node,Board,move,Map){
    // todo take this out later
    assert(move !== undefined);
    let inHash = false;
    let new_node;
    Board.rollout_move(move);
    const hashValue = `${Board.hash_value[0]},${Board.hash_value[1]}`
    if(Map.has(hashValue)){
        inHash = true;
        new_node = Map.get(hashValue);
    }else{
        new_node = Node(Board,Map);
    }
    Node.children.push(new_node);
    Node.children_moves.push(move);
    return [new_node,inHash];
}

export {monte_simulation};