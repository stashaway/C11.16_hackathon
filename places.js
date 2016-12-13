/**
 * Created by baultik on 12/12/16.
 */
function Places() {
    var mMap = null;
    var mPlacesService = null;
    var mPlaces = [];
    var mAllPlaces = null;
    var mSearchRadius = 15000;//in meters
    var mSearchQuery = null;
    var mDirection = {
        north:"north",
        south:"south",
        east:"east",
        west:"west"
    };
    var mLocation = null;
    var mBearing = null;
    var mHeading = null;

    this.init = function (map) {
        mMap = map;
        mPlacesService = new google.maps.places.PlacesService(mMap);
    };

    this.search = function (search, location,bearing) {
        mSearchQuery = search;
        mLocation = location;
        mBearing = bearing;
        var request = createRequest(search,location);
        //console.log("sending request...",request);
        mPlacesService.nearbySearch(request,parseResponse);
    };

    this.switchDirection = function () {
        var direction = mDirection.north;
        switch (mHeading) {
            case mDirection.north:
                direction = mDirection.south;
                break;
            case mDirection.east:
                direction = mDirection.west;
                break;
            case mDirection.west:
                direction = mDirection.east;
                break;
            default:
                direction = mDirection.north;
                break;
        }
        mHeading = direction;
        clearMarkers();
        populateMap(mHeading,mAllPlaces);
    };

    function populateMap(direction,places) {
        places = filterByDirection(direction,places);
        for (var i in places) {
            var filteredPlace = places[i];
            createMarker(filteredPlace,mLocation);
        }
    }
    
    function filterByDirection(direction,places) {
        var output = [];
        for (var i in places) {
            var place = places[i];
            var coordinates = place.geometry.location.toJSON();
            var center = mLocation;

            switch (direction) {
                case mDirection.south:
                    if (coordinates.lat < center.lat)output.push(place);
                    break;
                case mDirection.east:
                    if (coordinates.lng > center.lng)output.push(place);
                    break;
                case mDirection.west:
                    if (coordinates.lng < center.lng)output.push(place);
                    break;
                default:
                    if (coordinates.lat > center.lat)output.push(place);
                    break;
            }
        }

        return output;
    }

    function translateBearing(bearing) {
        if (bearing < 0) {
            bearing += 360;
        }

        if (bearing < 45 || bearing >= 315) {
            return mDirection.north;
        } else if (bearing >= 45 && bearing < 135) {
            return mDirection.east;
        } else if (bearing >= 135 && bearing < 225) {
            return mDirection.south;
        } else if (bearing >= 225 && bearing < 315) {
            return mDirection.west;
        }
        return null;
    }

    function parseResponse(results,status) {
        console.log("Got response",results);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i in results) {
                var placeResult = results[i];//PlaceResult objects
                if (placeResult.name == mSearchQuery) {
                    mPlaces.push(placeResult);//store all results matching exactly the search query
                }
            }
            //keep a copy of all unfiltered matches
            mAllPlaces = mPlaces.slice();

            mHeading = translateBearing(mBearing);

            populateMap(mHeading,mPlaces);
        }
    }

    function createRequest(search,location) {
        var request = {
            location:location,
            radius:mSearchRadius,
            name:search
        };
        return request;
    }
}

// $(document).ready(function () {
//     prepare_map();
//     var places = new Places();
//     places.init(map);
//
//     //TODO: temp - replace will actual search
//     var loc = new google.maps.LatLng(33.6361934,-117.7415816);
//     map.setCenter(loc);
//
//     places.search("Taco Bell",loc);
//     //console.log("Places",places.getPlaces());
// });

var sampleResponse = {
    "html_attributions": [],
    "results": [
        {
            "geometry": {
                "location": {
                    "lat": 33.6067302,
                    "lng": -117.6901569
                },
                "viewport": {
                    "northeast": {
                        "lat": 33.60677500000001,
                        "lng": -117.68978145
                    },
                    "southwest": {
                        "lat": 33.6065958,
                        "lng": -117.69028205
                    }
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id": "717ed7e62656b8b61166b321ec922d93a5cee2d8",
            "name": "Del Taco",
            "opening_hours": {
                "open_now": true,
                "weekday_text": []
            },
            "photos": [
                {
                    "height": 3120,
                    "html_attributions": [
                        "<a href=\"https://maps.google.com/maps/contrib/111340553165778570721/photos\">Ted Spree</a>"
                    ],
                    "photo_reference": "CoQBdwAAACJlvkj37lx_JR9GGGCpB4jbN0SxL64IF6FvS7YmkT8riq6IRWkol8zaa9JaxwRIitCIWecxma8Hk0JNH7A0iZbMqatJGeRthCJXVz8IOynHXikxhOsgk5wKs3Px55ZTnKC7BtaEJ4CYBixpxrvQvkBQMzfgXio_EUfa3zbc9aatEhByNRHqOdLPnK74vLO1I2xKGhT_f-PgyVR6bLEc2INtSLz99yJBjQ",
                    "width": 4160
                }
            ],
            "place_id": "ChIJE5VHBiDp3IARshxdIcdQHII",
            "price_level": 1,
            "rating": 3.6,
            "reference": "CmRSAAAAji1Uq_4DVbC68uljth2xOriqWUdQjZMqbMKeq6cj-z7o-yJmHgiWfwyzfOXZdN_Xvt-Gk35yoZzFNT6ViDp7Dy1c7YN9Yb0C0xF21jTdXjQS4iAEg0b4XSvAoZvAHOC9EhDgny_0yWMTu2JsE9_dtEH1GhShg7BnXQCnoNlka6Ixa9h3S-KUnw",
            "scope": "GOOGLE",
            "types": [
                "meal_takeaway",
                "restaurant",
                "food",
                "point_of_interest",
                "establishment"
            ],
            "vicinity": "24465 Alicia Parkway, Mission Viejo"
        },
        {
            "geometry": {
                "location": {
                    "lat": 33.6293445,
                    "lng": -117.7251808
                },
                "viewport": {
                    "northeast": {
                        "lat": 33.62952025000001,
                        "lng": -117.7251422
                    },
                    "southwest": {
                        "lat": 33.62881725,
                        "lng": -117.7252966
                    }
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id": "983061c31a0bd760de489fe5c92070c803ec0f4f",
            "name": "Del Taco",
            "opening_hours": {
                "open_now": true,
                "weekday_text": []
            },
            "photos": [
                {
                    "height": 5312,
                    "html_attributions": [
                        "<a href=\"https://maps.google.com/maps/contrib/100488059925742935777/photos\">Gregory Veritas</a>"
                    ],
                    "photo_reference": "CoQBdwAAACfMrcNBiyBgxMYyDaQVgTGpcmxRvHrn1GnQ8gMUB0JmW-pUXu8ek5dFijb8zglh02XX1sbKLjOAgScv3bPht9tXwDkx-B7E947URrr6zr42rVJ00el-oD-k4ZVgI4uzm3B0BsknMSObADKZXfoRIa79q-YmQEw-dtiNZM6kWPkoEhDYH4V7QxMRVUQDWSrth0qCGhSeYeY2-97-K71CAWRfa35D-D3zEw",
                    "width": 2988
                }
            ],
            "place_id": "ChIJaXgoUmXo3IARw_j8THm2_Zk",
            "price_level": 1,
            "rating": 4.1,
            "reference": "CmRSAAAAIlI97CgNelAUX9OzEmE6TUGzfr-d7N0KFHGsHL0R0DVqgA3hJ3Qr7DvBzAdf2Hz8r8St-ILFAWw-zsWFS3H7pUyyySjnKdyeivIhgU15WGERM6xGiWLyIfQ_yPE2idVUEhB5HrFyw8ypsZ0JZCAwOrYYGhRbPlSBMYjwavKMkY92xj0sBMuzRQ",
            "scope": "GOOGLE",
            "types": [
                "meal_takeaway",
                "restaurant",
                "food",
                "point_of_interest",
                "establishment"
            ],
            "vicinity": "16211 Lake Forest Drive, Irvine"
        },
        {
            "geometry": {
                "location": {
                    "lat": 33.6583475,
                    "lng": -117.7415417
                },
                "viewport": {
                    "northeast": {
                        "lat": 33.6587777,
                        "lng": -117.7412324
                    },
                    "southwest": {
                        "lat": 33.6582041,
                        "lng": -117.7416448
                    }
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id": "84ce003a0c438ce8f90441e962ae6a69432d497b",
            "name": "Del Taco",
            "opening_hours": {
                "open_now": true,
                "weekday_text": []
            },
            "photos": [
                {
                    "height": 1152,
                    "html_attributions": [
                        "<a href=\"https://maps.google.com/maps/contrib/113845562329520076991/photos\">Teddy Bourgeois</a>"
                    ],
                    "photo_reference": "CoQBdwAAAKJ_p7-OfbCije-eOk4Hi9U-GdGPYD49tNfnWyoJnjdIpCaREP18PkDyIt1z-TU23IcArISEvX14jlRzXJyVVM7m4DGLmtt24OmNOX9JiSE49B7OlthQHgNL3an6K9Ydi4rDhSXvfng93y6XKkqo9Sudy-M70hzAgyhqnHVu_uuWEhBhogMwuuZQgByZiWxX5YPJGhS2qmE4Lic4-6BX1kFWmiCj36t7Vw",
                    "width": 2048
                }
            ],
            "place_id": "ChIJPZ98hv_n3IARNlUsKN348nU",
            "price_level": 1,
            "rating": 4,
            "reference": "CmRRAAAA6SdEqueJ5g35HYywsHYlBm_4_DxOb7B74UIoAksdvKSc2NzAywTrgnkee82BGzhNZwrLko9BG6fR-8LK9ywbqg-bRS80w4XzJIjWRqCaB6LKPnkVe8nOoQaZkqjABLRnEhCbx9DFvZmdwO3U6afSv_6mGhRv-IDwW1JlZoaiHRiHT1HnOlq4lQ",
            "scope": "GOOGLE",
            "types": [
                "meal_takeaway",
                "restaurant",
                "food",
                "point_of_interest",
                "establishment"
            ],
            "vicinity": "59 Technology Drive West, Irvine"
        },
        {
            "geometry": {
                "location": {
                    "lat": 33.6312051,
                    "lng": -117.7160815
                },
                "viewport": {
                    "northeast": {
                        "lat": 33.63159945,
                        "lng": -117.71482195
                    },
                    "southwest": {
                        "lat": 33.63002204999999,
                        "lng": -117.71650135
                    }
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id": "f7ae7b8940b1404fd5e1b10c2fcf868b91d7be5f",
            "name": "Del Taco",
            "opening_hours": {
                "open_now": true,
                "weekday_text": []
            },
            "photos": [
                {
                    "height": 3024,
                    "html_attributions": [
                        "<a href=\"https://maps.google.com/maps/contrib/101119017903514411121/photos\">Rob George</a>"
                    ],
                    "photo_reference": "CoQBdwAAAB2OFNqzw_Uuu010UYYH_JhPUEudW4TgyoFKyyFfTgo8CQdikB8CW5XyopOcZRvbuusfI8oiiWp8ELUaWzPDO9GYxxJGSAIcXxDk8M25ELtfkQmaZJ5hXAw9EVTz57yATTHEd2duGNPsUPTA296B-WBS3Pt3bkB-sfX2kE8ERR9rEhAT8GFxYYpGpizLdngq7GgdGhQkmpnqmusvwU68sYK1hFf9AqGN6w",
                    "width": 5376
                }
            ],
            "place_id": "ChIJiWxqz2fo3IARPjfLDooO8PE",
            "price_level": 1,
            "rating": 3.8,
            "reference": "CmRSAAAAhuWD9YtGObybeGOA36iyxzUHGWM9fRMivLWp7-DZn3RqDafrDBdFS7qz-2ls3whPyguPSQGuILM9XUjUWhfy0CpRDeVKw0Gx-Nzy--HaEX4iyS9lJ4nNQj84FYjiVJF9EhAhszQjyXH0R36fz23w-3gjGhQfo2F3OwJz-bPAXa_xzR8UjhJxfA",
            "scope": "GOOGLE",
            "types": [
                "meal_takeaway",
                "restaurant",
                "food",
                "point_of_interest",
                "establishment"
            ],
            "vicinity": "22859 Lake Forest Drive, Lake Forest"
        },
        {
            "geometry": {
                "location": {
                    "lat": 33.6215004,
                    "lng": -117.701116
                },
                "viewport": {
                    "northeast": {
                        "lat": 33.62153784999999,
                        "lng": -117.7010021
                    },
                    "southwest": {
                        "lat": 33.62138805000001,
                        "lng": -117.7014577
                    }
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id": "50fa00bf19c9fce786368ec7dd47c50bc7cbb411",
            "name": "Tacos Ensenada",
            "opening_hours": {
                "open_now": true,
                "weekday_text": []
            },
            "photos": [
                {
                    "height": 5312,
                    "html_attributions": [
                        "<a href=\"https://maps.google.com/maps/contrib/113223825850128629117/photos\">Juan Anguiano</a>"
                    ],
                    "photo_reference": "CoQBdwAAAFr6Dzje4vI7HdW28sfzXW9k7EM9MpB4VydggFhBX-lm0_yim2mH_GYy4EhkDZSgNqRVynNCijLeyhZS2sqG-iiVfq7B6CX8GPx_hM3qXdByXYEYmkhlNKu67043U9fVTn-VPtMEH5GEoVgiWxnHebey7V3EuKNKQab5K8VUBtb2EhCSl0SwbzeeOB4rb4ZU9W7uGhTO8vqfyxK0QNND-H0ENT5Igj41Pw",
                    "width": 2988
                }
            ],
            "place_id": "ChIJL-Avw_no3IARpQqhDKhuFHM",
            "rating": 4.6,
            "reference": "CmRRAAAAgB60NOs-3LpOCRTWJfkzNBZVYOXJQTO_JlY5_yctkfCdcxx019ixCBrsf3_c1THKob1GLE4b6wNVOp9HghrXVI4CxBtCSHAmMuD2AkGZc4QD6BQhKOfYZ17tKsuZwIzuEhBVDBoT_CLA025UuV-XgZNMGhQ_eUklcyyTwVK2GQceiPM0r9YuoQ",
            "scope": "GOOGLE",
            "types": [
                "restaurant",
                "food",
                "point_of_interest",
                "establishment"
            ],
            "vicinity": "24601 Raymond Way, Lake Forest"
        },
        {
            "geometry": {
                "location": {
                    "lat": 33.671604,
                    "lng": -117.78915
                },
                "viewport": {
                    "northeast": {
                        "lat": 33.67171389999999,
                        "lng": -117.7890863
                    },
                    "southwest": {
                        "lat": 33.67127430000001,
                        "lng": -117.7893411
                    }
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id": "faf175ffc187c3faff19dea9b49bcff5e5f7f131",
            "name": "Chronic Tacos",
            "opening_hours": {
                "open_now": true,
                "weekday_text": []
            },
            "photos": [
                {
                    "height": 2448,
                    "html_attributions": [
                        "<a href=\"https://maps.google.com/maps/contrib/110214410256747029490/photos\">David Hsu</a>"
                    ],
                    "photo_reference": "CoQBdwAAAIFVmW9QSt_yf8D5mcSijv2680js3qAbqL6ad1iohK1PTrPO7XuMxpQ5bF9iLsjVK8bRpca3XIvJYjZ8UPkTuN7U20Kg0BcY5yovmNf8t88ivSzlssedcRBQkAirfO9khXqKtt73zywWu1B32XfpZm1xMVePimuDius10d65CHj1EhAg7LTorQ7gyVTQESmTVX43GhRI93mXF5-44nTXmdL67HrsyMUd4g",
                    "width": 3264
                }
            ],
            "place_id": "ChIJZzROsabd3IARgbLhalxhAko",
            "rating": 4.1,
            "reference": "CmRRAAAAC4t-eCin6XWjoQk7YvwqK3jbG_q4UhCJyD4gXEXbTHQnY0cVbqFxnafJnjYtNhKCiUaNKPJvGjEKIYMyyoozMDci5DywwZBNdaqFhK2OnLwHFwAgP-_BxjTHx5dijtaxEhDAfLUvTe42bfGPP9Q8NVA8GhRcW8RsTrUMCNtQcYYgnoJ-1PQMww",
            "scope": "GOOGLE",
            "types": [
                "restaurant",
                "food",
                "point_of_interest",
                "establishment"
            ],
            "vicinity": "5365 Alton Parkway d, Irvine"
        },
        {
            "geometry": {
                "location": {
                    "lat": 33.66887690000001,
                    "lng": -117.7651061
                },
                "viewport": {
                    "northeast": {
                        "lat": 33.6691166,
                        "lng": -117.7648514
                    },
                    "southwest": {
                        "lat": 33.668797,
                        "lng": -117.765191
                    }
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id": "9d2710ff425636da769ef42233a5ddc16c471ab5",
            "name": "tacos n co",
            "opening_hours": {
                "open_now": true,
                "weekday_text": []
            },
            "photos": [
                {
                    "height": 3024,
                    "html_attributions": [
                        "<a href=\"https://maps.google.com/maps/contrib/106849604789892261411/photos\">Roger Gentry</a>"
                    ],
                    "photo_reference": "CoQBdwAAAObhacDWsU5K9LzifOhYf2TyxmZGxGY1BgG_OGOj2Uk7TjygJ3PF9h44MUGA0HEqpYxJGRIBcIq3khWe0YLbdKasbWk0fTnktOWWsF084wnDaPpBy_MxMiGBeOtHejl91UEjpIJ_Q_KzD0qp9G6PmG5Rp_YeXodcFjiFvWX1fHhiEhDHi10v4NM7MFXtBiXQA12PGhSPEK2wOPSOBcS1i0CGaDcwukQJ3w",
                    "width": 4032
                }
            ],
            "place_id": "ChIJc1PBoWvd3IARya3sUE_Btx8",
            "rating": 3.5,
            "reference": "CmRRAAAAzaOX4wbN-I_MuVWvpS8aWDjNT416jAw6PKXRt0u1Nij-sbQDnyD_1ktkVcfIYTey9V0uXEM3DJojky57jdtNYwpEg_NvDLkbgOEzpVb_OIcUk4PD7pgWqpZe4x0wq7tdEhBPaRtdAGVfLICIqhqCxh1EGhS_MSOrq7lOTcDpZpEsaPU35Q6zTA",
            "scope": "GOOGLE",
            "types": [
                "restaurant",
                "food",
                "point_of_interest",
                "establishment"
            ],
            "vicinity": "6620 Irvine Center Drive, Irvine"
        },
        {
            "geometry": {
                "location": {
                    "lat": 33.620035,
                    "lng": -117.700522
                },
                "viewport": {
                    "northeast": {
                        "lat": 33.62024545,
                        "lng": -117.7003854
                    },
                    "southwest": {
                        "lat": 33.61996485,
                        "lng": -117.7009318
                    }
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id": "5094a176d35a4cf40f0bdf0ec59cd6ef3f18a674",
            "name": "Wahoo's Fish Taco",
            "opening_hours": {
                "open_now": false,
                "weekday_text": []
            },
            "photos": [
                {
                    "height": 3264,
                    "html_attributions": [
                        "<a href=\"https://maps.google.com/maps/contrib/104572944810916759959/photos\">Brett Wyrick</a>"
                    ],
                    "photo_reference": "CoQBdwAAAPKZC4GPSjxPYcL2yycMBq8e8yIT6lbxXK7k-xyHCZFZK5oaUIiFRBQ5cJ3fTpoSCPqRADEobNnG0hhK3geqCe4tDTm7cZu5yC6M9L4TWtIYgdVSjIOghh07kd0GevwaWvlebEdKtdq-x2uIzxvzGyDtoIIjaJ4DEZ2dexrCzAayEhDsts7U-HFwDV3nt7arH5PbGhT2iGCZvrbeZy0FxmZRnoABx1VAVA",
                    "width": 2448
                }
            ],
            "place_id": "ChIJWeQw9fno3IARXgfqdzxlpoA",
            "rating": 4.1,
            "reference": "CmRSAAAAH2Mrek_TJRY0hA7gsWvhyDFdHlTZM9bkF8skEuHKZrFkCZy3k6QPaeHakyA7gWPrXlhZzApDWCTevztz1FQj32eF-g0rdRmEUQ7Gf-m_S45OmDZQ_yBz3-UjYM7aMIgBEhC9SwPDgH9YjUpkk4f_sN8EGhRklv7TCdlfVft2ZGMpmqsOLFyOtw",
            "scope": "GOOGLE",
            "types": [
                "restaurant",
                "food",
                "point_of_interest",
                "establishment"
            ],
            "vicinity": "23572 El Toro Road, Lake Forest"
        },
        {
            "geometry": {
                "location": {
                    "lat": 33.6500194,
                    "lng": -117.7418236
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id": "97c820962e00a1818042b82e6f38f139dc77f84d",
            "name": "Wahoo's Fish Tacos",
            "opening_hours": {
                "open_now": false,
                "weekday_text": []
            },
            "photos": [
                {
                    "height": 2988,
                    "html_attributions": [
                        "<a href=\"https://maps.google.com/maps/contrib/100676387149611443249/photos\">Matt Gay</a>"
                    ],
                    "photo_reference": "CoQBdwAAAPJYhrNYy_QhHrBCUj0g9kNnBB5FhHqv4fUQE5C7fGlf0vNgy7IfJl9gb0ZfQUZwBcYraDVLvE70MohYKcyMwEPPl5nwS_yeCjDxl5nRgnMgDrn7sxQTgjZvUvRrxQL6gZyG3sBq1f9T02ooJe0U6hiPudpnCTXFYjhqA-aOus-AEhDAW8dx4w3hPp4AlHdKEmkWGhQqccINIvie3CcvtutdrqA3d1yw_A",
                    "width": 5312
                }
            ],
            "place_id": "ChIJxfeID_zn3IARFwYl-Qo1yy0",
            "rating": 4.5,
            "reference": "CmRRAAAAyIImklQ3ePErICPz81V4lb04QucxOGY0hHL8Bt4wUvLIfgYSC6CxrHB8N7OMJOUr0P_lTgSog2IIx68L-6ue26NdJgQEUGAkO9I3G0dDhs_Szr3eIHnL5ZtmlVfiZ0iTEhDE_ZNuP40oZJVnSzVvcrEPGhSiWlRZLJ5BgGTWLLesaaa0jrAqhw",
            "scope": "GOOGLE",
            "types": [
                "restaurant",
                "food",
                "point_of_interest",
                "establishment"
            ],
            "vicinity": "715 Spectrum Center Drive, Irvine"
        },
        {
            "geometry": {
                "location": {
                    "lat": 33.630563,
                    "lng": -117.7173771
                },
                "viewport": {
                    "northeast": {
                        "lat": 33.63070524999999,
                        "lng": -117.71714055
                    },
                    "southwest": {
                        "lat": 33.63013625000001,
                        "lng": -117.71808675
                    }
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id": "49cb52c88d6fe040f56f25f78a2c5d7d8d17f48f",
            "name": "Taco Bell",
            "opening_hours": {
                "open_now": true,
                "weekday_text": []
            },
            "photos": [
                {
                    "height": 5248,
                    "html_attributions": [
                        "<a href=\"https://maps.google.com/maps/contrib/109732281500852349403/photos\">Michael Schatzmann</a>"
                    ],
                    "photo_reference": "CoQBdwAAAGjdPrwvksEE3fq7RLNQ541dZ53unLCCdyFyfu4xcxapq6LVi8oHcqF5X1DuAkWIg8uyO0kpqOFf24TMWWke9uK7s1EHDUlgHIjsNWly1T2LJ5Gy0njwtUUdsM4d0kXC3j070Jum8UvDUbvkoPiHYB_CwBRV9O5LVZjnMCnKbf4zEhB2f5a5iI3k6xnjlrtioBk1GhTlfNe4W4i5i4X-IrIUPCJ3Y3OKAg",
                    "width": 2952
                }
            ],
            "place_id": "ChIJZT7GR2bo3IAR3ROEDl29FDc",
            "price_level": 1,
            "rating": 4.1,
            "reference": "CmRRAAAAokCZvRp6KZv9bIYtK5LaY2nL_8QyWNi-icgY0E4vzLuVHME0_eX7fkVfpNBMDFwaawOUC3Rgt1b7vaBCwjStnN6cia_P0J6thAgQKajfSOdVMyDGwVmIuSAGEqTB6C75EhDWjCqEjShda53eYYRrdqnFGhRjVxgd2fdDe9AMTnd1gSpHzRtdYw",
            "scope": "GOOGLE",
            "types": [
                "meal_takeaway",
                "restaurant",
                "food",
                "point_of_interest",
                "establishment"
            ],
            "vicinity": "23651 Rockfield Boulevard, Lake Forest"
        }
    ],
    "status": "OK"
};