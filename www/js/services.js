angular.module('starter.services', [])

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
      var answers = [{ans: 'A', msg: randQ.A},{ans: 'B', msg: randQ.B},{ans: 'C', msg: randQ.C},{ans: 'D', msg: randQ.D}];
      var arr = shuffleArray(answers);
      var asd = {
        q: randQ.q,
        ans: answers,
        correct: randQ.ANSWER
      }
      
      return asd;

    },

    //updates answered questions array for later usage
    updateAnswered: function (test, result) {
      console.log('answered', result);
    }
  }
});
