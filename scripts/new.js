(function() {
  'use strict';

  //
  // Search Model
  //
  var AppModel = Backbone.Model.extend({
   defaults: {
     searchTerm: ''
   }
 });

  //
  // Image Model
  //
  var ImageModel = Backbone.Model.extend({
    defaults: {
      flickrURL: ''
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
     var end = "&format=json&jsoncallback=?&extras=url_l";
     var key = "&api_key=7023d47c5cc453af6c2b5b45b5cf1bc4";
     return base + key + (searchTerm ? "&tags=" + searchTerm : "") + end;

   },

   model: ImageModel,

   parse: function(response) {
      return _.pluck(response.photos.photo, 'url_l');
     }
  });

  //
  // Giphy Collection
  //
  var GiphyCollection = Backbone.Collection.extend({
    model: ImageModel


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
  // Results Page View
  //
  var ResultsPageView = Backbone.View.extend({
    tagName: 'div',
    events: {
      "click": "showImage"
    },

  initialize: function(){
    this.listenTo(this.collection, 'sync', this.render);
    console.log(this.collection);
  },

  template: _.template($('[data-template-name=results]').text()),

  render: function() {
    var self = this;
       this.collection.each(function(image){
         self.$el.html('<div>' + image.get('url_l') + '</div>');
       });
     },
     // return this

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
      "selected": "selected",
      "results/:search": "results"
    },

    initialize: function() {
      this.appModel = new AppModel();
      this.imageModel = new ImageModel();
      this.flickr = new FlickrCollection([], {appModel: this.appModel});
      this.indexPage = new IndexPageView();
      this.results = new ResultsPageView({collection: this.indexPage});
      // console.log(this.results);
    },

    index: function() {
      this.indexPage.render();
      $('#app').html(this.indexPage.el);
    },

    results: function(term, url) {
      this.results.render();
      $('#app').html(this.results.el);
      this.appModel.set('searchTerm', term);
      this.flickr.fetch();
      // console.log(this.flickr.url());
      this.imageModel.set('flickrURL', url);

    }

  });

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });


})();
