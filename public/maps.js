// This example requires the Visualization library. Include the libraries=visualization
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

      var map, heatmap, geocoder;
      var orderPoints = [];

      function initMap() {
        geocoder = new google.maps.Geocoder();

        getPoints(function() {
            console.log("built the locations. Creating map...");
            map = new google.maps.Map(document.getElementById('map'), {
              zoom: 4,
              center: {lat: 42.877742, lng: -97.380979},
              mapTypeId: 'roadmap'
            });
            console.log("map made. Now doing heat map.");
            heatmap = new google.maps.visualization.HeatmapLayer({
              data: orderPoints,
              map: map
            });
            console.log("should be done?");
        });
      }

      // Heatmap data: get from node server.
      function getPoints(callback) {
          $.ajax({
              type: "GET",
              dataType: "json",
              url: "/api/orders",
              success: function(data){
                  console.log("got the points! Determining location");
                  var count = 0;
                  console.log("data length =" + data.length);
                  $.each(data, function(index, element) {
                    var zipCode = element.zipCode;
                    var lat = '';
                    var lng = '';
                    $.ajax({
                      type: "GET",
                      dataType: "json",
                      url: "https://maps.googleapis.com/maps/api/geocode/json?key=YOUR_API_KEY&address="+zipCode,
                      success: function(googleData){
                          count++;
                          lat = googleData.results[0].geometry.location.lat;
                          lng = googleData.results[0].geometry.location.lng;
                          orderPoints.push(new google.maps.LatLng(lat, lng));
                          if(count == data.length) {
                              // Once we've tried to map all the zip codes, we can build the map.
                              if (typeof callback == 'function') {
                                  callback();
                              }
                          }
                      }, 
                      error: function(message) {
                        console.log("Geocode was not successful for the following reason: " + message);
                      }
                  });
                });
              }
          });
          return orderPoints;
    }
