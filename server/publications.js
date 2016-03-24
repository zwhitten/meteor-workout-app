Meteor.publish('workouts', function (options) {
  check(options, {
    limit: Number,
    sorting: Number
  });

  var qry = {
    userId: this.userId
  };
  var qryOptions = {
    limit: options.limit,
    sort: {
      workoutAt: options.sorting
    }
  }

  return WorkoutsCollection.find(qry, qryOptions);
});

Meteor.publish("distanceByMonth", function(argument){
  var subsciption = this;
  var initiated = false;
  var distances = {};
  var userId = this.userId;

  var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
  var pipeline = [{$match: {userId: userId}},
    {
      $group: {
        _id: { $month: '$workoutAt'},
        distance: {$sum: '$distance'}
      }
    }
  ];

  db.collection('workouts').aggregate(
    pipeline,
    Meteor.bindEnvironment(
      function(err, result){
        console.log('result', result);
        _.each(result, function(r){
          subsciption.added('distanceByMonth', r._id, {distance: r.distance});
        })
      }
    )
  );

  var workoutHandle = WorkoutsCollection
    .find({userId: userId})
    .observeChanges({
      added: function(id, fields){
        if(!initiated) return;
        idByMonth = new Date(fields.workoutAt).getMonth()+1;
        distances[idByMonth] += fields.distance;
        subsciption.changed('distanceByMonth', idByMonth, { distance: distances[idByMonth]});
      }
    });
    initiated = true;
    subsciption.onStop(function(){
      workoutHandle.stop();
    });
    subsciption.ready();
});
