/**
 * 
 * 
 */

Game.BaseAtom=function(x,y,elevation){
	this.x=x;
	
	this.y=y;
	
	if(elevation)
		this.elevation=elevation;
	else this.elevation=0;
	
}

Game.BaseAtom.prototype.subAtoms=[];

Game.BaseAtom.prototype.Terrain=["grass", "lake"];	

Game.BaseAtom.prototype.lakeElevation=0;

Game.BaseAtom.prototype.getTerrain=function(){
	var terrains=Game.BaseAtom.prototype.Terrain;
	if(this.elevation<Game.BaseAtom.prototype.lakeElevation){
		return terrains[1];
	}
	return terrains[0];
}

Game.BaseAtom.prototype.setElevation=function(elevation){
	this.elevation=elevation;
}

Game.BaseAtom.prototype.getElevation=function(){
	return this.elevation;
}


Game.BaseAtom.prototype.toString=function(){
	return (["(",this.x,",",this.y,",",this.elevation,")"].join(" "));
}

Game.BaseAtom.prototype.toJSON=function(){
	return "{'x':"+this.x+",'y':"+this.y+"}";
}
