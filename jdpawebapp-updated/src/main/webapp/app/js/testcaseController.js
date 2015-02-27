"use strict";

qaApp.controller("TestcaseController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        $scope.message = "Please Click Button!";
        var surveyName = $routeParams.filename;
        
        $scope.generateFileName = function () {
            $('#generate-testcase-alert').removeClass()
                                         .addClass("alert alert-success");
            
            JDPAFactory.postTestCaseJSON({
                        surveyName: surveyName
                    },
                    function (data, status) {
                        console.log("Data: " + data);
                        $scope.message = data;
                        if (status == "201") {
                            $('#save-alert').removeClass()
                                .addClass("alert alert-success");
                            $timeout(function () {
                            }, 4000);
                        } else {
                            $('#save-alert').removeClass()
                                .addClass("alert alert-warning");
                        }
                        $('#save-alert').css("display", "block").fadeOut(4000);
                    }, function (err) {
                        $scope.message = "Network Error!";
                        $('#save-alert').css("display", "block").fadeOut(4000);
                    });
        };
        
    }]);