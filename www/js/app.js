// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('pplTester', ['ionic', 'pplTester.controllers', 'pplTester.services', 'pascalprecht.translate'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {

        $translateProvider.preferredLanguage("pl");
        $translateProvider.fallbackLanguage("en");


        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                resolve: {
                    questions: function (Questions) {
                        return Questions.init;
                    }
                }
            })

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('tab.learn', {
                url: '/learn',
                views: {
                    'tab-learn': {
                        template: '<ion-nav-view></ion-nav-view>'
                    }
                },
                onEnter: function ($state, Quizzes, $timeout) {
                    if (Quizzes.isQuizInProgress()) {
                        $timeout(function () {
                            $state.go('tab.learn.not-available')
                        });
                    } else {
                        $timeout(function () {
                            $state.go('tab.learn.question');

                        })
                    }
                }
            })

            .state('tab.learn.question', {
                templateUrl: 'templates/tab-learn.html',
                controller: 'LearnCtrl as learn'
            })

            .state('tab.learn.not-available', {
                templateUrl: 'templates/tab-not-available.html'
            })

            .state('tab.questions', {
                url: '/questions',
                views: {
                    'tab-questions': {
                        template: '<ion-nav-view></ion-nav-view>'
                    }
                },
                onEnter: function ($state, Quizzes, $timeout) {
                    if (Quizzes.isQuizInProgress()) {
                        $timeout(function () {
                            $state.go('tab.questions.not-available')
                        });
                    } else {
                        $timeout(function () {
                            $state.go('tab.questions.question');

                        })
                    }
                }
            })
            .state('tab.questions.question', {
                templateUrl: 'templates/tab-questions.html',
                controller: 'QuestionsCtrl as fr'
            })

            .state('tab.questions.not-available', {
                templateUrl: 'templates/tab-not-available.html'
            })

            .state('tab.quiz', {
                cache: false,
                url: '/quiz',
                views: {
                    'tab-quiz': {
                        templateUrl: 'templates/tab-quiz.html',

                        controller: 'QuizCtrl as qz'
                    }
                }
            })
            .state('tab.quiz-summary', {
                cache: false,
                url: '/quiz/summary',
                views: {
                    'tab-quiz': {
                        templateUrl: 'templates/tab-quiz-summary.html',
                        controller: 'QuizSummaryCtrl as qs'
                    }
                }
            })
            .state('tab.quiz-question', {
                url: '/quiz/:id',
                views: {
                    'tab-quiz': {
                        templateUrl: 'templates/tab-quiz-question.html',
                        controller: 'QuizQuestionsCtrl as qq'
                    }
                }
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/dash');

    });
