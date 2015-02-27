"use strict";

qaApp.controller("QuestionMobileController", ["$scope", "$routeParams", "JDPAFactory",
    function ($scope, $routeParams, JDPAFactory) {
        $scope.QuestionNumber = "1";
        $scope.text_type_checkbox = false;
        var surveyName = $routeParams.filename;
        var QuestionObject = {};
        var flag = false;
        var questionTitle = null;
        var SelectionType = "SimpleRadioOrCheckbox";



        // function to handle response adding [press button]
        $scope.generateResponses = function () {
            var noOfResponse = $("#noOfResponse>input").val();
            var label = 1;

            for (var index = 0; index < noOfResponse; index++) {
                var newRow = '<div class="form-group dynamic-responses" id="response-id-' + index + '"><label for="inputPassword3" class="col-sm-2 control-label"></label><div class="col-sm-9" style="padding:0px"><div class="col-md-4"><input type="text" for="input-label" class="form-control" placeholder="Response label" required></div><div class="col-md-4 add_text_btn_container"><button id="one" class="btn btn-default add_response_button form-control" style="display:none" >Add Level</button></div><div class="col-md-4 response-value-container" style="display:none"></div></div></div>';

                $('#response-container').append(newRow);
            } // end of for loop

            if ($scope.text_type_checkbox) {
                $("#response-container .add_response_button").show();
            }
        }; // end of generateResponses 



        // function to handle previous question button    
        $scope.previousQuestion = function () {}; // end of previousQuestion



        // function to handle isText checkbox
        $scope.change = function () {
            if ($scope.text_type_checkbox) {
                $("#response-container .add_response_button").removeClass("hide").addClass("show");
                SelectionType = "MultiLevelRadio";
            }
            if (!$scope.text_type_checkbox) {
                $("#response-container .form-group .response-value-container").hide();
                $("#response-container .add_response_button").removeClass("show").addClass("hide");
                SelectionType = "SimpleRadioOrCheckbox";
            }
        }; // end of change



        // function to handle showing response value inputbox on add level button click event
        $("#response-container").on("click", ".add_response_button", function (e) {
            e.preventDefault();
            var newInputElement = '<input type="text" for="input-value" class="form-control" style="margin-left:0px;" placeholder="Response value" required>';
            $(this).parent("div").siblings(".response-value-container").show();
            $(this).parent("div").siblings(".response-value-container").append(newInputElement);
        }); // end of click event



        // function for handling question generation
        $scope.saveQuestion = function () {
            if (validateForEmptyInput()) {
                getInputValue();

                if (Object.keys(QuestionObject).length != 0) {
                    JDPAFactory.postQuestionJSON({
                            "Survey Name": surveyName,
                            "For": "MOBILE",
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
            var response_input_label_flag = true; // flag to check response input label not to be blank
            var response_container_length = $("#response-container").children().length; // to find no. of elements in response-container

            // event to handle response input to check is not empty
            $("#response-container .form-group").each(function (index, element) {
                var input_label = $(this).find("input[for='input-label']").val();
                if (input_label == "") {
                    response_input_label_flag = false;
                }
            }); // end of #response-container .form-group

            if (question_textarea != "") {
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
            var no_of_responses = $("#no-of-response-input").val();

            if (no_of_responses == "") {
                SelectionType = "NoResponse";
            }

            // event to loop through each form group
            $("#response-container .form-group").each(function (index, element) {
                var input_label = $(this).find("input[for='input-label']").val();
                var input_value = $(this).find("input[for='input-value']").val();

                responseKeyObject[responseIndex] = getResponseValueObject($(this), input_label, input_value);
                responseIndex++;
            });

            OneQuestionObjectPerQuestion["Question"] = $scope.question;
            OneQuestionObjectPerQuestion["SelectionType"] = SelectionType;
            OneQuestionObjectPerQuestion["Responses"] = responseKeyObject;
            //OneQuestionObjectPerQuestion["Condition"] = $scope.condition;

            questionTitle = $(".panel-title").text();
            QuestionObject[questionTitle] = OneQuestionObjectPerQuestion;

            clearQuestionPanel();
        } // end of getInputValue



        // function to create response value object 
        function getResponseValueObject(parent_this, input_label, input_value) {
            var responseValueObject = {};
            var responseValue = {};
            var responseValueArray = [];

            if (SelectionType == "MultiLevelRadio") {
                responseValue["value"] = input_label;
                responseValue["input"] = "radio";
                responseValueObject["L1"] = responseValue;

                // event to loop through each L2
                parent_this.find("input[for='input-value']").each(function () {
                    responseValue = {};
                    responseValue["value"] = $(this).val();
                    responseValue["input"] = "radio";
                    responseValueArray.push(responseValue);
                });
                responseValueObject["L2"] = responseValueArray;
                responseValueArray = [];
            } else
            if (SelectionType = "SimpleRadioOrCheckbox") {
                responseValueObject["value"] = input_label;
                responseValueObject["input"] = "radio";
            }

            return responseValueObject;
        }



        // function to clear the question panel
        function clearQuestionPanel() {
            $("#response-container").empty();
            $("#question-textarea").val("");
            $("#no-of-response-input").val("");
            $scope.text_type_checkbox = false;
            SelectionType = "SimpleRadioOrCheckbox";
        }

}]);