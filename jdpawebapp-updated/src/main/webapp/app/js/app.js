"use strict"

var qaApp = angular.module('qaApp', ['ngRoute', 'jdpaServices']);

qaApp.config(function ($routeProvider) {
    $routeProvider
        .when('/main', {
            templateUrl: 'views/main.html'
        })
        .when('/file/:outputFile/:for', {
            controller: 'FileController',
            templateUrl: 'views/file.html'
        })
        .when('/question/Web/:filename', {
            controller: 'QuestionController',
            templateUrl: 'views/question.html'
        })
        .when('/question/Mobile/:filename', {
            controller: 'QuestionMobileController',
            templateUrl: 'views/questionMobile.html'
        })
        .when('/testcase/:filename', {
            controller: 'TestcaseController',
            templateUrl: 'views/testcase.html'
        })
        .when('/edit/Testcase', {
            controller: 'EditTestcaseController',
            templateUrl: 'views/edit_testcase.html'
        })
        .when('/edit/Question', {
            controller: 'EditQuestionController',
            templateUrl: 'views/edit_question.html'
        })
        .when('/run/Web', {
            controller: 'RunForWebController',
            templateUrl: 'views/runForWeb.html'
        })
        .when('/run/Mobile', {
            controller: 'RunForMobileController',
            templateUrl: 'views/runForMobile.html'
        })
        .when('/report', {
            controller: 'ReportController',
            templateUrl: 'views/report.html'
        })
        .otherwise({
            redirectTo: '/main'
        });

});
