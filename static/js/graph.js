queue()
    .defer(d3.csv, "data/CorkCityPlanningApplications_2008-2018.csv")
    .await(makeCharts);

function makeCharts(error, corkPlanningData) {

    let ndx = crossfilter(corkPlanningData);

    let parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

    corkPlanningData.forEach(function(d) {
        d.ReceivedDate = parseDate(d.ReceivedDate); // string to date
        d.ReceivedDateDay = d.ReceivedDate.getDay(); // date to day
        //console.log(d.ReceivedDate);
        //console.log(d.ReceivedDate.getDay());
    });
    console.log(corkPlanningData);

    //console.log(corkPlanningData);
    // console.log(typeof(corkPlanningData[0].DecisionDueDate));



    show_one_off_houses(ndx);
    application_type(ndx);
    show_application_by_day(ndx);

    dc.renderAll();
}

function show_one_off_houses(ndx) {
    var houseDim = ndx.dimension(dc.pluck("OneOffHouse"))
    var group = houseDim.group();

    dc.barChart("#one-off-houses")
        .width(350)
        .height(250)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(houseDim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("One Off Houses")
        .yAxis().ticks(20);
}

function application_type(ndx) {
    var dim = ndx.dimension(dc.pluck("ApplicationType"))
    var group = dim.group();

    dc.barChart("#application-type")
        .width(900)
        .height(450)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Application Type")
        .yAxis().ticks(20);
}

function show_application_by_day(ndx) {

    //var dateToDay = ReceivedDate.getDay();
   // var dayDim = ndx.dimension(dc.pluck("ReceivedDateDay"));
    var dayDim = ndx.dimension(function(d){
        if (d.ReceivedDateDay == 1){
            return "Monday"
        }else if (d.ReceivedDateDay == 2){
            return "Tuesday"
        }else if (d.ReceivedDateDay == 3){
            return "Wednesday"
        }else if (d.ReceivedDateDay == 4){
            return "Thursday"
        }else{
        return "Friday"
        }
    })
    
    console.log(dayDim);
    var dayGroup = dayDim.group();

    dc.barChart("#application-by-day")
        .width(350)
        .height(250)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dayDim)
        .group(dayGroup)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Day Application Received")
        .yAxis().ticks(20);
        


}
