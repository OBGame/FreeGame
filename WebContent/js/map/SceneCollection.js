/**
 * 
 */
Game.SceneCollection=function(){
	this.scenes={};
	
}

Game.SceneCollection.prototype.init=function(){
	var firstScene=new Game.AtomScene().init();
	this.scenes[this.generateId(0,0)]=firstScene;
}

/**
 *expand  scenes[i][j]'s area
 *  direct:
 *      1
 *     ---  
 *  4 |i,j| 2
 *     ---  
 *      3
 */
Game.SceneCollection.prototype.generateId=function(i,j){
	return i+"-"+j;
}
Game.SceneCollection.prototype.mapExpand=function(i,j,direct) {
	var orginScene=this.scenes[this.generateId(i,j)];
	if(!orginScene){
		console.log("node not exist:"+this.generateId(i,j));
		return;
	}
	
	if(direct==1){//expand i,j-1
		var atomscene=new Game.AtomScene();
		//reset defaultAtom
		var orginAtom=orginScene.getDefaultAtom();
		atomscene.setDefaultAtom(orginAtom.x,orginAtom.y-Game.AtomScene.expandY);
		
		atomscene.mapExpand();
		this.scenes[this.generateId(i,j-1)]=atomscene;
	}
	else if(direct==2){//expand i+1,j 
		var atomscene=new Game.AtomScene();
		//reset defaultAtom
		var orginAtom=orginScene.getDefaultAtom();
		atomscene.setDefaultAtom(orginAtom.x+Game.AtomScene.expandX,orginAtom.y);
		
		atomscene.mapExpand();
		this.scenes[this.generateId(i+1,j)]=atomscene;
		
	}else if(direct==3){//expend i,j+1
		var atomscene=new Game.AtomScene();
		//reset defaultAtom
		var orginAtom=orginScene.getDefaultAtom();
		atomscene.setDefaultAtom(orginAtom.x,orginAtom.y+Game.AtomScene.expandX);
		
		atomscene.mapExpand();
		this.scenes[this.generateId(i,j+1)]=atomscene;
	}else{//expend i-1,j
		var atomscene=new Game.AtomScene();
		//reset defaultAtom
		var orginAtom=orginScene.getDefaultAtom();
		atomscene.setDefaultAtom(orginAtom.x-Game.AtomScene.expandX,orginAtom.y);
		
		atomscene.mapExpand();
		this.scenes[this.generateId(i-1,j)]=atomscene;
	}
}

Game.SceneCollection.prototype.get=function(x,y){
	var orginScene=this.scenes[this.generateId(x,y)];
	return orginScene;
}



