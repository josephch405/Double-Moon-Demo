function randomCoord(array, w, r, orig, neg){
	var i=Math.random()*neg;
	var ii=r+(Math.random()*2-1)*w;
	array.push([Math.cos(Math.PI*i)*ii+orig[0] , Math.sin(Math.PI*i)*ii+orig[1]]);
}

function newSet(){
	coordinatesArray=[];
	uppermoon=[];
	lowermoon=[];
	for (var i=0; i<1000; i++){
		randomCoord(uppermoon, fw, fr,[0,0] , 1)
	}
	for (var i=0; i<1000; i++){
		randomCoord(lowermoon, fw, fr,[fr,-fd] , -1)
	}
	coordinatesArray=uppermoon.concat(lowermoon);
	printGrid();
}

function printGrid(){
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
	for (var i=0; i<coordinatesArray.length; i++){
		ctx.fillRect(400+coordinatesArray[i][0]*10-1,300-coordinatesArray[i][1]*10-1,2,2);
	}
}

function randomN(){
	tempV=(Math.random()-.5);
	return tempV;
}

function RGB2HTML(red, green, blue)
{
    var decColor =0x1000000+ blue + 0x100 * green + 0x10000 *red ;
    return '#'+decColor.toString(16).substr(1);
}