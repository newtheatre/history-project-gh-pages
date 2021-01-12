// Imports
var SearchWorker, getJSON;

importScripts('/lib/lunr.js/lunr.min.js');

// Functions
getJSON = function(url, successHandler, errorHandler) {
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    if (xhr.status) {
      return successHandler && successHandler(xhr.response);
    } else {
      return errorHandler && errorHandler(xhr.status);
    }
  };
  return xhr.send();
};

// SearchWorker class
SearchWorker = class SearchWorker {
  constructor(opts) {
    this.indexUrl = opts.indexUrl;
    this.dataUrl = opts.dataUrl;
    this.searchIndex = null;
    this.dataIndex = null;
    this.dataReverseIndex = null;
    this.loadIndex();
    this.loadData();
  }

  loadIndex() {
    return getJSON(this.indexUrl, (data) => {
      return this.processIndex(data);
    }, this.fail);
  }

  loadData() {
    return getJSON(this.dataUrl, (data) => {
      return this.processData(data);
    }, this.fail);
  }

  processIndex(data) {
    this.searchIndex = lunr.Index.load(data);
    return this.ready();
  }

  processData(data) {
    var i, item, len;
    this.dataIndex = data;
    this.dataReverseIndex = new Object();
    for (i = 0, len = data.length; i < len; i++) {
      item = data[i];
      this.dataReverseIndex[item.url] = item;
    }
    return this.ready();
  }

  ready() {
    // Two concurent operations, only fire when both ready
    if ((this.searchIndex != null) && (this.dataReverseIndex != null)) {
      return self.postMessage({
        cmd: 'ready'
      });
    }
  }

  fail(status) {
    return console.log(`SearchWorker load error: ${status}`);
  }

  search(query) {
    var dataResults, i, indexResults, ir, len;
    indexResults = this.searchIndex.search(query);
    // Map index results to data results
    dataResults = Array();
    for (i = 0, len = indexResults.length; i < len; i++) {
      ir = indexResults[i];
      dataResults.push(this.dataReverseIndex[ir.ref]);
    }
    // Sort the results array
    dataResults.sort(function(a, b) {
      a = `${a.surname} ${a.forename}`.toLowerCase();
      b = `${b.surname} ${b.forename}`.toLowerCase();
      return +(a > b) || +(a === b) - 1;
    });
    return {
      cmd: 'results',
      results: dataResults
    };
  }

};

// Define worker pointer
self.searchWorker = null;

// Worker bindings
self.addEventListener('message', function(e) {
  var data, results;
  data = e.data;
  switch (data.cmd) {
    case 'init':
      return self.searchWorker = new SearchWorker({
        indexUrl: data.indexUrl,
        dataUrl: data.dataUrl
      });
    case 'search':
      results = self.searchWorker.search(data.query);
      return self.postMessage(results);
    case 'stop':
      delete self.searchWorker;
      return self.close();
  }
});

//# sourceMappingURL=search_worker.js.map
