Game.Finish = OZ.Class().extend(HAF.Actor).implement(Game.IInputHandler).implement(Game.IAsync);
Game.Finish.prototype.init = function(player) {
	this._cb = {done:null, abort:null};
	
	this._size = [480, 360];
	this._bg = HAF.Sprite.get("img/finish/capitals/prague.png", [480, 240], 0, true);

	var layer = Game.engine.getLayer(Game.LAYER_WIN);
	Game.engine.setSize(this._size, Game.LAYER_WIN);
	
	var border = 8;
	this._size[0] += 2*border;
	this._size[1] += 2*border;
	
	var parent = OZ.DOM.elm("div", {position:"absolute", width:this._size[0]+"px", height:this._size[1]+"px"});
	layer.parentNode.appendChild(parent);
	parent.appendChild(layer);
	
	parent.style.left = (Game.port.getSize()[0] - this._size[0])/2 + "px";
	parent.style.top = (Game.port.getSize()[1] - this._size[1])/2 + "px";
	layer.style.left = border + "px";
	layer.style.top = border + "px";
	
	new Game.Border(parent);
	
	Game.engine.addActor(this, Game.LAYER_WIN);
	this._sprites = [];
	var sprites = [
/*		{
			name: "main",
			size: [480, 360],
			pos: [0, 0],
			frames: 1
		}, */
		{
			name: "debug",
			size: [480, 360],
			pos: [0, 0],
			frames: 1
		}, 
		{
			name: "DUO",
			size: [64, 66],
			pos: [339, 221],
			frames: 12
		},
		{
			name: "FL",
			size: [50, 81],
			pos: [130, 206],
			frames: 9
		},
		{
			name: "GE",
			size: [29, 69],
			pos: [25, 214],
			frames: 15
		},
		{
			name: "HA",
			size: [48, 104],
			pos: [79, 182],
			frames: 12
		},
		{
			name: "JZ",
			size: [34, 93],
			pos: [180, 189],
			frames: 11
		},
		{
			name: "PA",
			size: [69, 34],
			pos: [405, 175],
			frames: 12
		},



		{
			name: "BAL",
			size: [78, 80],
			pos: [175, 280],
			frames: 12
		},
		{
			name: "FR",
			size: [37, 64],
			pos: [78, 296],
			frames: 10
		},
		{
			name: "HUT",
			size: [54, 56],
			pos: [269, 304],
			frames: 12
		}

	];
	for (var i=0;i<sprites.length;i++) {
		var def = sprites[i];
		var path = "img/finish/" + (def.frames == 1 ? "static" : "sprites") + "/" + def.name + ".png";
		var size = [def.size[0], def.size[1]*def.frames];
		var image = HAF.Sprite.get(path, size, 0, true);
		image.getContext("2d").globalAlpha = 0.5;
		def.pos[0] += def.size[0]/2
		def.pos[1] += def.size[1]/2;
		
		var sprite = (def.frames == 1 ? new HAF.Sprite(image, def.size) : new HAF.AnimatedSprite(image, def.size, {frames:def.frames}));

		sprite.setPosition(def.pos);
		this._sprites.push(sprite);
		Game.engine.addActor(sprite, Game.LAYER_WIN);
	}

	Game.keyboard.push(this);
	this._eventActivate = OZ.Touch.onActivate(layer, this._activate.bind(this));
	window.s = this._sprites;
}

Game.Finish.prototype.tick = function(dt) {
	return true;
}

Game.Finish.prototype.draw = function(ctx) {
//	ctx.drawImage(this._bg, 0, 0);
}

Game.Finish.prototype.handleInput = function(type, param) {
	switch (type) {
		case Game.INPUT_ENTER:
		case Game.INPUT_ESC:
			this._finish();
		break;
		default:
			return false;
		break;
	}
	return true;
}

Game.Finish.prototype._finish = function() {
	Game.keyboard.pop();
	
	Game.engine.removeActor(this, Game.LAYER_WIN);
	while (this._sprites.length) { Game.engine.removeActor(this._sprites.shift(), Game.LAYER_WIN); }
	
	Game.engine.setSize([0, 0], Game.LAYER_WIN);

	var layer = Game.engine.getLayer(Game.LAYER_WIN);
	var parent = layer.parentNode;
	parent.parentNode.appendChild(layer);
	parent.parentNode.removeChild(parent);

	if (this._cb.done) { this._cb.done(); }
}

Game.Finish.prototype._activate = function(e) {
	OZ.Event.stop(e);
	this.handleInput(Game.INPUT_ENTER);
}