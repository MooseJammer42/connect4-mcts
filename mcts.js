import { Node } from './nodes.js';

// Browser-compatible assert function
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "");
    }
}

async function monte_simulation(board,simulations,{verbose=0,print_eval=false,batches=10000}={}){
    board.rollout_set_up();
    const map = new Map();
    const rootNode = new Node(board,map);
    if(rootNode.terminal_bool){
        if(verbose > 0) console.log("winning move",rootNode.terminal_move);
        return rootNode.terminal_move;
    }
    if(rootNode.anti_terminal) return rootNode.anti_terminal_move;
    let node;
    let nodeBranch = [];
    while(rootNode.visits < simulations){
        if(rootNode.visits % batches === 0){
            // yield event loop for animations
            await new Promise(resolve=>setTimeout(resolve,0));
        }
        node = rootNode;
        nodeBranch.length = 0;
        board.rollout_set_up()
        while(1){
            while((node.legal_children_moves === node.children.length && !node.terminal_bool) || node.anti_terminal){
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
            const randomMove = board.untried_moves(node.children_moves);
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

function add_child(node,Board,move,Map){
    // todo take this out later
    assert(move !== undefined);
    let inHash = false;
    let new_node;
    Board.rollout_move(move);
    const hashValue = `${Board.rollout_hash[0]},${Board.rollout_hash[1]}`
    if(Map.has(hashValue)){
        inHash = true;
        new_node = Map.get(hashValue);
    }else{
        new_node = new Node(Board,Map);
    }
    // children and children_moves are seperate since there can be more than one parent
    // then we need to know how one parent got to the child
    node.children.push(new_node);
    node.children_moves.push(move);
    return [new_node,inHash];
}

// assert that node possible moves == rollout possible moves
function arr_compare(arr1,arr2){
    assert(arr1.length === arr2.length)
    for(let i = 0; i < arr1.length; i++){
        assert(arr1[i] === arr2[i]);
    }
}

export {monte_simulation};