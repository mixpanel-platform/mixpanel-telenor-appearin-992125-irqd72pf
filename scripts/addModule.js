var data1 = {
  'segment1': {
        '2010-09-01': 10,
        '2010-09-02': 11,
        '2010-09-03': 8
    },
    'segment2': {
        '2010-09-01': 1,
        '2010-09-02': 18,
        '2010-09-03': 17
    },
    'segment3': {
        '2010-09-01': 32,
        '2010-09-02': 37,
        '2010-09-03': 30
    }
};
var data2 = {
  'segment1': {
        '2010-09-01': 10,
        '2010-09-02': 11,
        '2010-09-03': 8
    },
    'segment2': {
        '2010-09-01': 1,
        '2010-09-02': 18,
        '2010-09-03': 17
    }
};
var chart
$("#add-module").on('click', function(){
  console.log("loggin chart number right after click", numOfChart);
  //creat the dive for the
  chart = $('<div id="chart'+numOfChart+'" style="margin-top: 10px;"></div>').appendTo('#modular-graphs').MPChart({chartType: 'line', highchartsOptions: {  //create a line chart
    legend: {
      enabled: false,
      y: -7
    }
  }});
  //add a header to each chart
  $('<h4 class="text-center  text-muted" style="margin: 40px 0px 20px 0px;"><u>Some Header</u></h4>').insertBefore("#chart"+numOfChart).text("are you switching out?").css('text-decoration', 'underline')
  chart.MPChart('setData', data2);
  console.log("chart number - " + numOfChart + "- added");
  console.log(chart)
  numOfChart ++ //increment up count of charts so we can keep adding and appending charts
})
