var dauQuery = function(){
    //placeholders for graph
    var DAUs = {}
    var dauData ={}
    //set params for JQL query
    var today = Math.round(new Date().getTime())
      var date = new Date().toISOString().split('T')[0]

      var d = new Date();
      d.setMonth(d.getMonth() - 1);
      var aMonthAgo = new Date(d).toISOString().split("T")[0]
      params = {
        "startDate":aMonthAgo,
        "endDate": date
      }
    MP.api.jql(
      function main() {
        return Events({
          from_date: params.startDate,
          to_date: params.endDate
        })
        // group each user's events by the day they were triggered,
        // and count how many events they sent each day
        .groupByUser([function(event) {
          return new Date(event.time).toISOString().substr(0, 10);
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
      var dauToday = results.length - 1
      dauToday = results[dauToday].value
      $('#dau-header').text(addCommas(dauToday));

      _.each(results, function(value, key){
        DAUs[value.key[0]] = value.value
      })
     dauData.DAUs = DAUs

    var mdauChart = $('#dau-chart').MPChart({chartType: 'line', highchartsOptions: {  // Create a line chart
      legend: {
        enabled: true,
        y:-7
      },
    }});
    mdauChart.MPChart('setData', dauData); // Set the chart's data
      $("#dau-chart-header").show()           //display chart header
    })

    setTimeout(dauQuery,3600000)
}
dauQuery();
