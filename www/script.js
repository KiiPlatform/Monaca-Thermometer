var app = angular.module('myApp', ['onsen']);

app.controller("AppCtrl", ["$scope", function($scope){

    ons.ready(function() {
        console.log("ons.ready() called");
        document.addEventListener("deviceready", function(e) {
            // Kii Application info.
            var appid = "77ad4dda";
            var appkey = "248c4d2e04e82105bfeb90ea17da0ff4";
            var site = KiiSite.JP;
            Kii.initializeWithSite(appid, appkey, site);
        });
        document.addEventListener('pageinit', function(e) {
            var data = {};
            var dataSets = [];
            var labels = [];
            var ctx;
            if (e.target.id == "hourly-temperature") {
                ctx = document.getElementById("chart-area").getContext("2d");
                console.log(ctx);
                // Make label. (minutes.)
                for (i=0; i<59; ++i) {
                    if (i%10 === 0) {
                        labels.push(i + "分");
                    } else {
                        labels.push("");
                    }
                }
                dataSets.push({
                    label: "Hourly temperatures",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: $scope.hourlyTemperaturesObject.get("data")
                });
                data.labels = labels;
                data.datasets = dataSets;
                Chart.defaults.global.scaleLabel =
                function(valuePalyload) {
                    return valuePalyload.value + "C";
                };
                new Chart(ctx).Line(data, Chart.defaults.Line);            }
        });

    });

    $scope.login = function(loginName, password) {
        console.log("login with " + loginName);
        KiiUser.authenticate(loginName, password, {
            success: function(user) {
                $scope.user = user;
                myNavigator.pushPage("thing-register.html");
            },
            failure: function(user, error) {
                ons.notification.alert({
                   message: 'login failed. ' + error,
                   title: 'login',
                   buttonLabel: 'OK',
                   animation: 'default'
                });           
            }
        });
    };

    $scope.signup = function(loginName, password) {
        var user;
        console.log("sign up with " + loginName);
        // TODO: distinguish type of loginName and use proper user factory method.
        user = KiiUser.userWithUsername(loginName, password);
        user.register({
            success: function(user) {
                $scope.user = user;
                myNavigator.pushPage("thing-register.html");
            },
            failure: function(user, error) {
                ons.notification.alert({
                    message: 'Sign up failed. ' + error,
                    title: 'Sign up',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        });
    };

    $scope.ownerRegistration = function(vendorThingID) {
        var user = $scope.user;
        var succeededCallback = function() {
            KiiThing.loadWithVendorThingID(vendorThingID, {
                success: function(thing) {
                    $scope.thing = thing;
                    myNavigator.pushPage("thing-info.html");
                },
                failure: function(error) {
                    ons.notification.alert({
                        message: 'load thing failed. ' + error,
                        title: 'owner registration',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                }
            });
        };

        KiiThing.registerOwnerWithVendorThingID(vendorThingID, user, {
            success: function(user) {
                succeededCallback();
            },
            failure: function(error) {
                console.log(error.message);
                if (error.message.search(/.*THING_OWNERSHIP_ALREADY_EXISTS.*/) >= 0) {
                    succeededCallback();
                } else {
                    ons.notification.alert({
                        message: 'register owner failed. ' + error,
                        title: 'owner registration',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                }
            }
        });

    };

    $scope.listTemperatures = function() {
        var bucket;
        var query;
        bucket = $scope.thing.bucketWithName("temperatures");
        query = KiiQuery.queryWithClause();
        query.setLimit(24);
        query.sortByDesc("_modified");
        
        bucket.executeQuery(query, {
            success: function(query, resultSet, nextQuery) {
                $scope.temperatureObjects = resultSet;
                myNavigator.pushPage("temperatures.html");                
            },
            failure: function(query, error) {
                ons.notification.alert({
                    message: 'list temperatures failed. ' + error,
                    title: 'list temperatures',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        });
    };

    $scope.loadTemperatures = function(kiiObject) {
        kiiObject.refresh({
            success: function(kiiObject) {
                $scope.hourlyTemperaturesObject = kiiObject;
                // actual chart loading would be done in event handler of the document.
                myNavigator.pushPage("hourly-temperatures.html");
            },
            failure: function(kiiObject, error) {
                ons.notification.alert({
                    message: 'load hourly temperatures failed. ' + error,
                    title: 'hourly temperatures',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        });

    }

    $scope.localTime = function (idString) {
        var date;
        var dateStr;
        
        // convert format to 2016-01-01T12:59:59Z
        dateStr = idString.substring(0, 13);
        dateStr += ":" + idString.substring(13,15);
        dateStr += ":" + idString.substring(15,17);

        date = new Date(dateStr);
        return (date.getMonth() +1) + "月 " + date.getDate() + "日 " + date.getHours() + "時 ";
    }

}]);
