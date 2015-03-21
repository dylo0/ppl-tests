angular.module('pplTester.controllers', [])
    .controller('DashCtrl', function ($scope, Questions, $ionicPopup, Quizzes, $translate, $state, $ionicModal) {
        $scope.topics = Questions.getAllTopics();
        $scope.prepareQuestions = Questions.prepareQuesitons;

        $ionicModal.fromTemplateUrl('stats-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.statsModal = modal;
        });

        $ionicModal.fromTemplateUrl('resources-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.resourcesModal = modal;
        });

        $ionicModal.fromTemplateUrl('about-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.aboutModal = modal;
        });

        $scope.startNewQuiz = function () {
            $state.go('tab.quiz');
        };

        $scope.endCurrentQuiz = function () {
            $translate(['confirm', 'want_to_end', 'end_quiz', 'return'])
                .then(function (translations) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: translations['confirm'],
                        template: translations['want_to_end'],
                        okText: translations['end_quiz'],
                        cancelText: translations['return'],
                        okType: 'button-assertive'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {
                            Quizzes.endQuiz();
                            $state.go('tab.quiz-summary');
                        }
                    });
                });
        };

        $scope.showModal = function (modal) {
            modal.show();
        };

        $scope.closeModal = function (modal) {
            modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        $scope.$on("$ionicView.beforeEnter", function () {
            $scope.quizInProgress = Quizzes.isQuizInProgress();
        });
    })


    .controller('LearnCtrl', function ($scope, Questions) {
        $scope.question = Questions.random();

        $scope.nextQuestion = function () {
            $scope.question = Questions.random();
        };

        $scope.$on("$ionicView.beforeEnter", function () {
            if (Questions.changed()) {
                $scope.nextQuestion();
            }
        });
    })


    .controller('QuestionsCtrl', function ($scope, Questions) {
        var questinCtrl = this;
        questinCtrl.test = Questions.randomQuestion();
        questinCtrl.choice = {};

        questinCtrl.checkAnswer = function (test, selectedAns) {
            questinCtrl.answered = true;
            questinCtrl.correct = this.test.correct === selectedAns;

            Questions.updateAnswered(test, questinCtrl.correct);
        };

        questinCtrl.nextTest = function () {
            questinCtrl.answered = false;
            questinCtrl.choice = {};
            questinCtrl.test = Questions.randomQuestion();
        };

        $scope.$on("$ionicView.beforeEnter", function () {
            if (Questions.changed()) {
                questinCtrl.test = Questions.randomQuestion();
            }
        });
    })


    .controller('QuizCtrl', function ($scope, Questions, Quizzes, $state, $stateParams, $ionicScrollDelegate) {
        var quiz = this;

        quiz.topics = Quizzes.getAllQuizzes();

        quiz.scrollBottom = function () {
            $ionicScrollDelegate.scrollBottom(true);
        };

        quiz.startQuiz = function (quiz) {
            Quizzes.startNewQuiz(quiz);

            $state.go('tab.quiz-question', {id: 0});
        };
    })

    .controller('QuizQuestionsCtrl', function ($scope, Quizzes, $state, $stateParams, $translate, $ionicPopup, Questions) {
        var quiz = this;

        quiz.test = '';
        quiz.choice = {};
        quiz.current = Quizzes.getCurrentQuiz();
        quiz.question = Quizzes.getQuizQuestion($stateParams.id);
        quiz.currentIdx = parseInt($stateParams.id) + 1;

        $scope.$on("$ionicView.beforeEnter", function () {
            quiz.current = Quizzes.getCurrentQuiz();
            if (quiz.current.ended && !quiz.current.scoreDisplayed) {
                console.log('ended');
                $state.go('tab.quiz-summary');
            }
        });

        var submitAnswer = function (test, choice) {
            //var correct = quiz.correct === choice;
            Questions.updateAnswered(test, choice);
            Quizzes.checkAnswer($stateParams.id, choice);

            if (parseInt($stateParams.id) === quiz.current.count - 1) {
                Quizzes.endQuiz();
                $state.go('tab.quiz-summary');

            } else {
                $state.go('.', {
                    id: parseInt($stateParams.id) + 1
                });
            }
        };

        var confirmEmpty = function (test, choice) {
            $translate(['confirm', 'want_to_submit_empty', 'yes', 'no_return'])
                .then(function (translations) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: translations['confirm'],
                        template: translations['want_to_submit_empty'],
                        okText: translations['yes'],
                        cancelText: translations['no_return'],
                        okType: 'button-assertive'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {
                            submitAnswer(test, choice);
                        }
                    });
                });
        };

        quiz.checkAnswer = function (test, choice) {
            if (angular.equals(choice, {})) {
                confirmEmpty();
            } else {
                submitAnswer(test, choice);
            }
        };
    })

    .controller('QuizSummaryCtrl', function ($scope, Questions, Quizzes) {
        this.quiz = Quizzes.getCurrentQuiz();

        $scope.$on("$ionicView.enter", function () {
            Quizzes.summaryShown();
        });
    });

