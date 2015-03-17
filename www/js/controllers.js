angular.module('pplTester.controllers', [])


.controller('LearnCtrl', function($scope, $state, Questions) {
  
  $scope.question = Questions.random();

  $scope.nextQuestion = function () {
    $scope.question = Questions.random();
  }

  $scope.$on( "$ionicView.enter", function() {
      if (Questions.changed()){
          $scope.nextQuestion();
      }
  });
})



.controller('QuizStartCtrl', function ($scope, Questions, Quizzes, $state) {
  if (Quizzes.currentQuiz) {
    // $state.go();
  }
  // $scope.availableQuizzes = Quizzes.getAvailableQuizzes();

})



.controller('QuestionsCtrl', function ($scope, Questions, Quizzes, $stateParams) {
  var quiz = this;
  quiz.test = Questions.randomQuestion();
  quiz.choice = {};

  quiz.checkAnswer = function (test, selectedAns) {
    quiz.answered = true;
    quiz.correct = this.test.correct === selectedAns;

    Questions.updateAnswered(test, quiz.correct);
  };

  quiz.nextTest = function () {
    quiz.answered = false;
    quiz.choice = {};
    quiz.test = Questions.randomQuestion();
  };

  $scope.$on( "$ionicView.enter", function() {
      if (Questions.changed() ) {
        quiz.test = Questions.randomQuestion();
      }
  });
})



.controller('QuizCtrl', function ($scope, Questions, Quizzes, $state, $stateParams, $ionicScrollDelegate) {
  var quiz = this;

  quiz.topics = Quizzes.getAllQuizzes();

  quiz.scrollBottom = function () {
      $ionicScrollDelegate.scrollBottom(true);
  }

  quiz.startQuiz = function (quiz) {
      Quizzes.startNewQuiz(quiz);

      $state.go('tab.quiz-question', {id: 0});
  };



  // console.log($stateParams.id);

  // $scope.$on( "$ionicView.enter", function() {
  //   console.log('entered view');
  // });
})

.controller('QuizQuestionsCtrl', function($scope, Quizzes, $state, $stateParams, $translate, $ionicPopup, Questions) {
  var quiz = this;
  
  quiz.test = '';
  quiz.choice = {};
  quiz.current = Quizzes.getCurrentQuiz();
  quiz.question = Quizzes.getQuizQuestion($stateParams.id);
  quiz.currentIdx = parseInt($stateParams.id) + 1;

  var submitAnswer = function(test, choice) {
      var correct = quiz.correct === choice;
          Questions.updateAnswered(test, choice);
          Quizzes.checkAnswer($stateParams.id, choice);

      if (parseInt($stateParams.id) === quiz.current.count -1 ) {
          Quizzes.endQuiz();
          $state.go('tab.quiz-summary');

      } else {
          $state.go('.', {
              id: parseInt($stateParams.id) + 1
          });
      }
  };

  var confirmEmpty = function (test, choice) {
    $translate(['are_you_sure', 'want_to_submit_empty', 'yes', 'no_return'])
    .then(function(translations) {
        var confirmPopup = $ionicPopup.confirm({
            title: translations['are_you_sure'],
            template: translations['want_to_submit_empty'],
            okText: translations['yes'],
            cancelText: translations['no_return'],
            okType: 'button-assertive'
        });

        confirmPopup.then(function(res) {
            if(res) {
                submitAnswer(test, choice);
            }
        });
      });3
  }


  quiz.checkAnswer = function (test, choice) {
    if (angular.equals(choice, {})) {
        confirmEmpty();
    } else {
        submitAnswer(test, choice);
    }
  };

  $scope.$on( "$ionicView.enter", function() {
      if ( quiz.current.ended && !Quizzes.scoreDisplayed ) {
        $state.go('tab.quiz-summary');
      }
  });

})



.controller('DashCtrl', function($scope, Questions, $ionicPopup, Quizzes, $translate, $state, $ionicModal) {
    $scope.topics = Questions.getAllTopics();
    $scope.prepareQuestions = Questions.prepareQuesitons;

    $ionicModal.fromTemplateUrl('stats-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.statsModal = modal;
    });

    $ionicModal.fromTemplateUrl('resources-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.resourcesModal = modal;
    });

    $ionicModal.fromTemplateUrl('about-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.aboutModal = modal;
    });

    $scope.confirmStart = function() {
      $translate(['quiz_in_progress', 'want_to_restart', 'restart_quiz', 'return_to_quiz'])
      .then(function(translations) {
          var confirmPopup = $ionicPopup.confirm({
              title: translations['quiz_in_progress'],
              template: translations['want_to_restart'],
              okText: translations['restart_quiz'],
              cancelText: translations['return_to_quiz'],
              okType: 'button-assertive'
          });

          confirmPopup.then(function(res) {
              if(res) {
                $state.go('tab.quiz.new');
              } else {
                $state.go('tab.quiz', {id: Quizzes.currentQuestion.number});
              }
          });
      });
    };

    $scope.startNewQuiz = function () {
        if (Quizzes.quizInProgress) {
            $scope.confirmStart();
        } else {
            $state.go('tab.quiz.new')
        }
    };

    $scope.showModal = function(modal) {
      modal.show();
    }

    $scope.closeModal = function(modal) {
      modal.hide();
    }
    
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });


});
