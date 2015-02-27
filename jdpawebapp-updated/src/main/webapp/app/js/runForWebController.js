qaApp.controller("RunForWebController", ["$scope", "JDPAFactory", function ($scope, JDPAFactory) {
    $scope.message = "Run";

    // web variable declarations 
    var platform = "";
    var surveyName = "";
    var flag_platform = false;


    // this variable for web/mobile
    var flag_survey_select = false;
    $scope.run_button_hide = true;
   

    
    // function to handle fetch survey names from db
    JDPAFactory.getSurveyNamesForWeb(
        function (data, status) {
            $scope.surveyNames = data;
        },
        function (err) {
    
    }); // end of getSurveyNamesFromTestcaseCollection

    
    
    // event to select survey name from select box
    $(".col-md-2-survey-name-container").find("select").change(function () {
        if ($(this).val() != "Survey") {
            flag_survey_select = true;
        }
    });
   

    /**
     *   Web configuration
     *   details will start
     *   from here!
     */


    // event to hide mobile configuration panel when web button clicks
    $(".btn-web").click(function () {
        $("#collapseMobilePanel").removeClass("in");
    });

    
    
    // event to handle driver type selection
    $("select[name='DriverType-select']").change(function () {
        if ($(this).val() == "grid") {
            $("input[name='web-platform-checkbox']").removeClass("hide").addClass("show");
            $("input[name='web-platform']").hide();
            
            // set all browser checkbox enabled at first moment
             $("input[type='checkbox']").prop("disabled", false);
            
            // clear all checkbox at first moment
            $("input[type='checkbox']").prop("checked",false);
            
        } else
        if ($(this).val() == "webDriver") {
            $("input[name='web-platform-checkbox']").removeClass("show").addClass("hide");
            $("input[name='web-platform']").show();

            // clear all platform radio button at first moment
            $("input[type='radio']").prop("checked", false);
            
            // clear all browser checkbox at first moment
            $("input[type='checkbox']").prop("checked", false);
            
            // set all browser radio disabled at first moment
            $("input[type='checkbox']").prop("disabled", true);
            
            flag_platform = false;
        }
    });
    
    
    
    // event to check any of the platform is checked or not
    $("input[name='web-platform-checkbox']").click(function () {
        $("input[name='web-platform-checkbox']:checked").each(function () {
            flag_platform = true;
        });
    });

    
    
    // set all browser radio disabled at first moment
    $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("disabled", true);
    $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("disabled", true);
    $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("disabled", true);

    

    // event mac radio is checked uncheck and disable other row
    $(".web-platform-mac").click(function () {
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("disabled", false);
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("disabled", true);
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("disabled", true);

        // check first bydefault and uncheck rest
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']:first").prop("checked", true);
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("checked", false);
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("checked", false);

        platform = $(this).val();
        flag_platform = true;
    });

    

    // event linux radio is checked uncheck and disable other row
    $(".web-platform-linux").click(function () {
        //browser = [];
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("disabled", true);
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("disabled", false);
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("disabled", true);

        // check first bydefault and uncheck rest
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']:first").prop("checked", true);
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("checked", false);
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("checked", false);

        platform = $(this).val();
        flag_platform = true;
    });

    

    // event win7 radio is checked uncheck and disable other row
    $(".web-platform-win7").click(function () {
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("disabled", true);
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("disabled", true);
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("disabled", false);

        // check first bydefault and uncheck rest
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']:first").prop("checked", true);
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("checked", false);
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("checked", false);

        platform = $(this).val();
        flag_platform = true;
    });



    
    
    // function to handle grid json creation
    function createJSONForGrid() {
        var configurationValueObject = {};
        $("input[name='web-platform-checkbox']:checked").each(function () {
            var platform = $(this).val();
            var browser = [];
            $(this).parents("tr").find("input[role='web-browser-name']:checked").each(function () {
                var browser_name = $(this).val();
                browser.push(browser_name);
            });
            configurationValueObject[platform] = browser;
        });
        return configurationValueObject;
    }

    
    
    // function to handle webDriver json creation
    function createJSONForWebDriver() {
        var configurationValueObject = {};
        $("input[name='web-platform']:checked").each(function () {
            var browser = [];
            $(this).parents("tr").find("input[role='web-browser-name']:checked").each(function () {
                var browser_name = $(this).val();
                browser.push(browser_name);
            });
            configurationValueObject[platform] = browser;
        });
        
        return configurationValueObject;
    }

    
    
    // function to handle saving and generating web configuration details in json
    $scope.save_web_configuration = function () {
        console.log(JSON.stringify(createJSONForGrid()));
        var driverType = $("select[name='DriverType-select']").val();
        var configurationKeyObject = {};
    
        if (flag_survey_select) {
            if (flag_platform) {
                configurationKeyObject["Survey Name"] = $(".col-md-2-survey-name-container").find("select").val();
                configurationKeyObject["For"] = "WEB";
                configurationKeyObject["DriverType"] = $("select[name='DriverType-select']").val();
                if (driverType == "webDriver") {
                    configurationKeyObject["Data"] = createJSONForWebDriver();
                } else
                if (driverType == "grid") {
                    configurationKeyObject["Data"] = createJSONForGrid();
                }

                // post web configuration details to service
                JDPAFactory.postConfiguration(configurationKeyObject, function (data, status) {
                    console.log("Return response: " + data);
                }, function (data, status) {

                });
                $scope.run_button_hide = false;
            } else {
                alert("Please select/click platform!");
            }
        } else {
            alert("Please select survey!");
        }

    };

    
    
    // function to handle showing and hiding run button
    $scope.showConfigurationPanel = function () {
        $scope.run_button_hide = true;
    };

}]);