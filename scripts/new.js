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
  var imageResult = Backbone.Model.extend({
    defaults: {
     urlData: ''
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

   model: imageResult,

   parse: function(response) {
        console.log(response);
       return response.photos;

     }


  });



  //
  // Etsy Collection
  //
  var EtsyCollection = Backbone.Collection.extend({
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
      "results": "results",
      "selected": "selected",
      "results/:search": "results"
    },

    initialize: function() {
      this.appModel = new AppModel();
      this.indexPage = new IndexPageView({collection: this.listings});
      this.flickr = new FlickrCollection([], {appModel: this.appModel});
    },

    index: function() {
      this.indexPage.render();
      $('#app').append(this.indexPage.el);
    },

    results: function(term) {
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
