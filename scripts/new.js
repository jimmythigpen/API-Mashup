(function() {
  'use strict';

  //
  // Search Model
  //
  var AppModel = Backbone.Model.extend({
   defaults: {
     searchTerm: '',
     imageURL: '',
     imageLink: ''
   }
 });

  //
  // Flickr Collection
  //
  var FlickrCollection = Backbone.Collection.extend({
    initialize: function(collection, options){
        this.appModel = options.appModel;
      },

    url: function (){
     var searchTerm = this.appModel.get('searchTerm').replace(/ /g, '+');
     var base = "https://api.flickr.com/services/rest/?method=flickr.photos.search";
     var end = "&format=json&jsoncallback=?&extras=url_l&per_page=25";
     var key = "&api_key=7023d47c5cc453af6c2b5b45b5cf1bc4";
     return base + key + (searchTerm ? "&tags=" + searchTerm : "") + end;
   },

   parse: function(response) {
      return (response.photos.photo);
     }
  });

  //
  // Giphy Collection
  //
  var GiphyCollection = Backbone.Collection.extend({
    initialize: function(collection, options){
        this.appModel = options.appModel;
      },

      url: function (){
       var searchTerm = this.appModel.get('searchTerm').replace(/ /g, '+');
       var base = "http://api.giphy.com/v1/gifs/search?q=";
       var key = "&api_key=dc6zaTOxFJmzC";
       return base + (searchTerm ? searchTerm : "") + key;
     },

     parse: function(response) {
      //  console.log(response.data);
       return response.data;
       }
    });

  //
  //Index Page View
  //
  var IndexPageView = Backbone.View.extend({
    tagName: 'form',
    events: {
      "submit": "submitSearch"
    },

    submitSearch: function() {
      event.preventDefault();
      var searchText = $('input').val();
      var searchTerm = encodeURI(searchText);

      router.navigate("results/" + searchTerm, {
        trigger: true
      });
    },

    template: _.template($('[data-template-name=index]').text()),

    render: function() {
      this.$el.html(this.template());
      return this;
    }

  });

  //
  // Results Page Flickr View
  //
  var ResultsPageView = Backbone.View.extend({
    tagName: 'div class="column size-1of2"',
    events: {
      "click": "showImage"
    },

  initialize: function(){
    this.listenTo(this.collection, 'sync', this.render);
  },

  template: _.template($('[data-template-name=results]').text()),

  render: function() {
    var self = this;
    this.collection.each(function(image){
      if (image.get('url_l') !== undefined){
       self.$el.append('<div>' + '<a href=' + image.get('url_l') + '>' + '<img src=' + image.get('url_l') + '/>' + '</a>' + '</div>');
       }
     });
    },

  showImage: function() {
    event.preventDefault();
    var selectedURL = $('div').val();

    router.navigate("selected" + selectedURL, {
      trigger: true
    });
  },

  templateSelected: _.template($('[data-template-name=selected]').text()),

  renderSelected: function() {
    this.$el.html(this.template());
    return this;
  }

  });
  //
  // Results Page Giphy View
  //
  var ResultsPageView2 = Backbone.View.extend({
    tagName: 'div class="column size-1of2"',
    events: {
      "click": "showImage"
    },

  initialize: function(){
    this.listenTo(this.collection, 'sync', this.render);
  },

  template: _.template($('[data-template-name=results]').text()),

  render: function() {
    var self = this;
    this.collection.each(function(image){
      // console.log(_.pluck(image.get('images'), 'url')[12]);
      if (_.pluck(image.get('images'), 'url')[12] !== undefined){
      //  self.$el.append('<div>' + '<img src=' + _.pluck(image.get('images'), 'url')[12] + '>' + '</div>');
       self.$el.append('<div>' + '<a href=' + _.pluck(image.get('images'), 'url')[12] + '>' + '<img src=' + _.pluck(image.get('images'), 'url')[12] + '>' + '</a>' + '</div>');
       }
    });
  },

  });
  //
  // Selected Page View
  //
  var SelectedPageView = Backbone.View.extend({

  });

  //
  // Router
  //
  var AppRouter = Backbone.Router.extend({
    routes: {
      "": "index",
      "results/:search": "results",
      "selected": "selected"
    },

    initialize: function() {
      this.appModel = new AppModel();
      this.flickr = new FlickrCollection([], {appModel: this.appModel});
      this.giphy = new GiphyCollection([], {appModel: this.appModel});
      this.indexPage = new IndexPageView();
      this.results = new ResultsPageView({collection: this.flickr});
      this.results2 = new ResultsPageView2({collection: this.giphy});
    },

    index: function() {
      this.indexPage.render();
      $('#app').html(this.indexPage.el);
    },

    results: function(search) {
      this.results.render();
      this.results2.render();
      $('#app').html(this.results.el);
      $('#app').append(this.results2.el);
      this.appModel.set('searchTerm', search);
      this.flickr.fetch();
      this.giphy.fetch();
    }

  });

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });


})();
