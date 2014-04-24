function Neuron(){
	this.numberOfInputs=0;	//includes bias
	this.inputs=[];
	this.weights=[];
	this.learningRate=.5;
	this.bias=1;
	
	this.setNumInputs=function(t){
		this.numberOfInputs=t+1;	//remembering extra input for bias
		this.inputs=new Array(t+1);
		this.inputs[t]=this.bias;
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
		if (ind<this.numberOfInputs-1){
			this.inputs[ind]=parseFloat(t);
		}
		debugger;
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
	this.maxIters=2;
	this.maxError=.001;
	this.layers=[new NeuralLayer(),new NeuralLayer()]; //layers[0] is input, etc.
	this.layers[0].setNeuronInfo(3,2,0,this);
	this.layers[1].setNeuronInfo(1,3,1,this);
	
	this.fire=function(){
		result=this.layers[0].fire();	//results in recursive loop that returns final result
		return result;
	}
	
	this.trainThisDelta=function(delta){
		this.layers[1].trainThisDelta(delta);
		debugger;
		for (var i=0; i<this.layers[0].neurons.length; i++){
			this.layers[0].neurons[i].trainThisDelta(delta)*this.layers[1].neurons[0].inputs[i]*(1-this.layers[1].neurons[0].inputs[i]);
		}
	}
	
	this.doesThisStringFire=function(inString){
		this.layers[0].setAllInputs(inString);
		result=this.layers[0].fire();
		return result;
	}
	
	this.scramble=function(){
		for (var i in this.layers){
			this.layers[i].scramble();
		}
	}
	
	this.train=function(inString){
		inString=inString.split(";");
		inString.splice(0,1);
		var error=0;
		var tIterations=0;
		do{		//keep training
			error=0;
			for (var i in inString){
				tSet=inString[i].split(",");
				var tError=tSet[tSet.length-1]-this.doesThisStringFire(inString[i]);
				error+=Math.abs(tError);
				this.trainThisDelta(tError);
				console.log("b");
			} 
			
			tIterations++;
			error/=inString.length;
			if (count%1==0){
			console.log("iteration done, error:"+error);}
			count++;
			//this.learningRate=this.origLearnRate*Math.pow(error/this.maxError*10,2)
			printGrid();
			ctx.fillText(100,100,error)
		}while((error>this.maxError||tIterations<2) && tIterations<this.maxIters )
	}
}

function NeuralLayer(){

	this.neurons=[];
	this.netParent;
	this.numberOfNeurons, this.inputsPerNeuron, this.outputsPerNeuron, this.layerIndex;	//depth is 0 for input, 1 for hidden layer 1, etc
	//inputs/neuron includes bias
	
	this.fire=function(){	//input is array
		var output=[];
		for (var i in this.neurons){
			output.push(this.neurons[i].fire());
		}
		if (this.netParent.layers[this.layerIndex+1]!=undefined){
			this.netParent.layers[this.layerIndex+1].setAllInputsFromArray(output);
			output=this.netParent.layers[this.layerIndex+1].fire(output);
		}
		return output;
	}
	
	this.setAllInputs=function(input){
		input=input.split(",");
		debugger;
		for (var i in this.neurons){
			for (var ii=0; ii<this.inputsPerNeuron; ii++){
				this.neurons[i].setInput(ii, input[ii]);
				debugger;
			}
		}
	}
	
	this.setAllInputsFromArray=function(input){
		for (var i in this.neurons){
			for (var ii=0; ii<this.inputsPerNeuron; ii++){
				this.neurons[i].setInput(ii, input[ii]);
				debugger;
			}
		}
	}

	this.setNeuronInfo=function(thisManyNeurons,thisManyInputs, thisLayer, theParent){
		this.neurons=[];
		for (var i=0; i<thisManyNeurons;i++){
			this.neurons.push(new Neuron());
		}
		this.inputsPerNeuron=thisManyInputs;
		for (var i in this.neurons){
			this.neurons[i].setNumInputs(thisManyInputs);
		}
		this.layerIndex=thisLayer;
		debugger;
		this.netParent=theParent;
		debugger;
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
