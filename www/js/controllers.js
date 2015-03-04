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

.controller('FriendsCtrl', function(Questions) {
  var friends = this;
  friends.test = Questions.randomTest();
  friends.choice = {};


  friends.checkAnswer = function (test, selectedAns) {
    friends.answered = true;
    friends.correct = this.test.correct === selectedAns;

    Questions.updateAnswered(test, friends.correct);
  };

  friends.nextTest = function () {
    friends.answered = false;
    friends.choice = {};
    friends.test = Questions.randomTest();
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
