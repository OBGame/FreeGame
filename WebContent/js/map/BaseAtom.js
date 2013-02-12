/**
 * 
 * 
 */

Game.BaseAtom=function(x,y){
	this.x=x;
	
	this.y=y;
	
	this.terrain=Game.BaseAtom.prototype.Terrain[Math.floor(Math.random() * 100) % Game.BaseAtom.prototype.Terrain.length]
	
}

Game.BaseAtom.prototype.subAtoms=[];

Game.BaseAtom.prototype.Terrain=["grass", "lake"];	

Game.BaseAtom.prototype.addSubAtoms=function(){
	
	
}


Game.BaseAtom.prototype.toString=function(){
	return (["(",this.x,",",this.y,")"].join(" "));
}

Game.BaseAtom.prototype.toJSON=function(){
	return "{'x':"+this.x+",'y':"+this.y+"}";
}
