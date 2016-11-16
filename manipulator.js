$(document).ready(function() { 

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var info =document.getElementById('info');
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var applicableFormats=["jpg","png","gif"]
var angleInDegrees=0;
var zoomDelta = 0.1;
var currentScale = 1;
var fileName;
var img;
var manipulationsStack = new Array();
var intialImageParametars;
function handleImage(e){
	getFileName();
	validateFile();
    var reader = new FileReader();
	
    reader.onload = function(event){
  
        img = new Image();
        img.onload = function(){
      //   intialImageParametars={width:"img.width",height:"img.height"};
		var imageRation = img.width/img.height;
	
		 if(img.width>=img.height){
			  canvas.width = img.width;
            canvas.height = img.width;
			
			ctx.drawImage(img,0,(canvas.height-img.height)/2);
		  }else{
			   canvas.width = img.height;
               canvas.height = img.height;
			
			   ctx.drawImage(img,((canvas.width-img.width)/2),0);
		  }

		  
           // ctx.drawImage(img,0,0);
            ctx.save();
        }

        img.src = event.target.result;
        
    }
    reader.readAsDataURL(e.target.files[0]);
}
function validateFile(){
	var fileNameArr= fileName.split(".");
	var fileType=fileNameArr[fileNameArr.length-1];
	console.log(applicableFormats);
	var isApplicable = false;
	for(var i =0;i < applicableFormats.length;i++)
	{
		if (applicableFormats[i]==fileType){
			isApplicable= true;
		}
	}
	if(!isApplicable){
		alert("Please select proper file ")
 location.reload();
		}
}
function getFileName() {
	fileName = imageLoader.value;
	var lastIndex = fileName.lastIndexOf("\\");
	if (lastIndex >= 0) {
        fileName = fileName.substring(lastIndex + 1);
    }	
}

function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}

$("#clockwise").click(function(){
	saveManipulation(angleInDegrees,currentScale)
    if(angleInDegrees >=360||angleInDegrees<=-360){
        angleInDegrees=0;
    }
	
    angleInDegrees+=90;

    manipulate(angleInDegrees);
});

$("#counterclockwise").click(function(){
	saveManipulation(angleInDegrees,currentScale)
    if(angleInDegrees>=360||angleInDegrees<=-360){
        angleInDegrees=0;
    }
    angleInDegrees-=90;
  
    manipulate();
});
jQuery('#zoomIn').click(function () {
	saveManipulation(angleInDegrees,currentScale)
    currentScale += zoomDelta;
   
    manipulate();
});
jQuery('#zoomOut').click(function () {
	saveManipulation(angleInDegrees,currentScale)
    currentScale -= zoomDelta;
    manipulate();
});
function manipulate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(angleInDegrees*Math.PI/180);
	
    ctx.scale(currentScale, currentScale);
    //ctx.translate(-canvas.width/2,-canvas.height/2);
    ctx.drawImage(img,-img.width/2  ,-img.height/2 );
    ctx.restore();
	  info.innerHTML = angleInDegrees;
	
}
function saveManipulation(angel,scaleFactor){
	var imageParameters= {rotatingAngle:angleInDegrees, scaleFactor:currentScale};
	manipulationsStack.push(imageParameters);
	console.log(manipulationsStack);
	if(manipulationsStack.length>10){
		manipulationsStack.splice(0,1);
	}
}

document.getElementById('download').addEventListener('click', function() {
 
   downloadCanvas(this, 'imageCanvas', 'new-'+fileName);
}, false);

document.getElementById('undo').addEventListener('click', function() {
 if(manipulationsStack.length>0){
 var lastManipulation = manipulationsStack.pop();
 angleInDegrees=lastManipulation.rotatingAngle;
 currentScale =lastManipulation.scaleFactor;
   manipulate();
 }
}, false);

document.getElementById('reset').addEventListener('click', function() {
 angleInDegrees=0;
 currentScale=1;
   manipulate();
}, false);
});