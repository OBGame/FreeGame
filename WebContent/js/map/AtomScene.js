/**
 * OswaldL
 * 
 */




Game.AtomScene=function(){
	this.defaultAtome;
	this.loadedAtomes={};//hash table
}

Game.AtomScene.expandX=64;
Game.AtomScene.expandY=64;

Game.AtomScene.Resource={}

Game.AtomScene.prototype.generateId=function(x,y) {
	return x+"-"+y;
}

Game.AtomScene.prototype.getAtomSize=function() {
	var count=0;
	for(var i in this.loadedAtomes){
		if(typeof this.loadedAtomes[i] !="function" )
			count++;
	}
	return count;
}

//load Atom, default area
Game.AtomScene.prototype.init=function() {
	console.log("loading atom data...");
	
	var resource="Atom";
	
	Game.AtomScene.Resource[resource]={
		"defaultAtom":{
			"x":0,
			"y":0
		},
		"storedAtomes":{
			"0-0":{
				"x":0,
				"y":0
			},
			"0-1":{
				"x":0,
				"y":1
			}
		
		}
	};
	
	//defaultAtome
	var defaultx=Game.AtomScene.Resource[resource].defaultAtom.x;
	var defaulty=Game.AtomScene.Resource[resource].defaultAtom.y;
	this.defaultAtome=new Game.BaseAtom(defaultx,defaulty); 
	
	//storedAtomes
	for(var i in Game.AtomScene.Resource[resource].storedAtomes){
		var box=Game.AtomScene.Resource[resource].storedAtomes[i];
		var x=box.x;
		var y=box.y;
		console.log("added:"+x+"-"+y);
		this.loadedAtomes[this.generateId(x,y)]=new Game.BaseAtom(x,y); 
	}
	
	return this;

}



Game.AtomScene.prototype.getDefaultAtom=function() {
	return this.defaultAtome;
}

Game.AtomScene.prototype.setDefaultAtom=function(x,y) {
	this.defaultAtome=new Game.BaseAtom(x,y);
}

Game.AtomScene.prototype.getLoadedAtom=function() {
	// for(var i in this.loadedAtomes){
		// console.log(this.loadedAtomes[i].toString());
	// }
	return this.loadedAtomes;
}

Game.AtomScene.prototype.get=function(x,y) {
	// for(var i in this.loadedAtomes){
		// console.log(this.loadedAtomes[i].toString());
	// }
	return this.loadedAtomes[this.generateId(x,y)];
}


/**
 * start from default node, and generate 64*64 area. 
 */
Game.AtomScene.prototype.mapExpand=function() {
	var startAtom=this.getDefaultAtom();
	console.log(Game.AtomScene.expandX);
	for(var i=0;i<Game.AtomScene.expandX;i++){
		for(var j=0;j<Game.AtomScene.expandY;j++){
			// console.log(i+"-"+j+" "+this.loadedAtomes[this.generateId(i,j)]);
			if(!this.loadedAtomes[this.generateId(i,j)]){
				var x=startAtom.x+i;
				var y=startAtom.y+j;
				this.loadedAtomes[this.generateId(x,y)]=new Game.BaseAtom(x,y); 
			}else{
				console.log("exist atom:"+this.loadedAtomes[this.generateId(i,j)].toString());
			}
		}
	}
}



