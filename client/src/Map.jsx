import React from 'react';
import InfoBox from './InfoBox'
import * as d3 from 'd3';
import topojson from 'topojson';
import Datamap from 'datamaps';
import Title from './Title';
import Loading from './Loading';
import Footer from './Footer';
import playImg from './images/play.png';
import stopImg  from './images/stop.jpg';

class Map extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRendered: false,
      countries: "",
    }
    this.renderMap = this.renderMap.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
  }
  componentWillMount(){
  }

  componentDidMount(){
    // console.log(this.props);
    this.renderMap()
    fetch('/api/countries')
      .then(res => res.json())
      .then(countries => {
        this.setState({
          countries: countries,
          country: "",
        })
      })
  }
  componentDidUpdate(){
  }
  selectCountry(selectedCountry){
    this.setState({
      country: selectedCountry
    })
    // console.log(this.state.country);
  }

  renderMap(){

    var fills = {
      someOtherFill: '#aa9f9f',
      defaultFill: '#24ac24'
    };
    var basic_choropleth = new Datamap({
      element: document.getElementById("map"),
      projection: 'mercator',
      responsive: true,
      fills: fills,
      geographyConfig: {
        borderWidth: 1,
        borderOpacity: 1,
        borderColor: '#FFFFFF',
        highlightOnHover: false,
        highlightFillColor: '#FFFFFF',
        highlightBorderColor: "#FFFFFF",
        highlightBorderWidth: 2,
        highlightBorderOpacity: 1
      },
    });

    var colors = d3.scale.category10();

    var wind = window.d3
    wind.selectAll('.datamaps-subunit')
  //   .on("click", function(d) {
  //     console.log(d3.select(this).datum());
  //     let selected = d3.select(this);
  //     let datum = d.id || {};
  //
  //     let proxy = d.id
  //     console.log(selected);
  //
  //     // selected.style('fill',"red")
  //     // basic_choropleth.updateChoropleth({
  //     //     [proxy]: colors(Math.random() * 50),
  //     // })
  //   }
  // )
  .on('mouseover', function(d) {
    let $this = d3.select(this);
    // $this.style('fill',"#FFFFFF")
    $this.style('stroke', "#FFFFFF")
    $this.style('stroke-width', "4")
    $this.on('mousemove', null);
    $this.on('mousemove',function(){
      var position = d3.mouse(this);
      d3.select('.datamaps-hoverover')
      .style('top', ( (position[1] + 30)) + "px")
      .style('left', ( position[0]) + "px")
        .html(function() {
          // var data = JSON.parse(d3.select('.datamaps-hoverover').attr('data-info'));
          // console.log(d.properties.name);
          try {
            // console.log(d);
            return (d.properties.name);
          } catch (e) {
            console.log(options);
            return "";
          }
    })
     d3.select('.datamaps-hoverover').style('display', 'block');
  })
    // $this.on('mousemove', function() {
    //   console.log(this);
      // var position = d3.mouse(this.options.element);
      // d3.select(this.svg[0][0].parentNode).select('.datamaps-hoverover')
      //   .style('top', ( (position[1] + 30)) + "px")
      //   .html(function() {
      //     var data = JSON.parse($this.attr('data-info'));
      //     try {
      //       return options.popupTemplate(d, data);
      //     } catch (e) {
      //       return "";
      //     }
      //   })
      //   .style('left', ( position[0]) + "px");
    // });
    //
    // d3.select(self.svg[0][0].parentNode).select('.datamaps-hoverover').style('display', 'block');

  })
  .on('mouseout', function(d) {
    let $this = d3.select(this);
    // $this.style('fill',"#000000")
    $this.style('stroke', "#FFFFFF")
    $this.style('stroke-width', "1")
    d3.select('.datamaps-hoverover').style('display', 'none');
  })


    //built in resize in datamaps
    d3.select(window).on('resize', function() {
      basic_choropleth.resize()
    });

    let d3SelectCountry = this.selectCountry //need to bind this to a function because d3 overrides the this context
    // console.log("outside d3 function", this.props);
    wind.selectAll('.datamaps-subunit')
      .on('click', function(geography) {
        // console.log(geography);
        basic_choropleth.updateChoropleth(null, {reset: true}) // resets map
        var state_id = geography.id;
        var new_fills = {
          [geography.id] : "#c10000"
          // colors(Math.random() * 10)
          // {fillKey: antikey}
        };
        basic_choropleth.updateChoropleth(new_fills);
        // d3.select(".country-name").text(state_id)
        d3SelectCountry(state_id)
      })

      //randomly select country to display
      let d3animateState = this.animateState;
      let d3isAnimating = false;
      wind.select('#animate').on('click',function () {
        if (!d3isAnimating){
          d3isAnimating = true;
          wind.select('#animate').style('display','none')
          wind.select('#stop').style('display','block')
          let poop = wind.selectAll('.datamaps-subunit')
          let playInterval = setInterval(function() {

            let gah = Math.trunc(Math.random() * poop[0].length)
            let state_id = poop[0][gah].__data__.id
            basic_choropleth.updateChoropleth(null, {reset: true}) // resets map
            var new_fills = {
              [state_id] : "#c10000"
            };
            basic_choropleth.updateChoropleth(new_fills);
            // d3.select(".country-name").text(state_id)
            d3SelectCountry(state_id)
           }, 2000);
           wind.select('#stop').on('click', function(){
             wind.select('#stop').style('display','none')
             wind.select('#animate').style('display','block')
             d3isAnimating = false;
             clearInterval(playInterval)
           })
        }

       })

  }//end of renderMap


  render(){
    return(
      <div id="wrapper">
        <div id="map"> </div>
        <div className="not-map">
          <Title />
          <div className="buttons">
            <img className="button" id="animate" src={playImg} />
            <img className="button" id="stop" src={stopImg} />
          </div>
          {
            this.state.country
            ?
            <InfoBox countries={this.state.countries} country={this.state.country}/>
            :
            <div className="loading">
              <Loading />
            </div>
          }
          <Footer />
        </div>


      </div>
    )
  }
}

export default Map;