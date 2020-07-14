const game = new GameCanvas("game");

const knight = new Sprite({
    src : "knight.png",
    x : 0,
    y : 0,
    frameWidth : 600,
    frameHeight : 600,
    targetWidth : 50,
    targetHeight : 50,
    update : function(){
        this.x = this.realx*50;
        this.y = this.realy*50;
    }
});
knight.realx = 0;
knight.realy = 0;
knight.movelist = [];

function main(){
    drawBoard();
    game.addDrawing(knight);
    document.getElementById("start").onclick = function(){
        document.getElementById("game").style.cursor = "default";
        document.getElementById("total").innerHTML = "--";
        click_count = 0;
        document.getElementsByClassName("boop").onclick = function(){};
        document.getElementById("move").innerHTML = "N/A";
        const table = makeHueristic();
        runTour(knight.realx,knight.realy,table);
        document.getElementById("move").innerHTML = "0";
        document.getElementById("previous").onclick = function(){previous()};
        document.getElementById("next").onclick = function(){next()};
        var moves = knight.movelist.length - 2;
        if(knight.movelist[knight.movelist.length-1] != "No moves left"){
            moves = 63;
        }
        document.getElementById("total").innerHTML = moves;
    }
    document.getElementById("start").style.cursor = "pointer";
    document.getElementById("previous").style.cursor = "pointer";
    document.getElementById("next").style.cursor = "pointer";
    var click_count = 0;
    game.addHandler('click',
        function({x,y}){
            if(click_count == 0){
                if(x>knight.x && x<knight.x+50){
                    if(y>knight.y && y<knight.y+50){
                        click_count ++;
                        document.getElementById("game").style.cursor = "pointer";
                    }
                }
            }
            else{
                knight.realx = Math.floor(x/50);
                knight.realy = Math.floor(y/50);
                click_count = 0;
                document.getElementById("game").style.cursor = "default";
            }
        }
    );
    game.addHandler('mousemove',
        function({x,y}){
            if(click_count == 0){
                if(x>knight.x && x<knight.x+50){
                    if(y>knight.y && y<knight.y+50){
                        document.getElementById("game").style.cursor = "pointer";
                    }
                    else{
                        document.getElementById("game").style.cursor = "default";
                    }
                }
                else{
                    document.getElementById("game").style.cursor = "default";
                }
            }
        }
    );
}

function previous(){
    document.getElementById("game").style.cursor = "default";
    click_count = 0;
    const move_num = parse_move(document.getElementById("move").innerHTML);
    if(move_num>0){
        var num = move_num-1;
        document.getElementById("move").innerHTML = num;
        knight.realy = knight.movelist[num][0];
        knight.realx = knight.movelist[num][1];
    }
}

function next(){
    document.getElementById("game").style.cursor = "default";
    click_count = 0;    
    const move_num = parse_move(document.getElementById("move").innerHTML);
    if(move_num+2<knight.movelist.length){
        var num = move_num+1;
        document.getElementById("move").innerHTML = num;
        knight.realy = knight.movelist[num][0];
        knight.realx = knight.movelist[num][1];
    }
}

function parse_move(string){
    const move_arr = string.split('');
    move_arr.forEach(
        function(value,index){
            move_arr[index] = parseInt(value);
        }
    );
    var move_num = 0;
    move_arr.forEach(
        function(value,index){
            move_num += value*Math.pow(10,move_arr.length-index-1);
        }
    );
    return move_num;
}

function drawBoard(){
    var b = true;
    for(let y = 0; y<8; y++){
        for(let x = 0; x<8; x++){
            const bs = b;
            game.addDrawing(
                function({ctx}){
                    if(bs==true){ctx.fillStyle="white";}
                    else{ctx.fillStyle="#009933"}
                    ctx.fillRect(x*50,y*50,50,50);
                }
            );
            if(b==false){
                b=true;
            }
            else{
                b=false;
            }
        }
        if(b==false){
            b=true;
        }
        else{
            b=false;
        }
    }
}

function run(){
    main();
    game.run();
}
run();