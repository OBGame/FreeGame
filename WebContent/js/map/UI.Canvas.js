/**

    All copyleft under GNU GPLv3 below.
	Bill.Cao <gorebill@163.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
  
 */


/**
 * Canvas basic.
 * @param {Object} canvas
 */
Game.UI.Canvas=function(context) {
	Game.UI.Base.call(this);
	
	this.context=context;
	this.camera=undefined;
	
	this.RenderQueue=[]; // object to render
	
	this.rendersort=false;
	
	this.coordinateEnabled=true;
	
	this.initialize();
};
Game.UI.Canvas.prototype=Object.create(Game.UI.Base.prototype);
Game.UI.Canvas.prototype.initialize=function() {};
Game.UI.Canvas.prototype.render=function(elapsed) {
	this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	
	this.context.save();
		
	// camera control
	{
		if(this.camera instanceof Game.UI.Camera) {
			this.camera.pick(elapsed, this.context);
		}
	}
	
	// render canvas objects
	{
		
		// to bottom left coordinate
		//this.context.scale(.5, .5);
		
		// sort according z-index, desc order
		// the object with higher z index should paint later due to we should ensure they are not covered by lower one
		if(this.rendersort) {
			this.sort();	
		}
		
		// render the queue
		for(var i=0; i<this.RenderQueue.length; i++) {
			if(this.RenderQueue[i] instanceof Game.UI.Proto) {
				this.RenderQueue[i].render(elapsed, this.context);
			}
		}
		
	}
	
	// call sub class draw
	this.draw(elapsed);
	
	// draw standard axis
	if(this.coordinateEnabled) {
		
	    this.context.beginPath();
	    this.context.strokeStyle = 'red';
		this.context.moveTo(0, -8000);
		this.context.lineTo(0,  8000);
		this.context.stroke();
		this.context.closePath();
		
	    this.context.beginPath();
	    this.context.strokeStyle = 'green';
		this.context.moveTo(-8000, 0);
		this.context.lineTo( 8000, 0);
		this.context.stroke();
		this.context.closePath();
	}
	
	this.context.restore();
};
Game.UI.Canvas.prototype.draw=function(elapsed) {/* Override by sub-class */};
Game.UI.Canvas.prototype.setCamera=function(camera) {
	if(camera instanceof Game.UI.Camera) {
		this.camera=camera;
	}
	return this;
};
Game.UI.Canvas.prototype.sort=function() {
	this.RenderQueue.sort(function(a, b){
		if((a instanceof Game.UI.Proto) && (b instanceof Game.UI.Proto)) {
			return a.position.z - b.position.z;
		}else{
			return 0;
		}
	});
	return this;
};

Game.UI.Canvas.prototype.add=function(element) {
	if(element instanceof Game.UI.Proto) {
		this.RenderQueue.push(element);
	}else if(element instanceof Array) {
		for(var i=0; i<element.length; i++) {
			this.RenderQueue.push(element[i]);
		}
	}
	
	this.sort();
	
	return this;
};
Game.UI.Canvas.prototype.remove=function(element) {
	if(element instanceof Game.UI.Proto) {
		var idx=this.RenderQueue.indexOf(element);
		(idx != -1) && this.RenderQueue.splice(idx,1);
	}
	
	return this;
};









/**
 * Represent a scene.
 * @param {Object} param
 */
Game.UI.Scene=function(param, callbacks) {
	
	this.textures={}; // create it before initialize() by super calss
	
	this.cachectx=Game.UI.GetTempCanvasContext("!map", 1024, 768);
	
	Game.UI.Canvas.call(this, param);
	
	this.callbacks=callbacks || {};

	var terrain=["grass", "lake"];	
	this.map=new Array(64);
	var collection=new Game.SceneCollection();
	collection.init();
	var onescene=collection.get(0, 0);//默认取B的，bill说的
	onescene.mapExpand();
	for(var i=0; i<this.map.length; i++) {
		this.map[i]=new Array(64);
		for(var j=0; j<this.map[i].length; j++) {
			this.map[i][j] = {
				"terrain": onescene.get(i,j).terrain
			};
		}
	}
	
};
Game.UI.Scene.prototype=Object.create(Game.UI.Canvas.prototype);
Game.UI.Scene.prototype.initialize=function() {
	
	var _self=this;
	
	var resources=this.resources=[
		{
			key: "grass",
			src: "res/textures/grass-128.jpg"
		}
	];
	
	var count=0;
	
	var construct=function() {
		if(count != resources.length) return;
		
		var gridSize=32;
		console.log("construct map with grid size: " + gridSize);
		
		for(var i=0; i<_self.map.length; i++) {
			for(var j=0; j<_self.map[i].length; j++) {
				if(_self.map[i][j]["terrain"] == "grass") {
					var w=_self.textures["grass"].width;
					var h=_self.textures["grass"].height;
					
					// it should be specified all parameters, other wise, it would have a heavy render and slow down cpu
					_self.cachectx.drawImage(_self.textures["grass"], 0, 0, w, h, i*gridSize, j*gridSize, gridSize, gridSize); // from top left(0,0) to bottom right
				}
			}
		}
	};
	
	
	for(var i=0; i<this.resources.length; i++) {
		var key=this.resources[i].key;
		var src=this.resources[i].src;
		
		this.textures[key]=new Image();
		this.textures[key].onload=function() {
			this.loaded=true;
			++count;
			construct();
		};
		this.textures[key].src=src;
	}
	
	/*
	// load image
	this.textures["grass"]=new Image();
	this.textures["grass"].onload=function() {
		this.loaded=true;
		
		for(var i=0; i<32; i++) {
			for(var j=0; j<32; j++) {
				if(_self.textures["grass"].loaded) {
					var w=_self.textures["grass"].width;
					var h=_self.textures["grass"].height;
					
					//var tmpctx=Game.UI.GetTempCanvasContext(this.textures["grass"].src, w, h);
					//tmpctx.drawImage(this.textures["grass"], 0, 0, 64, 64, 0, 0, 64, 64);
					//this.context.drawImage(tmpctx.canvas, i*w, j*h);
					
					// it should be specified all parameters, other wise, it would have a heavy render and slow down cpu
					(i!=0 || j!=0) && _self.cachectx.drawImage(_self.textures["grass"], 0, 0, w, h, i*w, j*h, w, h);
				}
			}
		}
		
	};
	this.textures["grass"].src="res/textures/grass-128.jpg";
	*/
	
};
Game.UI.Scene.prototype.draw=function(elapsed) {
	/*
    this.context.beginPath();
    this.context.strokeStyle = 'white';
	this.context.rect(0, 0, 100, 100);
	this.context.stroke();
	this.context.closePath();
	*/
	
	// TODO: we should pre-construct it before every draw, it must be reduce the cpu exhausting
	
	/*
	for(var i=0; i<32; i++) {
		for(var j=0; j<32; j++) {
			if(this.textures["grass"].loaded) {
				var w=this.textures["grass"].width;
				var h=this.textures["grass"].height;
				
				//var tmpctx=Game.UI.GetTempCanvasContext(this.textures["grass"].src, w, h);
				//tmpctx.drawImage(this.textures["grass"], 0, 0, 64, 64, 0, 0, 64, 64);
				//this.context.drawImage(tmpctx.canvas, i*w, j*h);
				
				// it should be specified all parameters, other wise, it would have a heavy render and slow down cpu
				this.context.drawImage(this.textures["grass"], 0, 0, w, h, i*w, j*h, w, h);
			}
		}
	}
	*/
	
	this.context.drawImage(this.cachectx.canvas, 0, 0, this.cachectx.canvas.width, this.cachectx.canvas.height, 0, 0, this.cachectx.canvas.width, this.cachectx.canvas.height);
	
	this.callbacks["post-draw"] && this.callbacks["post-draw"](elapsed, this.context);
	
};









/**
 * Represent a battle.
 * @param {Object} param
 */
Game.UI.Battle=function(param, callbacks) {
	Game.UI.Canvas.call(this, param);
	
	this.callbacks=callbacks || {};
};
Game.UI.Battle.prototype=Object.create(Game.UI.Canvas.prototype);
Game.UI.Battle.prototype.initialize=function() {
	/*
	var a=new Game.UI.Doll("projectile");
	this.RenderQueue.push(a);
	
	var a=new Game.UI.Doll(Game.UI.Doll.GetDescriptor("saber"));
	this.RenderQueue.push(a);
	window.q=a;
	
	var b=new Game.UI.Doll(Game.UI.Doll.GetDescriptor("sword-01"));
	window.w=b;
	//b.setPosition(50);
	a.add(b);
	
	var c=new Game.UI.Scroll();
	this.RenderQueue.push(c);
	*/
	
	var camera=new Game.UI.Camera();
	this.setCamera(camera);
	//this.focus(a);
	
};
Game.UI.Battle.prototype.focus=function(target) {
	if(this.camera) {
		this.camera.lock(target);
	}else{
		this.camera.unlock();
	};
};
Game.UI.Battle.prototype.draw=function(elapsed) {
	this.callbacks["post-draw"] && this.callbacks["post-draw"](elapsed, this.context);
};












