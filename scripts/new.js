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
  var imageResult = Backbone.Model.extend({});

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

   model: imageResult,

   parse: function(response) {
        console.log(response);
       return response.photos;
     }
  });

  //
  // Giphy Collection
  //
  var GiphyCollection = Backbone.Collection.extend({
    model: imageResult


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

  //   render: function(){
  //   this.$el.html(this.template());
  //   var self = this;
  //    this.collection.each(function(listing){
  //      self.$el.html('<div>' + listing.get('url_l') + '</div>');
  //    });
  //  },

  render: function() {
    this.$el.html(this.template());
    return this;
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
      "selected": "selected",
      "results/:search": "results"
    },

    initialize: function() {
      this.appModel = new AppModel();
      this.flickr = new FlickrCollection([], {appModel: this.appModel});
      this.indexPage = new IndexPageView({collection: this.flickr});
      this.results = new ResultsPageView({collection: this.indexPage});
    },

    index: function() {
      this.indexPage.render();
      $('#app').html(this.indexPage.el);
    },

    results: function(term) {
      this.results.render();
      $('#app').html(this.results.el);
      this.appModel.set('searchTerm', term);
      this.flickr.fetch();
      console.log(this.flickr.url());

    }

  });

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });


})();
