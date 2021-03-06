var imageHeight, imageWidth;
		//Taille de base
		var widthBase=600;
        var heightBase=600;
		var imageAddr="";
        
        var massiveDesImages=new Array();
		var massiveSize=3;

function checkScreenSizes(){
	//var aspect=window.devicePixelRatio;
	//console.log("aspect "+aspect);
	var screenWidth=screen.availWidth;
	var screenHeight=screen.availHeight;
	console.log ("ScreenWidth: "+screenWidth+" "+"ScreenHeight: "+screenHeight);
	
	var maxHorizontalSize=(screenWidth-50-8)/2;
	var maxVerticalSize=screenHeight-130-210;
	console.log("MaxHorizontalSize: "+maxHorizontalSize+" MaxVerticalSize: "+maxVerticalSize);
	widthBase=maxHorizontalSize;
	heightBase=maxVerticalSize;
	document.getElementById("sourceDesImages").style.width=(((widthBase-4)/massiveSize)*massiveSize+4)+"px";
    document.getElementById("sourceDesImages").style.height=(((heightBase-4)/massiveSize)*massiveSize+4)+"px";
    document.getElementById("resultat").style.width=(((widthBase-4)/massiveSize)*massiveSize+4)+"px";
    document.getElementById("resultat").style.height=(((heightBase-4)/massiveSize)*massiveSize+4)+"px";
	document.getElementById("blockCenter").style.width=(widthBase*2+58)+"px";
	document.getElementById("division").style.height=(((heightBase-4)/massiveSize)*massiveSize+4)+"px";
	fillingByBoxes((widthBase-4)/massiveSize, (heightBase-4)/massiveSize);
}		
		
//Changes the number of pictures after select.onchange
function changeSize(){
	massiveSize=document.getElementById("selectSize").options[document.getElementById("selectSize").selectedIndex].value;
	fillingByBoxes(imageWidth/massiveSize, imageHeight/massiveSize);
}		
		
//filling array from 1 to size		
function fillingMassive(size){
	massiveDesImages=new Array();
	for (var i=0; i<size*size; i++){
		massiveDesImages[i]=i+1;
	}
}		

//Randomize massive
function fillMassiveByRandom(){
	fillingMassive(massiveSize);
	massiveDesImages.sort(function(){
  return .5 - Math.random();
});
}	

//upload image from file system
function Upload() {
    //Get reference of FileUpload.
    var fileUpload = document.getElementById("uploadImage");
 
    //Check whether the file is valid Image.
    var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.jpg|.png|.gif)$");
    if (regex.test(fileUpload.value.toLowerCase())) {
 
        //Check whether HTML5 is supported.
        if (typeof (fileUpload.files) != "undefined") {
            //Initiate the FileReader object.
            var reader = new FileReader();
            //Read the contents of Image File.
            reader.readAsDataURL(fileUpload.files[0]);
            reader.onload = function (e) {
                //Initiate the JavaScript Image object.
                var image = new Image();
                image.src = e.target.result;
				imageAddr=e.target.result;
                image.onload = function () {
					//Reduce the size of the picture to a maximum of 600 pixels, preserving the aspectRatio
					var height = this.height;
                    var width = this.width;
                    var aspectRatio=width/height;
                    if (aspectRatio<=widthBase/heightBase){
                        imageHeight=heightBase-4;
                        imageWidth=imageHeight*aspectRatio;
                    } else {
                        imageWidth=widthBase-4;
                        imageHeight=imageWidth/aspectRatio;
                    }
                    var widthDeBoxes=imageWidth/massiveSize;
                    var heightDeBoxes=imageHeight/massiveSize;
					//Change size of containers for saving aspect ratio
                    document.getElementById("sourceDesImages").style.width=(widthDeBoxes*massiveSize+4)+"px";
                    document.getElementById("sourceDesImages").style.height=(heightDeBoxes*massiveSize+4)+"px";
                    document.getElementById("resultat").style.width=(widthDeBoxes*massiveSize+4)+"px";
                    document.getElementById("resultat").style.height=(heightDeBoxes*massiveSize+4)+"px";
					document.getElementById("blockCenter").style.width=(imageWidth*2+58)+"px";
					document.getElementById("division").style.height=(imageHeight+4)+"px";

					fillingByBoxes(widthDeBoxes, heightDeBoxes);
                }; 
            };
        } else {
            alert("This browser does not support HTML5.");
            return false;
        }
    } else {
        alert("Please select a valid Image file.");
        return false;
    }
}

//Delete all elements #boxes and #result_boxes from the page
function removeAllBoxes(){
	var allSources=document.getElementsByClassName("boxes");
	var allDestinations=document.getElementsByClassName("result_boxes");
	for (var i=allSources.length-1; i>=0;i--){
		allSources[i].parentNode.removeChild(allSources[i]);
	}
	for (var i=allDestinations.length-1; i>=0;i--){
		allDestinations[i].parentNode.removeChild(allDestinations[i]);
	}
}
	
//filling by .boxes and .result_boxes containers  #sourceDesImages and #resultat with new sizes	
function fillingByBoxes(widthOfElem, heightOfElem){
	removeAllBoxes();
	fillMassiveByRandom();
	var elem;
	var parentSource=document.getElementById("sourceDesImages");
	var parentDestination=document.getElementById("resultat");
	for (var i=0; i<massiveSize; i++){
		for (var j=0; j<massiveSize; j++){
			//create element .boxes
			elem=document.createElement('div');
			elem.id="box"+i+j;
			elem.className="boxes";
			elem.style.width=widthOfElem+"px";
			elem.style.height=heightOfElem+"px";
			elem.style.backgroundSize=imageWidth+"px "+imageHeight+"px";
			elem.setAttribute('draggable', 'true');
			elem.addEventListener("dragstart", function(e) {
				e.dataTransfer.effecAllowed = 'move';
				e.dataTransfer.setData("Text", e.target.id);
				e.target.style.opacity = '0.5'; 
			});
			elem.addEventListener("dragend", function(e) {
				e.target.style.opacity = "1";	
				e.dataTransfer.clearData("Data");
			});
			if (imageAddr!==""){
				elem.style.backgroundImage = "url(" + imageAddr + ")"; 
				backPositionY=100*Math.floor((massiveDesImages[i*massiveSize+j]-1)/massiveSize)/(massiveSize-1);
				backPositionX=100*(massiveDesImages[i*massiveSize+j]-Math.floor((massiveDesImages[i*massiveSize+j]-1)/massiveSize)*massiveSize-1)/(massiveSize-1);
				elem.style.backgroundPosition=backPositionX+"% "+backPositionY+"%";
				elem.dataset.position=massiveDesImages[i*massiveSize+j];
			}
			parentSource.appendChild(elem);
			
			//create element .result_boxes
			elem=document.createElement('div');
			elem.id="box_result"+i+j;
			elem.className="result_boxes";
			elem.style.width=widthOfElem+"px";
			elem.style.height=heightOfElem+"px";
			elem.setAttribute('draggable', 'true');
			elem.ondragenter = function(e){return true;};
			elem.ondragover= function(e){
				if ((e.target.className == "result_boxes") || (e.target.id == "sourceDesImages"))
					return false;
				else
					return true;
			};
			elem.ondrop = function(e){
				e.preventDefault();
				var element = e.dataTransfer.getData("Text");
				e.target.appendChild(document.getElementById(element));
				verifierPuzzle();
			};
			parentDestination.appendChild(elem);
		}
	}
}


function start(e) {
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData("Text", e.target.id);
	e.target.style.opacity = '0.5';  
}

function end(e){
	e.target.style.opacity = "1";	
	e.dataTransfer.clearData("Text");		
}

function enter(e) {
	return true;
}


function over(e) {
	if ((e.target.className == "result_boxes")||(e.target.id == "sourceDesImages")){
		return false;	
	}
	else{
		return true;
	}
}    

function drop(e){
	e.preventDefault();
	var element = e.dataTransfer.getData("Text");
	e.target.appendChild(document.getElementById(element));
	verifierPuzzle();
}
//check if puzzle is done
function verifierPuzzle(){
	var parent=document.getElementById("resultat");
	var elementsInResult=parent.getElementsByClassName("boxes").length;
	var allElementsInResult=parent.getElementsByClassName("boxes");
	var result=true;
	if (elementsInResult==massiveSize*massiveSize){
		for (var i=0; i<massiveSize*massiveSize; i++){
			if (allElementsInResult[i].dataset.position!=(i+1)){
				result=false;
			}
		}
		if (result) {
			alert("Mes félicitations");
		} else{
			alert ("Malheureusement, pas correctement");
		}
	}
}