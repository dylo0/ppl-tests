angular.module('starter.services', [])

.factory('Questions', function ($http) {
  var questions;
  var answeredQuestions = window.localStorage['answeredQuestions'] || [];
  var triedQuestions = window.localStorage['triedQuestions'] || []
  var promise = $http.get('data/questions.json').success(function(data) {
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
      console.log('asd');
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

    getAllTopics: function () {
      return [
        {
          name: 'prawo',
          title: 'prawo lotnicze',
          quizAvailable: false,
          quizCount: 30,
          quizTime: 45
        },
        {
          name: 'szybowce',
          title: 'ogólna wiedza o szybowcu',
          quizAvailable: false,
          quizCount: 15,
          quizTime: 30
        },
        {
          name: 'planowanie',
          title: 'Osiągi i planowanie lotów',
          quizAvailable: false,
          quizCount: 20,
          quizTime: 60
        },
        {
          name: 'medycyna',
          title: 'Człowiek - możliwości i ograniczenia',
          quizAvailable: false,
          quizCount: 12,
          quizTime: 30
        },
        {
          name: 'meteorologia',
          title: 'Meteorologia',
          quizAvailable: false,
          quizCount: 10,
          quizTime: 30
        },
        {
          name: 'nawigacja',
          title: 'Nawigacja',
          quizAvailable: false,
          quizCount: 24,
          quizTime: 60
        },
        {
          name: 'procedury',
          title: 'Procedury operacyjne',
          quizAvailable: false,
          quizCount: 12,
          quizTime: 30
        },
        {
          name: 'zasady',
          title: 'Zasady lotu',
          quizAvailable: false,
          quizCount: 16,
          quizTime: 45
        },
        {
          name: 'lacznosc',
          title: 'Łączność',
          quizAvailable: false,
          quizCount: 12,
          quizTime: 30
        },
        {
          name: 'bezpieczenstwo',
          title: 'Ogólne bezpieczeństwo lotów',
          quizAvailable: false,
          quizCount: 16,
          quizTime: 30
        },
        {
          name: 'samolot',
          title: 'Ogólna wiedza o samolocie',
          quizAvailable: false,
          quizCount: 16,
          quizTime: 30
        }
      ];
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

    availableQuizzes: function () {
      var topics = Questions.getAllTopics();
      var quizzes = [];
      
      angular.forEach(topic, function(topic) {
        if (topic.quizAvailable) {
          quizzes.push(topic);
        }
      })

      return quizzes;
    }
  };
});

