var attemptRadius = 2000;
var attempts = []

function initMap() {
    function newPlace() {
        x = places.places[parseInt(Math.random() * places.places.length)]
        var place = new google.maps.LatLng({
            lat: parseFloat(x.lat),
            lng: parseFloat(x.long)
        })
        console.log(x);
        return place
    }

    var questionPlace = newPlace();

    var origin = new google.maps.LatLng({
        lat: 0,
        lng: 0
    });


    var questionMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        rotateControl: false,
        center: questionPlace,
        mapTypeId: "satellite",
        gestureHandling: "none"
    });

    var questionMarker = new google.maps.Marker({
        map: questionMap,
        position: questionPlace
    });

    var answerMap = new google.maps.Map(document.getElementById('map-ans'), {
        zoom: 2,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        rotateControl: false,
        center: origin,
        mapTypeId: "satellite",
        gestureHandling: "auto"
    });

    // var zoomInput = document.getElementById('zoom-input');
    // google.maps.event.addDomListener(zoomInput, 'change', function () {
    //     map.setZoom(parseInt(zoomInput.value));
    // });

    var attempt = 1
    
    answerMap.addListener('click', function (e) {
        var attemptPlace = e.latLng
        attemptAction(questionPlace, attemptPlace, answerMap, attempt);

    });

    function attemptAction(questionPlace, attemptPlace, map, attempt) {
        var circle = new google.maps.Circle({
            center: attemptPlace,
            map: map,
            radius: attemptRadius * 1000,
            strokeColor: "red",
            fillColor: "white",
            fillOpacity: 0.5
        });
        var text = new google.maps.Marker({
            position: attemptPlace,
            map: map,
            label: { text: attempt.toString() },
        });

        var attemptDistance = distance(questionPlace.lat(), questionPlace.lng(), attemptPlace.lat(), attemptPlace.lng())

        attempts.push({
            questionPlace: questionPlace, attempt: attempt, place: attemptPlace, distance: attemptDistance, radius: attemptRadius,
            circle: circle, text: text
        })

        map.panTo(attemptPlace);

        if (attemptDistance < attemptRadius) {
            success(questionMap, questionMarker, answerMap, attempts)
        } else {
            tryAgain()
        }
    }

    function success(questionMap, questionMarker, answerMap, attempts) {
        questionPlace = newPlace();
        questionMap.setCenter(questionPlace);
        questionMarker.setPosition(questionPlace);

        for (i in attempts) {
            attempts[i].circle.setMap(null);
            attempts[i].text.setMap(null);
        }

        answerMap.setCenter(origin);
        answerMap.setZoom(2);

        attempt = 1

        console.log("Success!");
    }

    function tryAgain() {
        console.log("Try again!");
        attempt = attempt + 1
    }

}


function distance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function toRad(Value) {
    return Value * Math.PI / 180;
}
