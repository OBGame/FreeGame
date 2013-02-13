/**
 * OswaldL
 * 
 */




Game.AtomScene=function(){
	this.loadedAtomes={};//hash table
}

Game.AtomScene.expandX=64;
Game.AtomScene.expandY=64;


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
	//storedAtomes
	for(var i=0;i<Game.AtomScene.expandX;i++){
		for(var j=0;j<Game.AtomScene.expandY;j++){
			this.loadedAtomes[this.generateId(i,j)]=new Game.BaseAtom(i,j); 
		}
	}
	
	//console.log(this.get(1,0))
	
	var wateratom=this.getWaterAtom();
	this.expendWaterAtom(wateratom);
	return this;

}

Game.AtomScene.prototype.getWaterAtom=function(wateratom) {
	var x=Math.floor(Math.random() * 100)%Game.AtomScene.expandX;
	var y=Math.floor(Math.random() * 100)%Game.AtomScene.expandY;
	var elevation=-Math.floor(Math.random() * 100);
	return new Game.BaseAtom(x,y,elevation);
}

/**
 * false:no need to handle
 * @param x
 * @param y
 * @returns {Boolean}
 */
Game.AtomScene.prototype.canHandle=function(atom) {
	
	if(atom){//this atom'selevation is not,so we need to handle this atom
		if(!atom.elevation||atom.elevation==0){
			return true;
		}
	}
	return false;
}

/**
 *expand  wateratom
 *  1   2   3
 *     ---  
 *  4 |x,y| 5
 *     ---  
 *  6   7   8
 *  next circumference eight center with (x,y):
 *  1   2   3
 *     ---  
 *  4 |x,y| 5
 *     ---  
 *  6   7   1
 */
Game.AtomScene.prototype.expendWaterAtom=function(wateratom) {
	if(!wateratom||!wateratom.x||!wateratom.y)return;
	console.log("water expend:"+wateratom.elevation);
	
	
	//1
	var atom1=this.loadedAtomes[this.generateId(wateratom.x-1,wateratom.y-1)];
	var temp=wateratom.elevation+Math.floor(Math.random() * 100)%10
	if(temp<0&&this.canHandle(atom1)){
		atom1.setElevation(temp);
		this.expendWaterAtom(atom1);
	}
	//2
	var atom2=this.loadedAtomes[this.generateId(wateratom.x,wateratom.y-1)];
	temp=wateratom.elevation+Math.floor(Math.random() * 100)%10
	if(temp<0&&this.canHandle(atom2)){
		atom2.setElevation(temp);
		this.expendWaterAtom(atom2);
	}
	
	//3
	var atom3=this.loadedAtomes[this.generateId(wateratom.x+1,wateratom.y-1)];
	temp=wateratom.elevation+Math.floor(Math.random() * 100)%10
	if(temp<0&&this.canHandle(atom3)){
		atom3.setElevation(temp);
		this.expendWaterAtom(atom3);
	}
	
	//4
	var atom4=this.loadedAtomes[this.generateId(wateratom.x-1,wateratom.y)];
	temp=wateratom.elevation+Math.floor(Math.random() * 100)%10
	if(temp<0&&this.canHandle(atom4)){
		atom4.setElevation(temp);
		this.expendWaterAtom(atom4);
	}
	
	//5
	var atom5=this.loadedAtomes[this.generateId(wateratom.x+1,wateratom.y)];
	temp=wateratom.elevation+Math.floor(Math.random() * 100)%10
	if(temp<0&&this.canHandle(atom5)){
		atom5.setElevation(temp);
		this.expendWaterAtom(atom5);
	}
	
	//6
	var atom6=this.loadedAtomes[this.generateId(wateratom.x-1,wateratom.y+1)];
	temp=wateratom.elevation+Math.floor(Math.random() * 100)%10
	if(temp<0&&this.canHandle(atom6)){
		atom6.setElevation(temp);
		this.expendWaterAtom(atom6);
	}
	
	
	//7
	var atom7=this.loadedAtomes[this.generateId(wateratom.x,wateratom.y+1)];
	temp=wateratom.elevation+Math.floor(Math.random() * 100)%10
	if(temp<0&&this.canHandle(atom7)){
		atom7.setElevation(temp);
		this.expendWaterAtom(atom7);
	}
	
	//8
	var atom8=this.loadedAtomes[this.generateId(wateratom.x+1,wateratom.y+1)];
	temp=wateratom.elevation+Math.floor(Math.random() * 100)%10
	if(temp<0&&this.canHandle(atom8)){
		atom8.setElevation(temp);
		this.expendWaterAtom(atom8);
	}
	
}


Game.AtomScene.prototype.getDefaultAtom=function() {
	if(!this.defaultAtome){
		var oneatom=new BaseAtom(0,0);
		this.defaultAtome=oneatom;
	}
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
	if(x<Game.AtomScene.expandX&&y<Game.AtomScene.expandY&&this.loadedAtomes[this.generateId(x,y)]){
		return this.loadedAtomes[this.generateId(x,y)];
	}else{
		console.log("unnkow data:"+x+","+y+","+Game.AtomScene.expandX+","+this.generateId(x,y)+","+this.loadedAtomes[this.generateId(x,y)])
	}
	
}


/**
 * start from default node, and generate 64*64 area. 
 * 
 * (0,0) (0,1) (0,2) (0,3)...
 * (1,0) (1,1)..
 * (2,0)  .
 * (3,0)  .
 *  .
 *  .
 */
Game.AtomScene.prototype.mapExpand=function() {
	console.log("AtomScene mapExpand");
	var i=0,j=0;
	for(;i<Game.AtomScene.expandX;i++){
		for(;j<Game.AtomScene.expandY;j++){
			if(!this.loadedAtomes[this.generateId(i,j)]){
				this.loadedAtomes[this.generateId(i,j)]=new Game.BaseAtom(i,j); 
			}else{
				//console.log("exist atom:"+this.loadedAtomes[this.generateId(i,j)].toString());
			}
		}
	}
}



