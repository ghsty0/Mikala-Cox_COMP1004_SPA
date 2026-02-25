//testing implementation

//let msg = document.getElementById("msg");
document.addEventListener("mouseup", (event) => {
    if (event.button == 0){
        console.log(': left button!');
    }
    else if (event.button == 1){
        console.log(': middle button!');
    }
    else if (event.button == 2){
    console.log(': right button!');
  }
});