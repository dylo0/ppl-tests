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
  quiz.test = Questions.randomTest();
  quiz.choice = {};

  quiz.checkAnswer = function (test, selectedAns) {
    quiz.answered = true;
    quiz.correct = this.test.correct === selectedAns;

    Questions.updateAnswered(test, quiz.correct);
  };

  quiz.nextTest = function () {
    quiz.answered = false;
    quiz.choice = {};
    quiz.test = Questions.randomTest();
  };

  $scope.$on( "$ionicView.enter", function() {
      if (Questions.changed() ) {
        quiz.test = Questions.randomTest();
      }
  });
})

.controller('QuizCtrl', function (Questions, Quizzes, $state, $stateParams) {
  var quiz = this;
  quiz.test = Questions.randomTest();
  quiz.choice = {};

  quiz.lastQuestion = $stateParams.id === Quizzes.currentQuiz.questions.length;

  quiz.topics = Quizzes.getAllTopics();

  quiz.checkAnswer = function (test, selectedAns) {
    quiz.answered = true;
    quiz.correct = this.test.correct === selectedAns;

    Questions.updateAnswered(test, quiz.correct);
  };

  quiz.nextTest = function () {
    if (quiz.lastQuestion) {
      $state.go('tab.quiz.finish');
    } else {
      $state.go('tab.quiz.question', {
        id: $stateParams.id + 1
      });
    }
  };
})

.controller('DashCtrl', function($scope, Questions, $ionicPopup, Quizzes, $translate, $state) {
    $scope.topics = Questions.getAllTopics();
    $scope.prepareQuestions = Questions.prepareQuesitons;

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
});
