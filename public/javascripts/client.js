
function move(from, to){
    //moveValidate(from,to);
    initial = document.getElementById(from).textContent;
    document.getElementById(from).textContent = '';
    document.getElementById(to).textContent = initial;
}

var piece1
var piece2
var counter = 0;



document.querySelectorAll('.cell').forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        
        if(counter == 0){
          piece1 = item.id;
          var nextPiece = document.getElementById('d3');
          nextPiece.style = 'background_color: #00ff00';
          counter++;
        }else{
          var nextPiece = document.getElementById('d3');
          nextPiece.style = 'background-color: #eab676';
          piece2 = item.id
          counter = 0;
          move(piece1, piece2);
        }
    })
})