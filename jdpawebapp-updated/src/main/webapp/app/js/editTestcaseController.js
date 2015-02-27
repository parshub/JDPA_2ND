qaApp.controller("EditTestcaseController", ["$scope", "$http", "JDPAFactory", function ($scope, $http, JDPAFactory) {
    $scope.message = "Testcase";
    var testcaseData = [];
    $scope.testcases = [];
    var surveyName = "";
    var testcaseName = "";


    // function to handle fetch survey names from db
    JDPAFactory.getSurveyNamesForWeb(
        function (data, status) {
            $scope.surveyNames = data;
        },
        function (err) {}); // end of getSurveyNamesFromTestcaseCollection



    // event to handle hiding testcase select
    $("div.col-md-2-survey-name-container select").click(function () {
        surveyName = $(this).val();

        if (surveyName != "Survey") {
            $("div.col-md-2-testcase-name-container").removeClass("hide").addClass("show");
            $("div.col-md-8-testcase-edit-container").removeClass("show").addClass("hide");
            $("div.col-md-2-testcase-name-container select").find("option.default").attr("selected", true);
            // function to handle fetch survey names from db
            JDPAFactory.getTestcaseNames(surveyName,
                function (data, status) {
                    $scope.testcaseNames = Object.keys(data);
                },
                function (err) {}); // end of getTestcaseNames
        }
    }); // end div.col-md-2-survey-name-container select



    // event to handle showing testcase edit details
    $("div.col-md-2-testcase-name-container select").click(function () {
        var questionObjectArray = [];
        testcaseName = $(this).val();
        $scope.tc_name = $(this).val();

        if (testcaseName != "Testcases") {
            $("div.col-md-8-testcase-edit-container").removeClass("hide").addClass("show");

            JDPAFactory.getTestcaseNames(surveyName,
                function (data, status) {
                    // [q1,q2,q3]
                    var questions = Object.keys(data[testcaseName]);
                    for (var questionIndex = 0; questionIndex < questions.length; questionIndex++) {
                        var testcaseObject = {};
                        var question = Object.keys(data[testcaseName])[questionIndex];
                        var response = data[testcaseName][question].Response;
                        var next = data[testcaseName][question].Next;
                        testcaseObject["question"] = question;
                        testcaseObject["response"] = response[0];
                        testcaseObject["next"] = next[0];
                        questionObjectArray.push(testcaseObject);
                    }
                    $scope.testcases = questionObjectArray;
                },
                function (err) {}); // end of getTestcaseNames

            $scope.testcases = questionObjectArray;
        } else {} // end of if else
    }); // end of div.col-md-2-testcase-name-container



    // function to handle to save edited data back to db in JSON form;
    $scope.saveEditedTestcase = function () {
        var questionKeyObject = {};
        var questionObject = {};
        $(".col-md-8-testcase-edit-container").find("table tbody tr").each(function () {
            var questionValueObject = {};
            var responseArray = [];
            var nextArray = [];
            var question_label = $(this).find("input[role='question-label']").val();
            var response_value = $(this).find("input[role='response-value']").val();
            var next_question_label = $(this).find("input[role='next-question-label']").val();
            responseArray.push(response_value);
            nextArray.push(next_question_label);
            questionValueObject["Response"] = responseArray;
            questionValueObject["Next"] = nextArray;
            questionKeyObject[question_label] = questionValueObject;
        });
        questionObject["Survey Name"] = surveyName;
        questionObject["Testcase Name"] = testcaseName;
        questionObject["Data"] = questionKeyObject;

        JDPAFactory.postEditedTestcase(questionObject,
            function (data, status) {
                
            },
            function (err) {
        });
    }; // end of saveEditedTestcase


}]);