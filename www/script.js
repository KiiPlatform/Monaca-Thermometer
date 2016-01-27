var app = angular.module('myApp', ['onsen']);

app.controller("AppCtrl", ["$scope", function($scope){

    ons.ready(function() {
        console.log("ons.ready() called");
        document.addEventListener("deviceready", function(e) {
            // Kii Application info.
            // TODO: Step1: KiiのアプリケーションのID, Key, Locationを設定しましょう。
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
                var dummydata[];
                for (i=0; i<59; i++) {
                    dummydata.push(i);
                }
                dataSets.push({
                    label: "Hourly temperatures",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    // TODO: Step 7: 実際の温度データを設定しましょう。
                    // Step 6で温度のデータの配列が$scope.hourlyTemperatures
                    // に保持されています。
                    data: dummydata;
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

        // TODO: Step 2: Kii Cloudにログインする処理を実装しましょう。
        // ログインが成功したら
        // $scope.userにログインしたユーザーのインスタンスを設定し
        // thing-register.htmlに遷移します。
        // 失敗したらアラートを表示しましょう。
        myNavigator.pushPage("thing-register.html");                
    };

    $scope.signup = function(loginName, password) {
        // TODO: Step 3: Kii Cloudにサインアップする処理を実装しましょう。
        // サインアップが成功したら
        // $scope.user にログインしたユーザーのインスタンスを設定し
        // thing-register.htmlに遷移します。
        // 失敗したらアラートを表示しましょう。
        myNavigator.pushPage("thing-register.html");                
    };

    $scope.ownerRegistration = function(vendorThingID) {
        // TODO: Step 4: ユーザーをThingのオーナーとして登録しましょう。
        // 登録が成功したら
        // $scope.thing に登録したThingのインスタンスを設定し
        // thing-info.htmlに遷移します。
        // 失敗したらアラートを表示しましょう。
        var user = $scope.user;
        myNavigator.pushPage("thing-info.html");
    };

    $scope.listTemperatures = function() {
        // TODO: Step 5: Thingに保存されているオブジェクトの一覧を取得しましょう。
        // Thingはオブジェクトに温度計から取得した温度データを書き込んでいます。
        // Thingは一時間ごとに新しいオブジェクトを作成し、1分ごとに温度データ
        // の書き込みを行います。
        // 一覧の取得が成功したら、$scope.temperatureObjectsに結果を設定して
        // temperatures.htmlに遷移します。
        // 失敗したら、アラートを表示しましょう。
        var thing = $scope.thing;
        myNavigator.pushPage("temperatures.html");
    };

    $scope.loadTemperatures = function(kiiObject) {
        // TODO: Step 6: 引数のkiiObjectを更新して最新の情報を取得しましょう。
        // 処理が成功したら、
        // $scope.hourlyTemperaturesObjectにkiiObjectのインスタンスを
        // $scope.hourlyTemperaturesにkiiObject内のdataフィールドを設定します。
        // (Thingはdataフィールドに1分ごとの温度の配列を書き込んでいます。)
        // hourly-temperatures.htmlに遷移します。
        // 失敗したら、アラートを表示しましょう。
        myNavigator.pushPage("hourly-temperatures.html");
    }

    // Thingがアップロードする温度オブジェクトのIDは日付の形式になっています。
    // Javascriptでパースできる形式に変換し、読みやすい文字列を作成します。
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
