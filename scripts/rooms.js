var params = {
    from: moment().subtract(30, 'days'),    // the earliest date you'd like to include in the query
    to: moment(),                           // the latest date you'd like to include in the query
    limit: 100,                             // maximum number of results to return
    type: 'general',                        // analysis type for the data, can be 'general', 'unique', or 'average'
    unit: 'day'                            // level of granularity of the data, can be 'minute', 'hour', 'day', or 'month'

    // // the following are undefined by default
    // 'where': 'properties["age"] == 21',     // an expression to filter by. See event filters
    // 'method': 'average',                    // string specifying a way to aggregate the results, can be 'numeric', 'sum', or 'average'
    // 'buckets': 4,                           // the number of buckets to return in a 'numeric' query
};

MP.api.segment('Start Call', params).done(function(roomsResults) {
    console.log(roomsResults.values());
    var data = roomsResults.values()
    var today = moment().format('YYYY-MM-DD')
  	var todaysRooms = data['Start Call'][today]
    console.log("rooms header", todaysRooms);
  	$('#dau-header').text(addCommas(todaysRooms));


    var roomsChart = $('#rooms-chart').MPChart({chartType: 'line', highchartsOptions: {
      legend: {
        enabled: true,
        y: -7
      }
    }});                                // Create a line chart
    roomsChart.MPChart('setData', roomsResults.values()); // Set the chart's data
    $('#rooms-header').show()
    $('#rooms-chart').show()
});
MP.api.segment('Room Locked', params).done(function(lockedRoomsResults) {
    console.log(lockedRoomsResults.values());
    var data = lockedRoomsResults.values()
    var today = moment().format('YYYY-MM-DD')
  	var todaysRooms = data['Room Locked'][today]
    console.log("rooms header", todaysRooms);
  	$('#revenue-header').text(addCommas(todaysRooms));
    var lockedRoomsChart = $('#locked-rooms-chart').MPChart({chartType: 'line', highchartsOptions: {
      legend: {
        enabled: true,
        y: -7
      }
    }});                                // Create a line chart
    lockedRoomsChart.MPChart('setData', lockedRoomsResults.values()); // Set the chart's data
    $('#locked-rooms-header').show()
    $('#locked-rooms-chart').show()
});

//get the average transfer amount
var avgparams = {
    from: moment().subtract(30, 'days'),    // the earliest date you'd like to include in the query
    to: moment(),                           // the latest date you'd like to include in the query
    limit: 100,                             // maximum number of results to return
    type: 'general',                        // analysis type for the data, can be 'general', 'unique', or 'average'
    unit: 'day',                            // level of granularity of the data, can be 'minute', 'hour', 'day', or 'month'
    'on': 'number(properties["Duration (sec)"])', 	// selector
    'method': 'average'

};
var minParams = {
    from: moment().subtract(30, 'days'),    // the earliest date you'd like to include in the query
    to: moment(),                           // the latest date you'd like to include in the query
    limit: 100,                             // maximum number of results to return
    type: 'general',                        // analysis type for the data, can be 'general', 'unique', or 'average'
    unit: 'day',                            // level of granularity of the data, can be 'minute', 'hour', 'day', or 'month'
    'on': 'number(properties["# of Users"])', 	// selector
    'method': 'min'

};
var maxParams = {
    from: moment().subtract(30, 'days'),    // the earliest date you'd like to include in the query
    to: moment(),                           // the latest date you'd like to include in the query
    limit: 100,                             // maximum number of results to return
    type: 'general',                        // analysis type for the data, can be 'general', 'unique', or 'average'
    unit: 'day',                            // level of granularity of the data, can be 'minute', 'hour', 'day', or 'month'
    'on': 'number(properties["Invite User Count"])', 	// selector
    'method': 'max'

};

var transferData = {}
//get averages
MP.api.segment('Room Activity Summary', avgparams).done(function(avgTransferResults) {
	//get max
	MP.api.segment('Room Activity Summary', minParams).done(function(minTransferResults) {
		//get min
		console.log('min trans', minTransferResults.values())
		MP.api.segment('Room Activity Summary', maxParams).done(function(maxTransferResults) {


      console.log('max trans', maxTransferResults.values())
			var transferData  = {}
			//combine data for graphing
			transferData['Avg Invites'] = maxTransferResults.values()
			transferData['Avg # Of Users'] = minTransferResults.values()
			transferData['Avg Room Duration'] = avgTransferResults.values()
			var transferAmountChart = $('#summary-chart').MPChart({chartType: 'line', highchartsOptions: {  // Create a line chart
		      legend: {
		        enabled: false,
		        y:-15
		      }
		    }});
		 $("#summary-header").show()           //display chart header
		 transferAmountChart.MPChart('setData', transferData); // Set the chart's data
		})
	})
})
