window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function StorageManager(){
  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

StorageManager.prototype.getSavedScores = function(){
  var saved = JSON.parse(this.storage.getItem('savedScores'));
  return saved != null ? saved : {};
}

StorageManager.prototype.getPuzzlesBest = function(seed){
   var saved = this.getSavedScores();
  return saved[seed] != null ? saved[seed] : null;
}

StorageManager.prototype.setPuzzlesBest = function(seed, score){
  var saved = this.getSavedScores();
  saved[seed] = score;
  this.storage.setItem('savedScores', JSON.stringify(saved));
}

StorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};
