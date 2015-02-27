qaApp.controller("RunForMobileController", ["$scope", "JDPAFactory", function ($scope, JDPAFactory) {
    $scope.message = "Run";

    // web variable declarations 
    var surveyName = "";


    // mobile variable declarations 
    var mobile_platform = "";
    var mobile_version = "";
    var flag_mobile_platform = false;

    // this variable for web/mobile
    var flag_survey_select = false;
    $scope.run_button_hide = true;
    $scope.devices = [];

    
    
    // function to handle fetch survey names from db
    JDPAFactory.getSurveyNamesForMobile(
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
     *   Mobile configuration
     *   details will start
     *   from here!
     */

    // event to hide web configuration panel when mobile button clicks
    $(".btn-mobile").click(function () {
        $("#collapseWebPanel").removeClass("in");
    });

    
    
    // set all versions radio disabled at first moment
    $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']").prop("disabled", true);
    $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']").prop("disabled", true);

    
    
    // event android radio is checked uncheck and disable other row
    $(".mobile-platform-android").click(function () {
        $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']").prop("disabled", false);
        $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']").prop("disabled", true);

        // check first bydefault and uncheck rest
        $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']:first").prop("checked", true);
        $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']").prop("checked", false);

        mobile_platform = $(this).val();
        mobile_version = $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']:first").val();
        flag_mobile_platform = true;

        getMobileDeviceData(mobile_version);
    });



    // event ios radio is checked uncheck and disable other row
    $(".mobile-platform-ios").click(function () {
        $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']").prop("disabled", false);
        $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']").prop("disabled", true);

        // check first bydefault and uncheck rest
        $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']:first").prop("checked", true);
        $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']").prop("checked", false);

        mobile_platform = $(this).val();
        mobile_version = $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']:first").val();
        flag_mobile_platform = true;

        getMobileDeviceData(mobile_version);
    });



    // event to collect versions under andriod
    $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']").click(function () {
        mobile_version = $(this).val();
        getMobileDeviceData(mobile_version);
    });

    
    
    // event to collect versions under ios
    $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']").click(function () {
        mobile_version = $(this).val();
        getMobileDeviceData(mobile_version);
    });
    
    
    
    // function to handle saving and generating mobile configuration details in json
    $scope.save_mobile_configuration = function () {
        var configurationKeyObject = {};
        var configurationValueObject = {};

        var deviceName = $("select[name='device-name-select']").val();
        var deviceOrientation = $("select[name='device-orientation-select']").val();
        if (flag_survey_select) {
            if (flag_mobile_platform) {
                configurationValueObject["Platform"] = mobile_platform;
                var mobile_var = mobile_version.split(" ");
                configurationValueObject["Version"] = mobile_var[1];
                configurationValueObject["DeviceName"] = deviceName;
                configurationValueObject["Device_Orientation"] = deviceOrientation;

                configurationKeyObject["Survey Name"] = $(".col-md-2-survey-name-container").find("select").val();
                configurationKeyObject["For"] = "MOBILE";
                configurationKeyObject["Data"] = configurationValueObject;

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

        console.log("Mobile config data : " + JSON.stringify(configurationKeyObject));
    };

    
    
    // common utility to get device data based on mobile_version
    function getMobileDeviceData(mobile_version) {
        JDPAFactory.getMobileDeviceData(
            function (data, status) {
                console.log(JSON.stringify(data));
                $scope.mobileDeviceData = data;
                $scope.devices = data[mobile_version];
                console.log("getMobileDeviceData : " + data[mobile_version]);
            },
            function (err) {}
        );
    }

   

    // function to handle showing and hiding run button
    $scope.showConfigurationPanel = function () {
        $scope.run_button_hide = true;
    };

}]);