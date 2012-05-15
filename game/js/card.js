Game.Card = OZ.Class();
Game.Card.prototype.init = function() {
	this._image = "";
	this._price = 0;
	this._name = "";
};
Game.Card.prototype.play = function(owner) {};
Game.Card.prototype.getImage = function()  { return this._image; };
Game.Card.prototype.getPrice = function()  { return this._price; };
Game.Card.prototype.getName = function()   { return this._name; };

Game.Card.Slot = OZ.Class().extend(Game.Card);
Game.Card.Slot.prototype.init = function(count) {
	Game.Card.prototype.init.call(this);
	this._count = count;
	this._image = "slot" + this._count;
	this._name = this._count + " Reels";
	this._price = this._count * 10000;
}
Game.Card.Slot.prototype.play = function(owner) {
	var cb = function(turns) { owner.moveBy(turns); }
	Game.Slot["roll" + this._count]().onDone(cb);
}

Game.Card.Move = OZ.Class().extend(Game.Card);
Game.Card.Move.prototype.init = function(count) {
	Game.Card.prototype.init.call(this);
	this._count = count;
	this._name = this._count + " Space" + (this._count > 1 ? "s" : "");
	this._image = "move" + this._count;
	this._price = (this._count > 3 ? 15000 : 10000);
}
Game.Card.Move.prototype.play = function(owner) {
	owner.moveBy(this._count);
}

Game.Card.OneTwo = OZ.Class().extend(Game.Card);
Game.Card.OneTwo.prototype.init = function(count) {
	Game.Card.prototype.init.call(this);
	this._name = "1 or 2";
	this._image = "onetwo";
	this._price = 10000;
}
Game.Card.OneTwo.prototype.play = function(owner) {
	var cb = function(turns) { owner.moveBy(turns); }
	Game.Slot.roll1(2).onDone(cb);
}

Game.Card.Conference = OZ.Class().extend(Game.Card);
Game.Card.Conference.prototype.init = function(count) {
	Game.Card.prototype.init.call(this);
	this._name = "Conference";
	this._image = "conference";
	this._price = 100000;
}
Game.Card.Conference.prototype.play = function(owner) {
	var index = owner.getIndex();

	for (var i=0;i<Game.players.length;i++) {
		var player = Game.players[i];
		if (player != owner) { player.setIndex(index); }
	}

	var cb = function() { owner.endTurn(); }
	var text = "You felt lonely, so you called all the other players to have a meeting!";
	new Game.Info(Game.Info.REPORTER, text).onDone(cb);
}

Game.Card.Zero = OZ.Class().extend(Game.Card);
Game.Card.Zero.prototype.init = function(count) {
	Game.Card.prototype.init.call(this);
	this._name = "Zero";
	this._image = "zero";
	this._price = 50000;
}
Game.Card.Zero.prototype.play = function(owner) {
	owner.setMoney(0);
	var cb = function() { owner.endTurn(); }
	var text = "%s, your account balance has been set to 0."	
	text = text.replace("%s", owner.getName());
	new Game.Info(Game.Info.REPORTER, text).onDone(cb);
}

Game.Card.Account = OZ.Class().extend(Game.Card);
Game.Card.Account.prototype.init = function(count) {
	Game.Card.prototype.init.call(this);
	this._name = "Account";
	this._image = "account";
	this._price = 100000;
}
Game.Card.Account.prototype.play = function(owner) {
	var total = 0;

	for (var i=0;i<Game.players.length;i++) {
		var player = Game.players[i];
		total += player.getMoney();
	}

	var money = Math.round(total/Game.players.length);
	for (var i=0;i<Game.players.length;i++) {
		var player = Game.players[i];
		player.setMoney(money);
	}

	var cb = function() { owner.endTurn(); }
	var text = "Account: The balance of your accounts has been fairly divided. Everybody now has " + Game.formatMoney(money) + ".";
	new Game.Info(Game.Info.REPORTER, text).onDone(cb);
}

Game.Card.Double = OZ.Class().extend(Game.Card);
Game.Card.Double.prototype.init = function(count) {
	Game.Card.prototype.init.call(this);
	this._name = "Double";
	this._image = "double";
	this._price = 75000;
}
Game.Card.Double.prototype.play = function(owner) {
	var cards = owner.getCards();
	var locked = [];
	for (var i=0;i<cards.length;i++) {
		var card = cards[i];
		if (card instanceof this.constructor) { locked.push(card); }
	}
	
	new Game.CardList(cards, {parent:null, keyboard:true, select:0})
		.lock(locked)
		.onDone(this._card.bind(this, owner));

}
Game.Card.Double.prototype._card = function(owner, card) {
	card.play(owner);
}
