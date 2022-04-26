const existingCharge = 50;
const breathingCharge = 25;
const scamazonCharge = 100;
const tax = 0.0825;
const hiddenFee = 50;

module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.itemsPrice = oldCart.itemsPrice || 0;

	this.add = function(item, id) {
		var storedItem = this.items[id];
		if (!storedItem) {
			storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
		}
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.itemsPrice += storedItem.item.price;
	};

	this.decrease = function(item, id) {
		var storedItem = this.items[id];
		if (!storedItem) {
			storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
		}
		storedItem.qty--;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty--;
		this.itemsPrice -= storedItem.item.price;
	};

	this.remove = function(id) {
		var removeItem = this.items[id];
		this.totalQty -= removeItem.qty;
		this.itemsPrice -= removeItem.price;
		delete this.items[id];
	};

	this.feesTotal = function() {
		var additionalFees = existingCharge + breathingCharge + scamazonCharge + hiddenFee;
		return additionalFees;
	};

	this.generateTotal = function() {
		var totalCost =
			this.itemsPrice + this.itemsPrice * tax + existingCharge + breathingCharge + scamazonCharge + hiddenFee;
		return totalCost;
	};

	this.generateArray = function() {
		var arr = [];
		for (var id in this.items) {
			if (this.items[id].qty > 0) {
				arr.push(this.items[id]);
			}
		}
		return arr;
	};
};
