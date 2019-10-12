function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(`/metadata/${sample}`).then((data) => {
      console.log(data);
      var selector=d3.select('#sample-metadata');
      selector.html("");
      Object.entries(data).forEach(([key, value])  => {
        console.log(key,value);
        selector.append("h6").text(`${key}: ${value}`);

      }
        
      );
      
      });

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/"+sample).then(function(response){
  
    console.log("sample returned data")
    console.log(response)
    var scatter_description = response['otu_labels'];
    console.log("logging scatter_description list")
    console.log(scatter_description.slice(0,10))
    // var scatter_description=[];
    // for(var i=0;i<response[0].otu_ids.length;i++){
    //     scatter_description.push(descriptions[response[0].otu_ids[i]]);
    // }
    // @TODO: Build a Bubble Chart using the sample data
    
      var trace1 = {
          x: response['otu_ids'],
          y: response['sample_values'],
          marker: {
              size: response['sample_values'],
              color: response['otu_ids'].map(d=>100+d*20),
              colorscale: "Earth"
          },
          type:"scatter",
          mode:"markers",
          text: scatter_description,
          hoverinfo: 'x+y+text',
      };
      console.log("trace1" + trace1)
      var data = [trace1];
      console.log(data)
      var layout = {
          xaxis:{title:"OTU ID",zeroline:true, hoverformat: '.2r'},
          yaxis:{title: "# of germs in Sample",zeroline:true, hoverformat: '.2r'},
          height: 500,
          width:1200,
          margin: {
              l: 100,
              r: 10,
              b: 70,
              t: 10,
              pad: 5
            },
          hovermode: 'closest',
      };
      console.log(layout)
      console.log("starting scatter plot/bubble chart")
      Plotly.newPlot("bubble",data,layout);
      
    // @TODO: Build a Pie Chart
    var pielabels=response['otu_ids'].slice(0,11);
    var pievalues=response['sample_values'].slice(0,11);
    var piedescription=response['otu_labels'].slice(0,11);

    console.log("pielabels " + pielabels) ;
    console.log("pievalues " + pievalues) ;
    console.log("piedescription " + piedescription)   ; 
    var trace1 = { 
        values: pievalues,
        labels: pielabels,
        type:"pie",
        name:"Top 10 Samples",
        textinfo:"percent",
        text: piedescription,
        textposition: "inside",
        hoverinfo: 'label+value+text+percent'
    }
    var data=[trace1];
    var layout={
        title: "<b>Top 10 Samples: " + sample + "</b>",
        width:750,
        height:750,
    };
    console.log("ready to plot pie chart");
    Plotly.newPlot("pie",data,layout);
})
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  console.log("initialization")
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    console.log(sampleNames);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(newSample);
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
console.log("excute the changes");
init();
