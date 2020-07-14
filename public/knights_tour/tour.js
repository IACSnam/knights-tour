const all_moves = [
    [1,2],[1,-2],[2,1],[2,-1],[-1,2],[-1,-2],[-2,1],[-2,-1]
]

function runTour(x,y,table,){
    var board = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];
    board[y][x] = 1;
    knight.movelist = [];
    knight.checkpoints = [];
    knight.movelist.push([y,x]);
    for(let i=0; i<64; i++){
        const result = checkTour(table,board,x,y);
        const move = result.move;
        knight.movelist.push(move);
        if(move == "No moves left"){
            break;
        }
        board[move[0]][move[1]] = 1;
        result.remove.forEach(
            function(element){
                table[element[0]][element[1]] += -1;
            }
        );
        y = move[0];
        x = move[1];
    }
    console.log("checkpoint 1");
    var checkpoint;
    /*
    function check(){
        if(knight.movelist[knight.movelist.length-1]=="No moves left"){
            knight.movelist.pop();
            const checkpoint = knight.checkpoints[knight.checkpoints.length-1];
            const chkidx = knight.checkpoints.length-1;
            y = knight.movelist[checkpoint.index][0];
            x = knight.movelist[checkpoint.index][1];
            knight.movelist.splice(checkpoint.index+1,knight.movelist.length-checkpoint.index-1);
            board = checkpoint.board;
            table = checkpoint.table;
            for(let i=checkpoint.index; i<64; i++){
                const result = checkTour(table,board,x,y);
                const move = result.move;
                knight.movelist.push(move);
                if(move == "No moves left"){
                    break;
                }
                board[move[0]][move[1]] = 1;
                result.remove.forEach(
                    function(element){
                        table[element[0]][element[1]] += -1;
                    }
                );
                y = move[0];
                x = move[1];
            }
            knight.checkpoints.splice(chkidx,1);
            check();
        }
    }
    check();
    */
    console.log("done");
}

function checkTour(table,board,x,y,depth=1){
    const possible_moves = [];
    all_moves.forEach(
        function(item){
            if(y+item[0]>-1){
                if(y+item[0]<8){
                    if(x+item[1]>-1){
                        if(x+item[1]<8){
                            if(board[y+item[0]][x+item[1]]==0){
                                possible_moves.push([y+item[0],x+item[1]]);
                            }
                        }
                    }
                }
            }
        }
    );
    if(knight.checkpoints.length > 1){
        if(knight.movelist.length == knight.checkpoints[knight.checkpoints.length-1].index-1){
            for(let i=0; i<possible_moves.length; i+=0){
                if(possible_moves[i]==knight.checkpoints[knight.checkpoints.length-1].move){
                    possible_moves.splice(i,1);
                }
                else{
                    i++;
                }
            }
        }
    }
    const r_moves = Array.from(possible_moves);
    if(depth>1){
        return possible_moves.length;
    }
    if(possible_moves.length == 1){
        return {
            move : possible_moves[0],
            remove : r_moves
        }
    }
    if(possible_moves.length == 0){
        return {
            move : "No moves left",
            remove : r_moves
        }
    }
    if(knight.movelist.length != 64){
        for(let i=0; i<possible_moves.length; i+=0){
            if(table[possible_moves[i][0]][possible_moves[i][1]] == 1){
                possible_moves.splice(i,1);
            }
            else{
                i++;
            }
        }
    }
    function check_moves(){
        base = possible_moves[0]
        for(let i=1; i<possible_moves.length; i+=0){
            if(table[base[0]][base[1]] < table[possible_moves[i][0]][possible_moves[i][1]]){
                possible_moves.splice(i,1);
            }
            else if(table[base[0]][base[1]] > table[possible_moves[i][0]][possible_moves[i][1]]){
                possible_moves.shift();
                check_moves();
            }
            else{
                i++;
            }
        }
    }
    check_moves();
    if(possible_moves.length == 1){
        return {
            move : possible_moves[0],
            remove : r_moves
        }
    }
    const deepValues = [];
    possible_moves.forEach(
        function(item){
            newBoard = Array.from(board);
            newBoard[item[0]][item[1]] = 1;
            newTable = Array.from(table);
            r_moves.forEach(
                function(element){
                    newTable[element[0]][element[1]] += -1;
                }
            );
            new_y = y+item[0];
            new_x = x+item[1];
            const value = checkTour(newTable,newBoard,new_x,new_y,2);
            deepValues.push(value);
        }
    );
    function check_deepValues(){
        for(let i=1; i<deepValues.length; i+=0){
            if(deepValues[0]>deepValues[i]){
                deepValues.splice(i,1);
                possible_moves.splice(i,1);
            }
            else if(deepValues[0]<deepValues[i]){
                deepValues.shift();
                possible_moves.shift();
                check_deepValues();
            }
            else{
                i++;
            }
        }
    }
    check_deepValues();
    if(possible_moves.length == 1){
        return {
            move : possible_moves[0],
            remove : r_moves
        }
    }
    else{
        var random_move = possible_moves[Math.floor(Math.random())*possible_moves.length];
        const chkpt_board = Array.from(board);
        const chkpt_table = Array.from(table);
        knight.checkpoints.push(
            {
                index : knight.movelist.length-1,
                move : random_move,
                board : chkpt_board,
                table : chkpt_table
            }
        );
        return {
            move : random_move,
            remove : r_moves
        }
    }
}