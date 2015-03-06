angular.module('starter.controllers', [])


.controller('LearnCtrl', function($scope, $state, Questions) {
  
  $scope.question = Questions.random();

  $scope.nextQuestion = function () {
    $scope.question = Questions.random();
  }
})


.controller('QuizCtrl', function(Questions) {
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
})

.controller('DashCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
