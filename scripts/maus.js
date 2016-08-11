
var mauQuery = function(){
  var today = new Date().toISOString().split('T')[0]

  var a = new Date();
  var sixMonths = new Date(a.getFullYear(), a.getMonth()-5, 1).toISOString().split('T')[0];
  params = {
    "startDate":sixMonths,
    "endDate": today
  }
  MP.api.jql(
    function main() {
      return Events({
        from_date: params.startDate,
        to_date: params.endDate
      })
      // group each user's events by the day they were triggered,
      // and count how many events they sent each day
      .groupByUser([function (event) {
        return new Date(event.time).toISOString().substr(0, 7);
      }], function(count, events) {
        count = count || 0;
        return count + events.length;
      })
      //filter out days where a user sent < 2 events
      .filter(function(user_count) {
        return user_count.value >= 2;
      })
      .groupBy(["key.1"], mixpanel.reducer.count());
    },
  params).done(function(results) {

    //get the last value in the results so you have the value of this months MAU's
    var thisMonthIndex = results.length - 1
    $('#mau-header').text(addCommas(results[thisMonthIndex].value));

    //transform data so that we can graph it month over month
    //placeholders for graph
    var MAUs = {}
    var mauData ={}
    _.each(results, function(value, key){
        MAUs[value.key[0]] = value.value
      })
     mauData.MAUs = MAUs

    var mauChart = $('#mau-chart').MPChart({chartType: 'line', highchartsOptions: {
      legend: {
        enabled: true,
        y: -7
      }
    }});                                // Create a line chart
    mauChart.MPChart('setData', mauData); // Set the chart's data
    $('#mau-chart-header').show()        //display chart header
  })
}
mauQuery()
