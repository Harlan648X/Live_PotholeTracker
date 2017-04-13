var map;
var potholeList = [];
var infoWindowList = [];

$(document).ready(function reportMap() {

    var cleveland = { lat: 41.505, lng: -81.681 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: cleveland,
        streetViewControl: false

    });


    
    var pothole;

    google.maps.event.addListener(map, 'click', function (event) {
        if (pothole) {
            pothole.window.close();
            pothole.pin.setMap(null);
        }

        pothole = placePotholeMarker(event.latLng); //places marker at latitude & longitude of click and fills pothole object
        var contentString = '<form action="/function/report" method="post"> <input name="Latitude" type="hidden" value="' + pothole.pin.position.lat() + '"> <input name="Longitude" type="hidden" value="' + pothole.pin.position.lng() + '"> <button class="btn-default btn-xs btn-block" id="potholeButton" type="submit">Submit Pothole</button> </form>';
        //pothole.contentString = contentString;

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        infoWindowList.push(infowindow);

        infowindow.open(map, pothole.pin);

        pothole.window = infowindow;

        google.maps.event.addListener(pothole.window, 'closeclick', function (event) {
            pothole.pin.setMap(null);
        });

        pothole.pin.addListener('dragend', function (event) {
            if (pothole) {
                pothole.window.close();
                pothole.pin.setMap(null);
            }

            pothole = placePotholeMarker(event.latLng); //places marker at latitude & longitude of click and fills pothole object
            var contentString = '<form action="/function/report" method="post"> <input name="Latitude" type="hidden" value="' + event.latLng.lat() + '"> <input name="Longitude" type="hidden" value="' + event.latLng.lng() + '"> <button class="btn-default btn-xs btn-block" id="potholeButton" type="submit">Submit Pothole</button> </form>';
            //pothole.contentString = contentString;

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            infoWindowList.push(infowindow);

            infowindow.open(map, pothole.pin);

            pothole.window = infowindow;

            google.maps.event.addListener(pothole.window, 'closeclick', function (event) {
                pothole.pin.setMap(null);
            });

        });

    });


    //var image = 'https://cdn2.iconfinder.com/data/icons/bad-day/64/flat_tire_unhappy_bad_luck_depression_fail_failure_defeat-512.png';

    function placePotholeMarker(location) {

        var marker;

        if (marker) {
            marker.setPosition(location);
        } else {
            marker = new google.maps.Marker({
                position: location,
                map: map,
                draggable: true,
                //icon: image
            });
        }

        return { //returns pothole object
            pin: marker,
            window: null,
        }
    }
});

function placePotholes(currentPotholes, userType) {

    var cleveland = { lat: 41.505, lng: -81.681 };

    for (var i = 0; i < currentPotholes.length; i++) {

        var img = '/images/reddot.png';
        var titleText = 'Awaiting Inspection';

        if (currentPotholes[i].RepairEndDate != null) {
            img = '/images/greendot.png';
            titleText = 'Repair Complete';
        }
        else if (currentPotholes[i].RepairStartDate != null) {
            img = '/images/bluedot.png'
            titleText = 'Repair In Progress';
        }
        else if (currentPotholes[i].InspectDate != null) {
            img = '/images/yellowdot.png';
            titleText = 'Awaiting Repair';
        }

        var pothole = {
            pin: new google.maps.Marker({
                position: { lat: currentPotholes[i].Latitude, lng: currentPotholes[i].Longitude },
                map: map,
                icon: img,
                title: titleText,
            }),
            info: currentPotholes[i],
            id: currentPotholes[i].PotholeId,

        }

        pothole.pin.addListener('click', function (event) {

            closeAllInfoWindows();

            var infoWindow = new google.maps.InfoWindow({
                content: '<p>' + this.title + '</p>'
            })

            infoWindow.open(map, this);
            infoWindowList.push(infoWindow);
        })

        potholeList.push(pothole);
    }

}

function closeAllInfoWindows() {
    for (var i = 0; i < infoWindowList.length; i++) {
        infoWindowList[i].close();
    }
}