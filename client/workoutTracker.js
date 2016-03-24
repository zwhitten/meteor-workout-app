//Meteor.subscribe("workouts");
Session.setDefault('limit', 10);
Session.setDefault('sorting',-1);

DistanceByMonth = new Mongo.Collection('distanceByMonth');
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

Template.addWorkout.events({
  'submit form': function(evt, tpl){
    evt.preventDefault();

    var distance = parseInt(tpl.$('input[name="distance"]').val());
    Meteor.call('CreateWorkout', {
      distance: distance
    }, function(error, result){
      if(error) return alert('Error: '+error.error);
    });
  }
});

monthLabels = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'Mai',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
};

Template.distanceByMonth.helpers({
  month: function () {
    return DistanceByMonth.find({}, {
      sort: {
        _id: 1
      }
    });
  },
  translateMonth: function () {
    return monthLabels[this._id];
  }
});
