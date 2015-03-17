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
      count: 30,
      time: 45
    },
    {
      name: 'planowanie',
      title: 'Osiągi i planowanie lotów',
      count: 20,
      time: 60
    },
    {
      name: 'medycyna',
      title: 'Człowiek - możliwości i ograniczenia',
      count: 12,
      time: 30
    },
    {
      name: 'meteorologia',
      title: 'Meteorologia',
      count: 10,
      time: 30
    },
    {
      name: 'nawigacja',
      title: 'Nawigacja',
      count: 24,
      time: 60
    },
    {
      name: 'procedury',
      title: 'Procedury operacyjne',
      count: 12,
      time: 30
    },
    {
      name: 'zasady',
      title: 'Zasady lotu',
      count: 16,
      time: 45
    },
    {
      name: 'lacznosc',
      title: 'Łączność',
      count: 12,
      time: 30
    },
    {
      name: 'bezpieczenstwo',
      title: 'Ogólne bezpieczeństwo lotów',
      count: 16,
      time: 30
    },
    {
      name: 'samolot',
      title: 'Ogólna wiedza o samolocie',
      count: 3, // testing - should be 16
      time: 30
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

  var prepareQuestion = function (question) {
      var answers = [{ans: 'A', msg: question.A},{ans: 'B', msg: question.B},{ans: 'C', msg: question.C},{ans: 'D', msg: question.D}];
      shuffleArray(answers);
      
      return {
        q: question.q,
        ans: answers,
        correct: question.ANSWER
      };
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

    randomQuestion: function () {
      questionsChanged = false;

      var randQ = this.random();
      var question = prepareQuestion(randQ);
      
      return question;
    },

    getQuestions: function (topic, count) {
      if (count > questions[topic].length) {
          return console.error("Too many questions requested");
      }

      var allTopicQuestions = angular.copy(questions[topic]);
      shuffleArray(allTopicQuestions);

      var requestedQuestions = count ? allTopicQuestions.slice(0, count) : allTopicQuestions;
      var preparedQuestions = [];

      angular.forEach(requestedQuestions, function(question) {
          preparedQuestions.push( prepareQuestion(question) );
      });

      return preparedQuestions;
    },


    getAllTopics: function () {
      return allTopics;
    },

    //updates answered questions array for later usage / stats
    updateAnswered: function (test, result) {
      console.log('answered', result);
    },

    prepareQuesitons: prepareQuesitons
  }
})

.factory('Quizzes', function (Questions, $timeout, $state) {
  var currentQuiz = {
    ended: false,
    currentQuestion: 4,
    topic: 'bezpieczeństwo',
    count: 12,
    questions: [1,2,3,4,5,6,7,8,9],
    answers: []
  };

  var endTimeout;
  var scoreDisplayed = false;

  var countScore = function (quiz) {
    correctAnswers = 0;
    answersKey = [];
    angular.forEach(quiz.questions, function(question, idx) {
      var correct = question.correct === quiz.answers[idx];
      answersKey.push(correct);
      
      if ( correct ) {
        correctAnswers += 1;
      }
    });

    return {
      correct: correctAnswers,
      percentage: correctAnswers / quiz.count,
      key: answersKey
    }
  };

  return {
    getAllQuizzes: function () {
      return Questions.getAllTopics();
    },

    endQuiz: function () {
      currentQuiz.ended = true;
      var score =countScore(currentQuiz);

      currentQuiz.score = score;
    },

    startNewQuiz: function (quiz) {
      scoreDisplayed = false;

      if (endTimeout) {
        $timeout.cancel(endTimeout);
      }

      endTimeout = $timeout(function () {
        endQuiz();
      }, quiz.time * 60000);


      currentQuiz = {
          //currentQuestion: 4,
          topic: quiz.topic,
          count: quiz.count,
          questions: Questions.getQuestions(quiz.name, quiz.count),
          answers: []
      }
    },
    
    getCurrentQuiz: function() {
      return currentQuiz;
    },

    getQuizQuestion: function(idx) {
      return currentQuiz.questions[idx];
    },

    checkAnswer: function (idx, ans) {
      currentQuiz.answers[idx] = ans;
    },

    currentQuiz: currentQuiz,
    scoreDisplayed: scoreDisplayed

  };
});

