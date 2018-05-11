queue()
    .defer(d3.csv, "data/CorkCityPlanningApplications_2008-2018.csv")
    .await(makeCharts);

function makeCharts(error, corkPlanningData) {

    let ndx = crossfilter(corkPlanningData);
    
    show_one_off_houses(ndx);
    
    dc.renderAll();
}

function show_one_off_houses(ndx){
    var houseDim = ndx.dimension(dc.pluck("OneOffHouse"))
    var group = houseDim.group();
    
    dc.barChart("#one-off-houses")
        .width(350)
        .height(250)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(houseDim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Gender")
        .yAxis().ticks(20);
}