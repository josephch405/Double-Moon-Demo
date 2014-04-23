var fr=16;
var fw=4;
var fd=3;

var count=0;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "black";

var coordinatesArray=[];
var uppermoon=[];
var lowermoon=[];

var nNet=new NeuralNet();

printGrid();

var neurons=[[nNet.layer1.neurons],[nNet.layer2.neurons]]

function train(){
	nNet.scramble();
	var trainString="3;";
	for (var i=0; i<1000; i++){
		trainString+=uppermoon[i][0]+","+uppermoon[i][1]+",1;";
		trainString+=lowermoon[i][0]+","+lowermoon[i][1]+",-1;";
	}
	trainString=trainString.substring(0, trainString.length - 1);
	nNet.train(trainString);
	fire();
}

function scramble(){
	nNet.scramble();
}

function fire(){
	ctx.fillStyle="white";
	ctx.fillRect(0,0, 800, 600);
	ctx.beginPath();
	ctx.moveTo(0, 300);
	ctx.lineTo(800, 300);
	ctx.strokeStyle="black";
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(400, 0);
	ctx.lineTo(400, 600);
	ctx.strokeStyle="black";
	ctx.stroke();
	ctx.fillStyle="black";
	for (var i=0; i<80; i++){
		for (var ii=0; ii<60; ii++){
			if (nNet.doesThisStringFire((-40+i)+","+(30-ii))>0){
			ctx.fillStyle="black";
			ctx.fillRect(10*i-1,10*ii-1,2,2);
			}
		}
	}
	
	for (var i=0; i<coordinatesArray.length; i++){
		if (nNet.doesThisStringFire(coordinatesArray[i][0]+","+coordinatesArray[i][1])>0){ctx.fillStyle="red";}
		else{ctx.fillStyle="blue"}
		ctx.fillRect(400+coordinatesArray[i][0]*10-1,300-coordinatesArray[i][1]*10-1,2,2);
	}
}

function changeParams(){
	fr=parseFloat(document.getElementById("rr").value);
	fd=parseFloat(document.getElementById("dd").value);
	fw=parseFloat(document.getElementById("ww").value);
}