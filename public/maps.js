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

      function toggleHeatmap() {
        heatmap.setMap(heatmap.getMap() ? null : map);
      }

      function changeGradient() {
        var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
        heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
      }

      function changeRadius() {
        heatmap.set('radius', heatmap.get('radius') ? null : 20);
      }

      function changeOpacity() {
        heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
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
                            console.log("lat: " + lat + ", lng: " + lng);
                            orderPoints.push(new google.maps.LatLng(lat, lng));
                            if(count == data.length) {
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
                  //alert(data);
              }
          });

          return orderPoints;
        /*return [
          new google.maps.LatLng(37.782551, -122.445368),
          new google.maps.LatLng(37.782745, -122.444586),
          new google.maps.LatLng(37.782842, -122.443688),
          new google.maps.LatLng(37.782919, -122.442815),
          new google.maps.LatLng(37.782992, -122.442112),
          new google.maps.LatLng(37.783100, -122.441461),
          new google.maps.LatLng(37.783206, -122.440829),
          new google.maps.LatLng(37.783273, -122.440324),
          new google.maps.LatLng(37.783316, -122.440023),
          new google.maps.LatLng(37.783357, -122.439794),
          new google.maps.LatLng(37.783371, -122.439687)
        ];*/
    }