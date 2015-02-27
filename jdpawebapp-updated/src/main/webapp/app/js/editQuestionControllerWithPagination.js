qaApp.controller("EditQuestionController", ["$scope", "$http", "JDPAFactory", function ($scope, $http, JDPAFactory) {
    $scope.message = "Testcase";
    var testcaseData = [];
    $scope.testcases = [];
    var QuestionObject = {};
    var surveyNameFromSelect = "";
    var testcaseName = "";
    var questionJSONData = "";
    $scope.questionTitle = "Question Number";
    $scope.condition = "";
    $scope.totalNumberOfQuestions = "";
    var SelectionType = "SimpleRadioOrCheckbox";



    // function to handle fetch survey names from db
    JDPAFactory.getSurveyNamesFromQuestionCollection(
        function (data, status) {
            $scope.surveyNames = data;
        },
        function (err) {

        }); // end of getSurveyNames



    // function to handle surveyname selection box
    $scope.changeSurveyNameSelect = function (surveyName) {
        surveyNameFromSelect = surveyName;
        if (surveyName) {
            // function to handle fetching survey names from db
            JDPAFactory.getQuestionJSONToEdit(surveyName,
                function (data, status) {
                    questionJSONData = data;
                    $scope.totalNumberOfQuestions = Object.keys(data).length;
                },
                function (err) {});
        }
    };



    // function to handle showing question data on view from db
    $scope.getQuestionJSONToEdit = function (questionNumber) {
        $scope.text_type_checkbox = false;
        var totalNumberOfQuestion = Object.keys(questionJSONData).length;
        $scope.questionTitle = $scope.questionNumber;
        var questionJSON = questionJSONData[questionNumber];
        $scope.question = questionJSON.Question;
        $scope.condition = questionJSON.Condition;
        console.log("Keys: " + Object.keys(questionJSON.Responses));
        $('#response-container').empty();

        angular.forEach(questionJSON.Responses, function (value, key) {
            var input_text = value.input_text;
            var input_label_value = value.value;
            var input_type = value.input;
            var input_text_value = "";
            var index = 0;

            if (input_type == "Textbox") {
                input_text_value = input_text;
            } else
            if (input_type == "radio") {
                input_text_value = "";
            }

            var newRow = '<div class="form-group dynamic-responses" id="response-id-' + index + '"><label for="inputPassword3" class="col-sm-2 control-label"></label><div class="col-sm-9" style="padding:0px"><div class="col-md-4"><input type="text" for="input-label" class="form-control"  value="' + input_label_value + '" placeholder="Response label" required></div><div class="col-md-4 add_text_btn_container"><button id="one" class="btn btn-default add_response_button form-control" style="display:none" >Add Text</button></div><div class="col-md-4 response-value-container" style="display:none"><input type="text" for="input-value" class="form-control" value="' + input_text_value + '" style="margin-left:0px;" placeholder="Response value" required></div></div></div>';

            // Add the new dynamic row after the last row
            $('#response-container').append(newRow);
            index = index + 1;
        }); // end of for-each loop
    };



    // function to handle isText checkbox
    $scope.change = function () {
        if ($scope.text_type_checkbox) {
            $("#response-container .add_response_button").removeClass("hide").addClass("show");
            SelectionType = "SimpleTextbox";
        }

        if (!$scope.text_type_checkbox) {
            $("#response-container .form-group .response-value-container").hide();
            $("#response-container .add_response_button").removeClass("show").addClass("hide");
            SelectionType = "SimpleRadioOrCheckbox";
        }

    }; // end of change



    // function to handle adding responses [press button]
    $scope.generateResponses = function () {
        var noOfResponse = $("#noOfResponse>input").val();
        $scope.questionButton = false;
        var arrInputIndex = [];
        var label = 1;

        for (var index = 0; index < noOfResponse; index++) {
            var newRow = '<div class="form-group dynamic-responses" id="response-id-' + index + '"><label for="inputPassword3" class="col-sm-2 control-label"></label><div class="col-sm-9" style="padding:0px"><div class="col-md-4"><input type="text" for="input-label" class="form-control" placeholder="Response label" required></div><div class="col-md-4 add_text_btn_container"><button id="one" class="btn btn-default add_response_button form-control" style="display:none" >Add Text</button></div><div class="col-md-4 response-value-container" style="display:none"><input type="text" for="input-value" class="form-control" style="margin-left:0px;" placeholder="Response value" required></div></div></div>';

            // Add the new dynamic row after the last row
            $('#response-container').append(newRow);
        } // end of for loop

        if ($scope.text_type_checkbox) {
            $("#response-container .add_response_button").show();
        }
    }; // end of generateResponses 



    // event for showing response value inputbox on click event of add_text button
    $("#response-container").on("focus", ".add_response_button", function (e) {
        e.preventDefault();

        $(this).click(function () {
            $(this).parent("div").siblings(".response-value-container").show();
        });
    }); // end of focus event



     // function for handling question generation
        $scope.saveQuestion = function () {
            if (validateForEmptyInput()) {
                getInputValue();

                if (Object.keys(QuestionObject).length != 0) {
                    JDPAFactory.postQuestionJSON({
                            "Survey Name": surveyNameFromSelect,
                            "Data": QuestionObject
                        },
                        function (data, status) {
                            $scope.message = "inserted!";

                            if (status == "201") {
                                $('#save-alert').removeClass()
                                    .addClass("alert alert-success");
                                $timeout(function () {
                                    $location.path('/question');
                                }, 4000);
                            } else {
                                $('#save-alert').removeClass()
                                    .addClass("alert alert-warning");
                            }
                            $('#save-alert').css("display", "block").fadeOut(4000);
                        },
                        function (err) {
                            $scope.message = "Network Error!";
                            $('#save-alert').css("display", "block").fadeOut(4000);
                        });
                }
            } else {
                alert("Check your input!");
            }
        }; // end of saveQuestion
    
    
    // function to handle next Question button
        $scope.nextQuestion = function () {
            if (validateForEmptyInput()) {
                $scope.QuestionNumber++;
                getInputValue();
            } else {
                alert("Check your input!");
            }
        }; // end of nextQuestion



        // function to handle empty input
        function validateForEmptyInput() {
                var question_textarea = $("#question-textarea").val(); // question textarea should not empty
                var no_of_response_input = $("#no-of-response-input").val(); // to check no. of response for 0 or negetive value
                var response_input_label_flag = true; // flag to check response input label not to be blank
                var response_container_length = $("#response-container").children().length; // to find no. of elements in response-container
                
                // event to handle response input to check is not empty
                $("#response-container .form-group").each(function (index, element) {
                    var input_label = $(this).find("input[for='input-label']").val();
                    if (input_label == "") {
                        response_input_label_flag = false;
                    }
                }); // end of #response-container .form-group

//                if (question_textarea != "" && response_container_length != 0 && no_of_response_input >= 1 && response_input_label_flag) {
            if (question_textarea != "" && response_container_length != 0 && response_input_label_flag) {
                    flag = true;
                } else {
                    flag = false;
                }
                return flag;
            } // end of validateForEmptyInput



        // common utility function to get values from input box and create question JSON Object
        function getInputValue() {
                var OneQuestionObjectPerQuestion = {};
                var ResponsesPerQuestionObject = {};
                var responseKeyObject = {};
                var responseObject = {};
                var responseIndex = 1;

                $("#response-container .form-group").each(function (index, element) {
                    var responseValueObject = {};
                    var input_label = $(this).find("input[for='input-label']").val();
                    var input_value = $(this).find("input[for='input-value']").val();

                    responseValueObject["input_text"] = input_value;
                    responseValueObject["value"] = input_label;

                    if (input_value != "") {
                        responseValueObject["input"] = "TextBox";
                    } else {
                        responseValueObject["input"] = "radio";
                    }
                    responseKeyObject[responseIndex] = responseValueObject;
                    responseIndex++;
                });

                OneQuestionObjectPerQuestion["Question"] = $scope.question;
                OneQuestionObjectPerQuestion["SelectionType"] = SelectionType;
                OneQuestionObjectPerQuestion["Responses"] = responseKeyObject;
                OneQuestionObjectPerQuestion["Condition"] = $scope.condition;

                questionTitle = $(".panel-title").text();
                QuestionObject[questionTitle] = OneQuestionObjectPerQuestion;

                $("#response-container").empty();
                $("#question-textarea").val("");
                $("#condition-textarea").val("");
                $("#no-of-response-input").val("");
                $scope.text_type_checkbox = false;
            } // end of getInputValue


}]);