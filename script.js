var OrigBoard;
const huPlayer='O'
const AiPlayer='X'
const winComb=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2],
]

const cells=document.querySelectorAll(".cell")
startGame()

function startGame(){
    document.querySelector(".endgame").style.display="none"
    OrigBoard=Array.from(Array(9).keys())
    for(var i=0;i<cells.length;i++){
        cells[i].innerHTML=""
        cells[i].style.removeProperty('background-color')
        cells[i].addEventListener("click",turnClick,false)
    }
}

function turnClick(square){
    if(typeof OrigBoard[square.target.id]=='number'){
        turn(square.target.id,huPlayer)
        if(!checkTie()) turn(bestSpot(),AiPlayer)
        
    }
    
}

function turn(squareId,player){
 OrigBoard[squareId]=player
 document.getElementById(squareId).innerText=player
 let gameWon=Checkwin(OrigBoard,player)
 if(gameWon) GameOver(gameWon)
}

function Checkwin(board,player){
 let plays=board.reduce((a,e,i)=>(e===player) ? a.concat(i) : a,[])
 let gameWon=null
 for(let [index,win] of winComb.entries()){
   if(win.every(elem=>plays.indexOf(elem)>-1)){
    gameWon={index:index,player:player}
    break;
   }
 }
 return gameWon;
}

function GameOver(gameWon){
  for(let index of winComb[gameWon.index]){
    document.getElementById(index).style.backgroundColor=
     gameWon.player==huPlayer ? "blue":"red"  }
     for(var i=0;i<cells.length;i++){
       cells[i].removeEventListener("click",turnClick,false)
     }
     declareWinner(gameWon.player==huPlayer ? "Kazandınız":"kaybettiniz")
}

function declareWinner(who){
  document.querySelector(".endgame").style.display="block"
  document.querySelector(".text").innerText=who
}

function emptySquare(){
    return OrigBoard.filter(s=>typeof s =='number')
}

function bestSpot(){
  return  minimax(OrigBoard,AiPlayer).index
}

function checkTie(){
    if(emptySquare().length==0){
        for(var i=0;i<cells.length;i++){
            cells[i].style.backgroundColor="green"
            cells[i].removeEventListener("click",turnClick,false)
        }
        declareWinner("Tie Game!!")
        return true;
    }
    return false
}

function minimax(newBoard,player){
    var availableSpot=emptySquare(newBoard)

    if(Checkwin(newBoard,player)){
        return {score:-10};
    }else if(Checkwin(newBoard,AiPlayer)){
        return {score:20};
    }else if(availableSpot.length===0){
      return {score:0};
    }
    var moves=[]
    for(var i=0;i<availableSpot.length;i++){
        var move={}
        move.index=newBoard[availableSpot[i]]
        newBoard[availableSpot[i]]=player

        if(player==AiPlayer){
            var result=minimax(newBoard,huPlayer)
            move.score=result.score
        }else{
            var result=minimax(newBoard,AiPlayer)
            move.score=result.score
        }
        newBoard[availableSpot[i]]=move.index
        moves.push(move)
    }

    var bestMove;
    if(player===AiPlayer){
        var bestScore=-10000
        for(var i=0;i<moves.length;i++){
            if(moves[i].score>bestScore){
                bestScore=moves[i].score
                bestMove=i
            }
        }
    }else{
        var bestScore=10000
        for(var i=0;i<moves.length;i++){
            if(moves[i].score<bestScore){
                bestScore=moves[i].score
                bestMove=i
            }
        }
    }

    return moves[bestMove]

}