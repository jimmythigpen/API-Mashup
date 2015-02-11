(function() {
  'use strict';
  //
  // Model
  //
  var Images = Backbone.Model.extend({

  });

  //
  // Collection
  //
  var ImagesCollection = Backbone.Collection.extend({
    model: Images
  });

  //
  //Index Page View
  //
  var IndexPageView = Backbone.View.extend({
    tagName: 'form',
    events: {
      "submit": "indexPage"
    },

    indexPage: function() {
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
      // "results/:search": "results"
    },

    initialize: function() {
      this.images = new ImagesCollection([{
        url: "images/unititled-1.jpg"
      }, {
        url: "images/unititled-2.jpg"
      }, {
        url: "images/unititled-3.jpg"
      }, {
        url: "images/unititled-4.jpg"
      }, {
        url: "images/unititled-5.jpg"
      }, {
        url: "images/unititled-6.jpg"
      }, {
        url: "images/unititled-7.jpg"
      }, {
        url: "images/unititled-8.jpg"
      }, {
        url: "images/unititled-9.jpg"
      }, {
        url: "images/unititled-10.jpg"
      }]);
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
      this.resultsView.render();
      $('#app').append(this.resultsView.el);
      this.selectedView.render();
      $('#app').append(this.selectedView.el);
    },

  });

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });


})();