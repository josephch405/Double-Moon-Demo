function Neuron(){
	this.threshold=0.0;
	this.numberOfInputs=0;
	this.inputs=new Array();
	this.weights=new Array();
	this.origLearnRate=.05;
	this.learningRate=.05;
	
	this.setNumInputs=function(t){
		this.numberOfInputs=t+1;	//remembering extra input for bias
		this.inputs=new Array(t+1);
		this.inputs[t]=4;
		this.weights=new Array(t+1);
		for (var i=0; i<t+1; i++){
			this.weights[i]=randomN();
		}
	}
	
	this.fire=function(){
		var sum=0;
		for (var i in this.inputs){
			sum+=this.inputs[i]*this.weights[i];
		}
		sum=2/(1+Math.pow(2.718,-sum))-1;
		return sum;
	}
	
	this.setInput=function(ind, t){
		if (ind<this.numberOfInputs){
			this.inputs[ind]=t;
		}
	}
	
	this.loadInputWithStr=function(inString){
		tString=inString.split(",");
		for (var i=0;i<this.numberOfInputs-1;i++){
			this.setInput(i, tString[i]);
		}
	}
	
	this.doesThisStringFire=function(inString){
		this.loadInputWithStr(inString);
		return this.fire();
	}
	
	this.trainThisDelta=function(delta){
		for (var i in this.weights){
			this.weights[i]+=this.learningRate*delta*this.inputs[i];
		}
	}
}

function NeuralNet(){
	this.threshold=0;
	this.maxIters=2000;
	this.maxError=.01;
	this.layer1=new NeuralLayer();
	this.layer2=new NeuralLayer();
	this.layer1.setNeuronInfo(3,2);
	this.layer2.setNeuronInfo(1,2);
	this.layer1.nextLayer=this.layer2;
	this.layer2.prevLayer=this.layer1;
	this.layer1.scramble();
	this.layer2.scramble();
	
	this.fire=function(){
		result=this.layer1.fire();
		return result;
	}
	
	this.trainThisDelta=function(delta){
		this.layer2.trainThisDelta(delta);
		for (var i=0; i<this.layer1.neurons.length; i++){
			this.layer1.neurons[i].trainThisDelta(delta)*this.layer2.neurons[0].inputs[i]*(1-this.layer2.neurons[0].inputs[i]);
		}
	}
	
	this.doesThisStringFire=function(inString){
		result=this.layer1.fire(inString.split(","));
		return result;
	}
	
	this.scramble=function(){
		this.layer1.scramble();
		this.layer2.scramble();
	}
	
	this.train=function(inString){
		debugger;
		inString=inString.split(";");
		debugger;
		inString.splice(0,1);
		var error=0;
		var tIterations=0;
		debugger;
		do{		//keep training
			error=0;
			for (var i in inString){
				tSet=inString[i].split(",");
				
				var tError=tSet[tSet.length-1]-this.doesThisStringFire(inString[i]);
				
				
				error+=Math.abs(tError);
				if (tError!=0){
				this.trainThisDelta(tError);
				}
			} 
			
			if (error==0){debugger;}
			
			tIterations++;
			error/=inString.length;
			if (count%10==0){
			console.log(error);}

			count++;
			
			//this.learningRate=this.origLearnRate*Math.pow(error/this.maxError*10,2)
			printGrid();
			ctx.fillText(100,100,error)
		}while((error>this.maxError||tIterations<2) && tIterations<this.maxIters )
	}
}

function NeuralLayer(){

	this.neurons=[];
	this.nextLayer;
	this.prevLayer;
	this.numberOfNeurons, this.inputsPerNeuron, this.outputsPerNeuron, this.layerIndex;	//depth is 0 for input, 1 for hidden layer 1, etc
	
	this.fire=function(input){	//input is array
		var output=[];
		if (input!=null){
			var tString="";
			for (var i in input){
				tString+=input[i]+",";
			}
			tString=tString.substring(0, tString.length - 1);
			
			for (var i in this.neurons){
				output.push(this.neurons[i].doesThisStringFire(tString));
			}
			
		}
		else{
			
			for (var i in this.neurons){
				output.push(this.neurons[i].fire());
			}
		}
		if (this.nextLayer!=undefined){
			
				output=this.nextLayer.fire(output);
		}
		return output;
	}
	
	this.setAllInputs=function(input){
		var output=[];
		var tString="";
		for (var i in input){
			tString+=input[i]+",";
		}
		tString=tString.substring(0, tString.length - 1);
		for (var i in this.neurons){
			output.push(this.neurons[i].doesThisStringFire(tString));
		}
	}

	this.setNeuronInfo=function(thisManyNeurons,thisManyInputs){
		this.neurons=[];
		for (var i=0; i<thisManyNeurons;i++){
			this.neurons.push(new Neuron());
		}
		inputsPerNeuron=thisManyInputs;
		for (var i in this.neurons){
			this.neurons[i].setNumInputs(thisManyInputs);
		}
	}
	
	this.scramble=function(){
		for(var i in this.neurons){
			for (var ii in this.neurons[i].weights){
				this.neurons[i].weights[ii]=randomN();
			}
		}
	}
	
	this.trainThisDelta=function(delta){
		for (var i in this.neurons){
			this.neurons[i].trainThisDelta(delta);
		}
	}
}
