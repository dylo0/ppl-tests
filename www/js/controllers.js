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

        $scope.$on("$ionicView.enter", function () {
            $scope.quizInProgress = Quizzes.isQuizInProgress();
        });
    })


    .controller('LearnCtrl', function ($scope, Questions) {
        var learn = this;
        learn.question = Questions.getRandomQuestion();

        learn.displayCorrect = function() {
            angular.forEach(learn.question.ans, function( question ) {
                if (question.ans === learn.question.correct) {
                    learn.correctAnswer = question.msg;
                    learn.checked = true;
                    return;
                }
            });
        }

        learn.nextQuestion = function (declaredAnswer) {
            Questions.updateAnswered(learn.question, declaredAnswer);
            learn.checked = false;
            learn.question = Questions.getRandomQuestion();
        };

        $scope.$on("$ionicView.enter", function () {
            if (Questions.changed()) {
                learn.nextQuestion();
            }
        });
    })


    .controller('QuestionsCtrl', function ($scope, Questions) {
        var questionCtrl = this;
        questionCtrl.test = Questions.getRandomQuestion();
        questionCtrl.choice = {};

        questionCtrl.checkAnswer = function (test, selectedAns) {
            questionCtrl.answered = true;
            questionCtrl.correct = this.test.correct === selectedAns;

            Questions.updateAnswered(test, questionCtrl.correct);
        };

        questionCtrl.nextTest = function () {
            questionCtrl.answered = false;
            questionCtrl.choice = {};
            questionCtrl.test = Questions.randomQuestion();
        };

        $scope.$on("$ionicView.beforeEnter", function () {
            if (Questions.changed()) {
                questionCtrl.test = Questions.randomQuestion();
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

        $scope.$on("$ionicView.beforeEnter", function () {
            quiz.choice = {};
            quiz.question = Quizzes.getQuizQuestion($stateParams.id);
            quiz.currentIdx = parseInt($stateParams.id) + 1;
            quiz.current = Quizzes.getCurrentQuiz();

            if (quiz.current.ended && !quiz.current.scoreDisplayed) {
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

