'use strict'
/* services */
var jdpaServices = angular.module('jdpaServices', []);

jdpaServices.factory('JDPAFactory', function ($http) {
    return {
        postTestCaseJSON: function (surveyName, success, error) {
            console.log("surveyName: " + JSON.stringify(surveyName));
            var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/testcasegenrater";
            $http.post(url, surveyName).success(function (result) {
                success(result);
            }).error(error);
        },
        postQuestionJSON: function (questionJSON, success, error) {
            console.log("service questionJSON: " + JSON.stringify(questionJSON));
            var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/questiondata";
            $http.post(url, questionJSON).success(function (result) {
                success(result);
            }).error(error);
        },
        // getting survey names related to question
        getSurveyNamesForMobile: function (success, error) {
         //   var url = "/resources/testcaseCollection/surveyNameCollection.json";
        	var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/listofSurveynameformobile";
            $http.get(url).success(function (result) {
                success(result);
            }).error(error);
        },
        
        getSurveyNamesForWeb: function (success, error) {
            //   var url = "/resources/testcaseCollection/surveyNameCollection.json";
           	var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/listofSurveynameforweb";
               $http.get(url).success(function (result) {
                   success(result);
               }).error(error);
           },
        
        getQuestionJSONToEdit: function (surveyNameCollection,success, error) {
            //var url = "/resources/questionCollection/" + surveyNameCollection + ".json";
        	var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/questionOldData";
        	$http.post(url , surveyNameCollection).success(function (result) {
                success(result);
            }).error(error);
        },
        // getting survey names related to testcase
        getSurveyNamesFromTestcaseCollection: function (success, error) {
         //   var url = "/resources/testcaseCollection/surveyNameCollection.json";
        	var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/listofSurveyname";
            $http.get(url).success(function (result) {
                success(result);
            }).error(error);
        },
        getTestcaseNames: function (surveyCollectionName, success, error) {
        	var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/listofTestcaseName";
          //  var url = "/resources/testcaseCollection/"+surveyCollectionName+".json";
          $http.post(url,surveyCollectionName).success(function (result) {
                success(result);
            }).error(error);
        },
        postEditedQuestion: function (editedQuestionDocument, success, error) {
            console.log("Edited Question Document");
            console.log(JSON.stringify(editedQuestionDocument));
            var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/questionUpdate";
            $http.post(url, editedQuestionDocument).success(function (result) {
                success(result);
            }).error(error);
        },
        postEditedTestcase: function (editedTestcaseDocument, success, error) {
            console.log("Edited Testcase Document");
            console.log(JSON.stringify(editedTestcaseDocument));
            var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/testcaseupdate";
            $http.post(url,editedTestcaseDocument).success(function (result) {
                success(result);
            }).error(error);
        },
        postConfiguration: function (ConfigurationDetails, success, error) {
            console.log("Configuration in service: " + JSON.stringify(ConfigurationDetails));
            var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/configurationfile";
            $http.post(url,ConfigurationDetails).success(function (result) {
                success(result);
            }).error(error);
        },
        getMobileDeviceData: function (success, error) {
            var url = "./resources/mobile_device_configData.json";
            $http.get(url).success(function (result) {
                success(result);
            }).error(error);
        },
        getBuildNoJSONS: function (success, error) {
            var url = '/resources/TestResult_Build_No_XXX-1001.json';
            $http.get(url).
            success(function (data, status, headers, config) {
                //buildNo = data.BuildNo;
                success(buildNo);
            }).
            error(function (data, status, headers, config) {

            });
        },
        getReportJSON: function (buildId, success, error) {
//            var url = "http://50.50.50.168:2015/jdpa-coreframework-ui/rest/qascript/" + buildId;
            var url = "http://50.50.50.168:2016/jdpawebapp-Updated/rest/jdpawebapp/getLatestTestReports";
//            var url = '/resources/'+buildId;
            $http.get(url).success(function (result) {
                success(result);
            }).error(error);
            
        }
    };
});