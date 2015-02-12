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
  var ImageResult = Backbone.Model.extend({
    defaults: {
     urlData: ''
   }
  });


  //
  // Flickr Collection
  //
  var FlickrCollection = Backbone.Collection.extend({
    model: ImageResult

  });

  //
  // Etsy Collection
  //
  var EtsyCollection = Backbone.Collection.extend({
    model: ImageResult,


  });

  //
  //Index Page View
  //
  var IndexPageView = Backbone.View.extend({
    el: 'form',
    events: {
      "submit": "submitSearch"
    },

    submitSearch: function() {
      event.preventDefault();
      var searchTerm = $('input').val();
      console.log(searchTerm);

      router.navigate("results/" + searchTerm, {
        trigger: true
      });
    },

    template: _.template($('[data-template-name=index').text()),

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
      "submit": "selectImage"
    },

    displayResults: function() {
      event.preventDefault();

    },

    template: _.template($('[data-template-name=results').text()),

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
  //
  // Selected Page View
  //
  var SelectedPageView = Backbone.View.extend({

    selectedPage: function() {

    }
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
      this.searchView = new IndexPageView({
        collection: this.images
      });
      this.resultsView = new ResultsPageView({
        collection: this.images
      });
      this.selectedView = new SelectedPageView({
        collection: this.images
      });

    },

    index: function() {
      this.searchView.render();
      $('#app').append(this.searchView.el);
      this.selectedView.render();
      $('#app').append(this.selectedView.el);
    },

    results: function() {
      this.resultsView.render();
      $('#app').append(this.resultsView.el);

    },

  });

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });


})();
