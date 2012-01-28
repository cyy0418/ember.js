var get = Ember.get, getPath = Ember.getPath;

module("ember-views/views/container_view_test");

test("should be able to insert views after the DOM representation is created", function() {
  var container = Ember.ContainerView.create({
    classNameBindings: ['name'],

    name: 'foo'
  });

  Ember.run(function() {
    container.appendTo('#qunit-fixture');
  });

  var view = Ember.View.create({
    template: function() {
      return "This is my moment";
    }
  });

  Ember.run(function() {
    container.get('childViews').pushObject(view);
  });

  equal(container.$().text(), "This is my moment");

  container.destroy();
});

test("should be able to observe properties that contain child views", function() {
  var container;

  Ember.run(function() {
    container = Ember.ContainerView.create({
      childViews: ['displayView'],
      displayIsDisplayedBinding: 'displayView.isDisplayed',

      displayView: Ember.View.extend({
        isDisplayed: true
      })
    });

    container.appendTo('#qunit-fixture');
  });

  ok(container.get('displayIsDisplayed'), "can bind to child view");
});

test("should set the parentView property on views that are added to the child views array", function() {
  var container = Ember.ContainerView.create(),
      View = Ember.View.extend({
        template: function() {
          return "This is my moment";
        }
      }),
      view = View.create(),
      childViews = get(container, 'childViews');

  childViews.pushObject(view);
  equal(view.get('parentView'), container, "sets the parent view after the childView is appended");

  Ember.run(function() {
    childViews.removeObject(view);
  });
  equal(get(view, 'parentView'), null, "sets parentView to null when a view is removed");

  Ember.run(function() {
    container.appendTo('#qunit-fixture');
  });

  childViews.pushObject(view);
  equal(get(view, 'parentView'), container, "sets the parent view after the childView is appended");

  var secondView = View.create(),
      thirdView = View.create(),
      fourthView = View.create();

  childViews.pushObject(secondView);
  childViews.replace(1, 0, [thirdView, fourthView]);
  equal(get(secondView, 'parentView'), container, "sets the parent view of the second view");
  equal(get(thirdView, 'parentView'), container, "sets the parent view of the third view");
  equal(get(fourthView, 'parentView'), container, "sets the parent view of the fourth view");

  childViews.replace(2, 2);
  equal(get(view, 'parentView'), container, "doesn't change non-removed view");
  equal(get(thirdView, 'parentView'), container, "doesn't change non-removed view");
  equal(get(secondView, 'parentView'), null, "clears the parent view of the third view");
  equal(get(fourthView, 'parentView'), null, "clears the parent view of the fourth view");
});
