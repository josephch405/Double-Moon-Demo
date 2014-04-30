var learningRate=.04;

function Neuron(){
	this.numberOfInputs=0;	//includes bias
	this.inputs=[];
	this.weights=[];
	this.bias=1;
	this.momentum=.4;//1;
	this.prevDelta=new Array();
	
	this.setNumInputs=function(t){
		this.numberOfInputs=t;	//remembering extra input for bias
		this.inputs=new Array(t+1);
		this.inputs[t]=this.bias;
		this.weights=new Array(t+1);
		this.prevDelta.length=t+1;
		for (var i=0; i<t+1; i++){
			this.weights[i]=randomN();
			this.prevDelta[i]=0;
		}
	}
	
	this.fire=function(){
		var sum=0;
		for (var i in this.inputs){
			sum+=this.inputs[i]*this.weights[i];
		}
		sum=1/(1+Math.pow(2.718,-sum));
		return sum;
	}
	
	this.setInput=function(ind, t){
		if (ind<this.numberOfInputs){
			this.inputs[ind]=parseFloat(t);
		}
	}
	
	this.loadInputWithStr=function(inString){
		tString=inString.split(",");
		for (var i=0;i<this.numberOfInputs;i++){
			this.setInput(i, tString[i]);
		}
	}
	
	this.doesThisStringFire=function(inString){
		this.loadInputWithStr(inString);
		return this.fire();
	}
	
	this.trainThisDelta=function(delta){
		for (var i in this.weights){
			//debugger;
			this.prevDelta[i]=learningRate*delta*this.inputs[i]+this.prevDelta[i]*this.momentum;
			this.weights[i]+=learningRate*delta*this.inputs[i];//this.prevDelta[i];
		}
		//this.prevDelta=delta;
	}
}

function NeuralNet(){
	this.threshold=0;
	this.maxIters=1000;
	this.maxError=.001;
	this.layers=[new NeuralLayer(),new NeuralLayer()]; //layers[0] is input, etc.
	this.layers[0].setNeuronInfo(5,2,0,this);
	this.layers[1].setNeuronInfo(1,5,1,this);
	
	this.fire=function(){
		result=this.layers[0].fire();	//results in recursive loop that returns final result
		return result;
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
	
	this.train=function(inString, maxIters){
		inString=inString.split(";");
		inString.splice(0,1);
		if (maxIters>0){
			this.maxIters=maxIters;
		}
		var error=0;
		var tIterations=0;
		do{		//keep training
			error=0;
			for (var i in inString){
				tSet=inString[i].split(",");
				
				var actualOut=this.doesThisStringFire(inString[i]);
				var expected=tSet[tSet.length-1];
				
				this.fire();
				var deltaOut=(1-actualOut)*(expected-actualOut)*actualOut;
				
				for (var ivi in neurons[0]){
					var deltaHid=(neurons[0][ivi].fire())*(1-neurons[0][ivi].fire())*deltaOut*neurons[1][0].weights[ivi];
					nNet.layers[0].neurons[ivi].trainThisDelta(deltaHid);
				}
				nNet.layers[1].neurons[0].trainThisDelta(deltaOut);
				
				error+=Math.pow(expected-actualOut,2)/2;
				//this.trainThisDelta(gradient);
			} 
			
			tIterations++;
			error/=inString.length;
			if (count%10==0){
			console.log("iteration done, error:"+error);}
			count++;
			//learningRate*=.999;
			printGrid();
			ctx.fillText(100,100,error)
		}while((error>this.maxError||tIterations<2) && tIterations<this.maxIters )
		console.log(error);
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
		
		for (var i in this.neurons){
			for (var ii=0; ii<this.inputsPerNeuron; ii++){
				this.neurons[i].setInput(ii, input[ii]);
				
			}
		}
	}
	
	this.setAllInputsFromArray=function(input){
		for (var i in this.neurons){
			for (var ii=0; ii<this.inputsPerNeuron; ii++){
				this.neurons[i].setInput(ii, input[ii]);
				
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
		
		this.netParent=theParent;
		
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
