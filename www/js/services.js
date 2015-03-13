angular.module('pplTester.services', [])

.factory('Questions', function ($http) {
  var questions;
  var answeredQuestions = window.localStorage['answeredQuestions'] || [];
  var triedQuestions = window.localStorage['triedQuestions'] || []
  var availableQuestions;
  var questionsChanged = true;

  var allTopics = [
    {
      name: 'prawo',
      title: 'prawo lotnicze',
      quizCount: 30,
      quizTime: 45
    },
    {
      name: 'planowanie',
      title: 'Osiągi i planowanie lotów',
      quizCount: 20,
      quizTime: 60
    },
    {
      name: 'medycyna',
      title: 'Człowiek - możliwości i ograniczenia',
      quizCount: 12,
      quizTime: 30
    },
    {
      name: 'meteorologia',
      title: 'Meteorologia',
      quizCount: 10,
      quizTime: 30
    },
    {
      name: 'nawigacja',
      title: 'Nawigacja',
      quizCount: 24,
      quizTime: 60
    },
    {
      name: 'procedury',
      title: 'Procedury operacyjne',
      quizCount: 12,
      quizTime: 30
    },
    {
      name: 'zasady',
      title: 'Zasady lotu',
      quizCount: 16,
      quizTime: 45
    },
    {
      name: 'lacznosc',
      title: 'Łączność',
      quizCount: 12,
      quizTime: 30
    },
    {
      name: 'bezpieczenstwo',
      title: 'Ogólne bezpieczeństwo lotów',
      quizCount: 16,
      quizTime: 30
    },
    {
      name: 'samolot',
      title: 'Ogólna wiedza o samolocie',
      quizCount: 16,
      quizTime: 30
    }
  ];

  angular.forEach(allTopics, function(topic) {
    topic.enabled = true;
  })

  var promise = $http.get('data/questions_ULC.json').success(function(data) {
    questions = data;
    prepareQuesitons();
  });

  function prepareQuesitons () {
    availableQuestions = [];
    questionsChanged = true;

    angular.forEach(allTopics, function(topic) {
      if (topic.enabled){
        availableQuestions = availableQuestions.concat(questions[topic.name]);
      }
    });
  };

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
      return availableQuestions;
    },

    next: function (number) {
      questionsChanged = false;
      return availableQuestions[number + 1 % availableQuestions.length];
    },

    random: function () {
      questionsChanged = false;

      var num = getRandomArbitary(0, availableQuestions.length);
      var randomNum = Math.random();

      if (answeredQuestions.indexOf(num) !== -1 && randomNum < 0.3 
        || triedQuestions.indexOf(num) !== -1 && randomNum < 0.7) {

        return this.random();
      
      } else {
        return availableQuestions[num];
      }
    },

    changed: function () {
      return questionsChanged;
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

    prepareQuesitons: prepareQuesitons,

    getAllTopics: function () {
      return allTopics;
    },
    //updates answered questions array for later usage
    updateAnswered: function (test, result) {
      console.log('answered', result);
    }
  }
})

.factory('Quizzes', function (Questions) {
  return {
    currentQuiz: {
      currentQuestion: 4,
      topic: 'bezpieczeństwo',
      questions: [1,2,3,4,5,6,7,8,9],
    },

    getAllTopics: function () {
      var topics = Questions.getAllTopics();
      var quizzes = [];
      
      angular.forEach(topics, function(topic) {
        if (topic.enabled) {
          quizzes.push(topic);
        }
      })

      return quizzes;
    }
  };
});

