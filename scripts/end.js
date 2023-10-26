let data = [

];



function init(){
    let object = localStorage.getItem("points_table");
    if(object == null) return;
    let objectData = JSON.parse(object);
    
    let elemen = "";
    objectData.map(ele =>{
        
        elemen += `
        <li>
        <span class="number">${ele.id}</span>
        <span class="name">${ele.name}</span>
        <span class="score">${ele.score}</span>
        <span class="badge">^</span>
        </li>`;
        data.push(ele)
})
    document.querySelector("ul").innerHTML = elemen;

}

function resetTable(){
   localStorage.setItem("points_table",null);
}

function launch(){
    document.querySelector("._container").style.display = 'none';
    let name = document.querySelector(".input_name").value;
    let curScore =JSON.parse(localStorage.getItem("score010")).pts;
    
    let player = {
        id: data.length+1,
        name: name,
        score : curScore
    }
    data.push(player);
    data.sort((a,b) => (b.score - a.score));
    localStorage.setItem("points_table",JSON.stringify(data));
    init()
}