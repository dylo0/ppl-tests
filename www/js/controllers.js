angular.module('starter.controllers', [])


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
    state.go();
  }
  $scope.availableQuizzes = Quizzes.getAvailableQuizzes();

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

.controller('DashCtrl', function($scope, Questions, $ionicPopup, Quizzes) {
  $scope.topics = Questions.getAllTopics();

  $scope.prepareQuestions = Questions.prepareQuesitons;

  $scope.confirmStart = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Quiz in progress',
      template: 'Are you sure you want to start new quiz? Existing quiz data will be lost'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.startNewQuiz = function () {
    if (Quizzes.quizInProgress) {
      $scope.confirmStart();
    } else {
      Quizzes.startNewQuiz;
      //should ask for topic
      // and display start screen of quiz
    }
  };
});
