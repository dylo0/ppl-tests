angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }

})

.factory('Questions', function ($http) {
  var questions;
  var answeredQuestions = window.localStorage['answeredQuestions'] || [];
  var triedQuestions = window.localStorage['triedQuestions'] || []
  var promise = $http.get('questions.json').success(function(data) {
    questions = data;
  });

  function getRandomArbitary (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
  };

  function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  };

  return {
    init: function () {
      return promise;
    },

    all: function () {
      return questions;
    },

    next: function (number) {
      return questions[number + 1 % questions.length];
    },

    random: function () {
      var num = getRandomArbitary(0, questions.length);
      var randomNum = Math.random();

      if (answeredQuestions.indexOf(num) !== -1 && randomNum < 0.3 
        || triedQuestions.indexOf(num) !== -1 && randomNum < 0.7) {

        return this.random();
      
      } else {
        return questions[num];
      }

    },

    randomTest: function () {
      var randQ = this.random();
      var answers = [{ans: 'a', msg: randQ.A},{ans: 'b', msg: randQ.B},{ans: 'c', msg: randQ.C},{ans: 'd', msg: randQ.D}];
      var arr = shuffleArray(answers);
      var asd = {
        q: randQ.q,
        ans: answers,
        correct: answers.ANSWER
      }
      console.log(randQ.A)
      console.log(asd);
      return asd;

    },

    //updates answered questions array for later usage
    updateAnswered: function (test, result) {
      console.log('answered', result);
    }
  }
});
