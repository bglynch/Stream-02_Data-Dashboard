queue()
    .defer(d3.csv, "data/CorkCityPlanningApplications_2008-2018.csv")
    .await(makeCharts);

function makeCharts(error, corkPlanningData) {

    let ndx = crossfilter(corkPlanningData);

    let parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

    // Add new column to dataset for Day of Week Received
    corkPlanningData.forEach(function(d) {
        d.ReceivedDate = parseDate(d.ReceivedDate); // string to date
        d.ReceivedDateDay = d.ReceivedDate.getDay(); // date to day. makes new column in array
        //console.log(d.ReceivedDate);
        //console.log(d.ReceivedDateDay);
    });

    // Add new column to dataset for Change of Use Application


    //console.log(corkPlanningData);
    //console.log(typeof(corkPlanningData[0].DecisionDueDate));

    show_one_off_houses(ndx);
    application_type(ndx);
    show_application_by_day(ndx);
    show_application_over_time(ndx);

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
    var dayDim = ndx.dimension(function(d) {
        if (d.ReceivedDateDay == 1) {
            return "1.Monday";
        }
        else if (d.ReceivedDateDay == 2) {
            return "2.Tuesday";
        }
        else if (d.ReceivedDateDay == 3) {
            return "3.Wednesday";
        }
        else if (d.ReceivedDateDay == 4) {
            return "4.Thursday";
        }
        else if (d.ReceivedDateDay == 5) {
            return "5.Friday";
        }
    });

    var dayGroup = dayDim.group();

    dc.barChart("#application-by-day")
        .width(550)
        .height(250)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dayDim)
        .group(dayGroup)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Day Application Received")
        .margins({ top: 10, right: 50, bottom: 50, left: 150 })
        .yAxis().ticks(20);
}

function show_application_over_time(ndx) {
    var dateDim = ndx.dimension(dc.pluck("ReceivedDate"));
    var dateGroup = dateDim.group();

    var minDate = dateDim.bottom(1)[0].ReceivedDate;
    var maxDate = dateDim.top(1)[0].ReceivedDate;

    dc.lineChart("#applications-over-time")
        .width(1400)
        .height(300)
        .dimension(dateDim)
        .group(dateGroup)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xAxisLabel("Applications")
        .margins({ top: 10, right: 50, bottom: 50, left: 150 });
}
