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
                    data: $scope.hourlyTemperatures
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
        KiiUser.authenticate(loginName, password)
        .then(
            function(user) {
                $scope.user = user;
                myNavigator.pushPage("thing-register.html");                
            }
        ).catch(
            function(error) {
                ons.notification.alert({
                   message: 'login failed. ' + error,
                   title: 'login',
                   buttonLabel: 'OK',
                   animation: 'default'
                });                
            }
        );
    };

    $scope.signup = function(loginName, password) {
        var user;
        console.log("sign up with " + loginName);
        // TODO: distinguish type of loginName and use proper user factory method.
        user = KiiUser.userWithUsername(loginName, password);
        user.register()
        .then(
            function(user) {
                $scope.user = user;
                myNavigator.pushPage("thing-register.html");                
            }
        ).catch(
            function(error) {
                ons.notification.alert({
                    message: 'login failed. ' + error,
                    title: 'login',
                    buttonLabel: 'OK',
                    animation: 'default'
                });                
            }
        );
    };

    $scope.ownerRegistration = function(vendorThingID) {
        var user = $scope.user;
        KiiThing.registerOwnerWithVendorThingID(vendorThingID, user)
        .then(
            function(user) {
                return KiiThing.loadWithVendorThingID(vendorThingID);
            },
            function(error) {
                if (error.message.search(/.*THING_OWNERSHIP_ALREADY_EXISTS.*/) >= 0) {
                    // The user is already registered as owner of the thing.
                    return KiiThing.loadWithVendorThingID(vendorThingID);
                }
                throw error;
            }
        ).then(
            function(thing){
                $scope.thing = thing;
                myNavigator.pushPage("thing-info.html");
            }
        ).catch(
            function(error) {
                console.log(error.message);
                ons.notification.alert({
                    message: 'register owner failed. ' + error,
                    title: 'owner registration',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        );
    };

    $scope.listTemperatures = function() {
        var bucket;
        var query;
        bucket = $scope.thing.bucketWithName("temperatures");
        query = KiiQuery.queryWithClause();
        query.setLimit(24);
        query.sortByDesc("_modified");
        bucket.executeQuery(query)
        .then(
            function(params) {
                var resultSet = params[1];
                $scope.temperatureObjects = resultSet;
                myNavigator.pushPage("temperatures.html");
            }
        ).catch(
            function(error) {
                ons.notification.alert({
                    message: 'list temperatures failed. ' + error,
                    title: 'list temperatures',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        );
    };

    $scope.loadTemperatures = function(kiiObject) {
        kiiObject.refresh()
        .then(
            function(kiiObject) {
                $scope.hourlyTemperaturesObject = kiiObject;
                $scope.hourlyTemperatures = kiiObject.get("data");
                // actual chart loading would be done in event handler of the document.
                myNavigator.pushPage("hourly-temperatures.html");
            }
        ).catch(
            function(error) {
                ons.notification.alert({
                    message: 'load hourly temperatures failed. ' + error,
                    title: 'hourly temperatures',
                    buttonLabel: 'OK',
                    animation: 'default'
                });                
            }
        );
    }

    $scope.localTime = function (idString) {
        var date;
        var dateStr;
        
        // convert format to 2016-01-01T12:59:59Z
        dateStr = idString.substring(0, 13);
        dateStr += ":" + idString.substring(13,15);
        dateStr += ":" + idString.substring(15,17);

        date = new Date(dateStr);
        return (date.getMonth() +1) + "月 " + date.getDate() + "日 " + (date.getHours() +1) + "時 ";
    }

}]);
