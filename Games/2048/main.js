var board = [];
var up = 38;
var left = 37;
var down = 40;
var right = 39;
var active = true;
var temphighscore = 0;
var highscore;
function tile(x,y){
    this.value = 0;
    this.x=x;
    this.y=y;
    this.merged = false;
}
function addRandom(){
    var i,e;
    do{
        var i = Math.floor(Math.random() * 4);
        var e = Math.floor(Math.random() * 4);
    }while(board[i][e].value != 0);
    var choice = Math.floor(Math.random()*100);
    if(choice<=50){
        board[i][e].value = 2;
    }
    else if(choice<=65){
        board[i][e].value = 4;
    }
    else if(choice<=75){
        board[i][e].value = 8;
    }
    else if(choice<=80){
        board[i][e].value = 16;
    }
    else if(choice<=85){
        board[i][e].value = 32;
    }
    else if(choice<=90){
        board[i][e].value = 64;
    }
    else if(choice<=93){
        board[i][e].value = 128;
    }
    else if(choice<=96){
        board[i][e].value = 256;
    }
    else{
        board[i][e].value = 512;
    }
    var id = i+"_"+e;
    $("#tiles").append($("<p class='tile l"+board[i][e].value+"' id='"+id+"'><b>"+board[i][e].value+"</b></p>"));
    $("#"+id).css({
        "margin-left":.25 + e*4.5+"rem",
        "margin-top":.25+i*4.5+"rem",
    });
    
    
    
    
}
function createGrid(){
    board = [];
    for(var i=0; i<4; i++){
        var row = [];
        for(var e=0; e<4; e++){
            row.push(new tile(i,e));
            $("#grid").append($("<div>", {class:"square"}));
        }
        board.push(row);
    }
}
function canContinue(){
    var hasEmpty = false;
    for(var i=0; i<board.length; i++){
        for(var e=0; e<board[i].length;e++){
            //console.error("NO ERROR")
            if(board[i][e].value > temphighscore){
                temphighscore = board[i][e].value;
                highscore.html("Highscore: " + temphighscore);
            }
            if(board[i][e].value == 2048){
                console.log("WIN");
                return 1 //return 1 if win return 0 if lose, 2 can continue.
            }
            if(board[i][e].value == 0){
                hasEmpty = true;
            }
        }
    }
    if(hasEmpty){
        console.log("Continue");
        return 2;
    }
    for(var i=0; i<board.length; i++){
        for(var e=0; e<board[i].length;e++){
            if(i < board.length-1 && board[i][e].value == board[i+1][e].value){
                console.log("Continue");
                return 2;
            }
            if(e < board[i].length-1 && board[i][e].value == board[i][e+1].value){
                console.log("Continue");
                return 2;
            }
        }
    }
    console.log("Lose");
    return 0;
}
function endOfTurn(hasMoved){
    if(hasMoved){
        reDraw();
        addRandom();
    }
    if(canContinue() == 0){
        active = false;
    }
}
function reDraw(){
    $("#tiles").empty();
    for(var i=0; i < board.length; i++){ // NOT Down as it increments
        for(var e=0;e<board[i].length;e++){
            console.log(i,e);
            board[i][e].merged = false;
            if(board[i][e].value != 0){    
                var id = i+"_"+e;
                $("#tiles").append($("<p class='tile l"+board[i][e].value+"' id='"+id+"'><b>"+board[i][e].value+"</b></p>"));
                $("#"+id).css({
                    "margin-left":.25 + e*4.5+"rem",
                    "margin-top":.25+i*4.5+"rem",
                });
            }
        }
    }
}
function move(key){
    if(key===up){
        var moved = false;
        var total = 0;
        var numMoved = 0;
        for(var i=1; i < board.length; i++){ // Down as it increments
            for(var e=0;e<board[i].length;e++){ // Right as it increments
                console.log(i,e);
                if(board[i][e].value != 0){
                    total ++;
                    var j = i;
                    while(j > 0 && board[j-1][e].value === 0){
                        moved = true;
                        board[j-1][e].value = board[j][e].value;
                        board[j][e].value = 0;
                        j--;
                    }
                    if(j > 0 && !board[j-1][e].merged){
                        if(board[j-1][e].value == board[j][e].value){
                            moved = true;
                            board[j-1][e].value*=2;
                            board[j][e].value=0;
                            board[j-1][e].merged=true;
                            j--;
                        }
                    }
                    $("#"+i+"_"+e).animate({"margin-top":.25+j*4.5+"rem"},100,function(){
                        numMoved++;
                        if(numMoved==total){
                            endOfTurn(moved);
                        }
                    });
                }
            }
        }
        
    } 
    if(key===down){
        var moved = false;
        var total = 0; 
        var numMoved = 0;
        for(var i=board.length-2; i >= 0; i--){ // Down as it increments
            for(var e=0;e<board[i].length;e++){ // Right as it increments
                console.log(i,e);
                if(board[i][e].value != 0){
                    total++;
                    var j = i;
                    while(j < board.length-1 && board[j+1][e].value === 0){
                        moved = true;
                        board[j+1][e].value = board[j][e].value;
                        board[j][e].value = 0;
                        j++;
                    }
                    if(j < board.length-1 && !board[e][j+1].merged){
                        if(board[j+1][e].value == board[j][e].value){
                            moved = true;
                            board[j+1][e].value*=2;
                            board[j][e].value=0;
                            board[j+1][e].merged=true;
                            j++;
                        }
                    }
                    $("#"+i+"_"+e).animate({"margin-top":.25+j*4.5+"rem"},100,function(){
                        numMoved++;
                        if(numMoved==total){
                            endOfTurn(moved);
                        }
                    });
                }
            }
        }
        
    } 
    if(key===left){
        var moved = false;
        var total = 0; 
        var numMoved = 0;
        for(var i=1; i < board.length; i++){ // Down as it increments
            for(var e=0;e<board[i].length;e++){ // Right as it increments
                console.log(i,e);
                if(board[e][i].value != 0){
                    total++;
                    var j = i;
                    while(j > 0 && board[e][j-1].value === 0){
                        moved = true;
                        board[e][j-1].value = board[e][j].value;
                        board[e][j].value = 0;
                        j--;
                    }
                    if(j > 0 && !board[e][j-1].merged){
                        if(board[e][j-1].value == board[e][j].value){
                            moved = true;
                            board[e][j-1].value*=2;
                            board[e][j].value=0;
                            board[e][j-1].merged=true;
                            j--;
                        }
                    }
                    $("#"+e+"_"+i).animate({"margin-left":.25+j*4.5+"rem"},100,function(){
                        numMoved++;
                        if(numMoved==total){
                            endOfTurn(moved);
                        }
                    });
                }
            }
        }
    } 
    if(key===right){
        var moved = false;
        var total = 0; 
        var numMoved = 0;
        for(var i=board.length-2; i >= 0; i--){ // Down as it increments
            for(var e=0;e<board[i].length;e++){ // Right as it increments
                console.log(i,e);
                if(board[e][i].value != 0){
                    total++
                    var j = i;
                    while(j < board.length-1 && board[e][j+1].value === 0){
                        moved = true;
                        board[e][j+1].value = board[e][j].value;
                        board[e][j].value = 0;
                        j++;
                    }
                    if(j < board.length-1 && !board[e][j+1].merged){
                        if(board[e][j+1].value == board[e][j].value){
                            moved = true;
                            board[e][j+1].value*=2;
                            board[e][j].value=0;
                            board[e][j+1].merged=true;
                            j++;
                       }
                    }
                    $("#"+e+"_"+i).animate({"margin-left":.25+j*4.5+"rem"},100,function(){
                        numMoved++;
                        if(numMoved==total){
                            endOfTurn(moved);
                        }
                    });
                }
            }
        }
    } 
}
function init(){
    highscore = $("#highscore")
    active = true;
    for(var i=0; i<board.length; i++){
        for(var e=0; e<board[i].length;e++){
            board[i][e].value = 0;
            board[i][e].merged = false;
        }
    }
    reDraw();
    addRandom();
    addRandom();
} 

$(function(){
    createGrid();
    init();
    $(this).keydown(function(e){
        if(active){
            switch(e.which){
                case up:
                    move(e.which)
                    break;
                case down:
                    move(e.which)
                    break;
                case left:
                    move(e.which)
                    break;
                case right:
                    move(e.which)
                    break;
            }
        }
    });
});

