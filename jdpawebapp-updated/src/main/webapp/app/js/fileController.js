qaApp.controller("FileController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        $scope.outputFilename = $routeParams.for;
        $scope.filename = "";

        //console.log("for: " + forWhat);



        // show select box and hide input box
        if ($routeParams.outputFile === "Testcase") {
            $("#survey-name-form").find("input").hide();
            $("#survey-name-form").find("select").show();

            // function to handle fetch survey names from db
            JDPAFactory.getSurveyNamesForWeb(
                function (data, status) {
                    $scope.surveyNames = data;
                    $scope.filename = $scope.surveyNames[0];
                    $scope.path = 'testcase/' + $scope.filename;
                },
                function (err) {
                
            }); // end of getSurveyNamesFromTestcaseCollection
        }



        // show input box and hide select box
        if ($routeParams.outputFile === "Question") {
            $("#survey-name-form").find("input").show();
            $("#survey-name-form").find("select").hide();
        }



        // function to handle creating path to redirect on next page with some parameter
        $scope.change = function () {
            if ($routeParams.outputFile === "Testcase") {
                //alert($scope.filename);
                $scope.path = 'testcase/' + $scope.filename;
            } else
            if ($routeParams.outputFile === "Question") {
                if($routeParams.for === "Web") {
                    $scope.path = 'question/Web/'+ $scope.filename;
                }else 
                if ($routeParams.for === "Mobile") {
                    $scope.path = 'question/Mobile/'+ $scope.filename;
                }
                
            }
        }; // end of change

    }]);