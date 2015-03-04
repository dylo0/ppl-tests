angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, $state, Chats, Questions) {
  $scope.chats = Chats.all();
  $scope.question = Questions.random();

  $scope.nextQuestion = function () {
    $scope.question = Questions.random();
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Questions) {
  $scope.test = Questions.randomTest();
  $scope.choice = 'asd';

  $scope.checkAnswer = function (test, selectedAns) {
    $scope.answered = true;
    $scope.answerWasCorrect = test.correct === selectedAns;

    Questions.updateAnswered(test, $scope.answerWasCorrect);
  };

  $scope.nextTest = function () {
    $scope.test = Questions.randomTest();
  };
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
