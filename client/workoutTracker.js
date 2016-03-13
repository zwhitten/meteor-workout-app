//Meteor.subscribe("workouts");
Session.setDefault('limit', 10);
Session.setDefault('sorting',-1);
//Subscriptions
Tracker.autorun(function(computation){
  Meteor.subscribe('workouts', {
    limit: Session.get('limit'),
    sorting: Session.get('sorting')
  });
});

Template.workoutList.helpers({
  workouts: function() {
    return WorkoutsCollection.find({}, {
      sort: {
        workoutAt: -1
      }
    });
  }
});

Template.workoutList.events({
  'click button.show-more': function(evt, tpl){
    var newLimit = Session.get('limit') + 10;
    Session.set('limit', newLimit);
  },
  'click button.sort-direction': function(evt, tpl){
    var newSort = Session.get('sorting')*-1;
    Session.set('sorting', newSort);
  }

});
