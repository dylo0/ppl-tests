angular.module('pplTester.services', [])

    .factory('Questions', function ($http) {
        var questions;
        var answeredQuestions = window.localStorage['answeredQuestions'] || [];
        var triedQuestions = window.localStorage['triedQuestions'] || [];
        var availableQuestions;
        var questionsChanged = true;

        var allTopics = [
            {
                name: 'prawo',
                title: 'prawo lotnicze',
                count: 30,
                time: 45,
                minimumScore: 70,
                firstIdx: 0
            },
            {
                name: 'samolot',
                title: 'Ogólna wiedza o samolocie',
                count: 3, // testing - should be 16
                time: 30,
                minimumScore: 70,
                firstIdx: 511
            },
            {
                name: 'planowanie',
                title: 'Osiągi i planowanie lotów',
                count: 20,
                time: 60,
                minimumScore: 70,
                firstIdx: 742
            },
            {
                name: 'medycyna',
                title: 'Człowiek - możliwości i ograniczenia',
                count: 12,
                time: 30,
                minimumScore: 70,
                firstIdx: 797
            },
            {
                name: 'meteorologia',
                title: 'Meteorologia',
                count: 10,
                time: 30,
                minimumScore: 70,
                firstIdx: 1104
            },
            {
                name: 'nawigacja',
                title: 'Nawigacja',
                count: 24,
                time: 60,
                minimumScore: 70,
                firstIdx: 1243
            },
            {
                name: 'procedury',
                title: 'Procedury operacyjne',
                count: 12,
                time: 30,
                minimumScore: 70,
                firstIdx: 1434
            },
            {
                name: 'zasady',
                title: 'Zasady lotu',
                count: 16,
                time: 45,
                minimumScore: 70,
                firstIdx: 1508
            },
            {
                name: 'lacznosc',
                title: 'Łączność',
                count: 12,
                time: 30,
                minimumScore: 70,
                firstIdx: 1897
            },
            {
                name: 'bezpieczenstwo',
                title: 'Ogólne bezpieczeństwo lotów',
                count: 16,
                time: 30,
                minimumScore: 70,
                firstIdx: 1903
            }
        ];


        angular.forEach(allTopics, function (topic) {
            topic.enabled = true;
        });

        var promise = $http.get('data/questions_ULC.json').success(function (data) {
            questions = data;
            prepareQuesitons();
        });

        function prepareQuesitons() {
            availableQuestions = [];
            questionsChanged = true;

            angular.forEach(allTopics, function (topic) {
                if (topic.enabled) {
                    availableQuestions = availableQuestions.concat(questions[topic.name]);
                }
            });
        }

        function getRandomArbitary(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }

        var getQuestionTopic = function (question) {
            for (var i = allTopics.length - 1; i >= 0; i--) {

                if (question.id >= allTopics[i].firstIdx) {
                    return allTopics[i].title;
                }
            }
        };

        var prepareQuestion = function (question) {
            var answers = [
                {ans: 'A', msg: question.A},
                {ans: 'B', msg: question.B},
                {ans: 'C', msg: question.C},
                {ans: 'D', msg: question.D}
            ];
            shuffleArray(answers);

            return {
                q: question.q,
                ans: answers,
                correct: question.ANSWER,
                topic: getQuestionTopic(question),
                id: question.id
            };
        };

        var randomQuestion = function () {

            var num = getRandomArbitary(0, availableQuestions.length);
            var randomNum = Math.random();

            if (answeredQuestions.indexOf(num) !== -1 && randomNum < 0.3
                || triedQuestions.indexOf(num) !== -1 && randomNum < 0.7) {

                return randomQuestion();

            } else {
                return availableQuestions[num];
            }
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

            changed: function () {
                return questionsChanged;
            },

            getRandomQuestion: function () {
                questionsChanged = false;
                var randQ = randomQuestion();
                return prepareQuestion(randQ);
            },

            getQuestions: function (topic, count) {
                if (count > questions[topic].length) {
                    return console.error("Too many questions requested");
                }

                var allTopicQuestions = angular.copy(questions[topic]);
                shuffleArray(allTopicQuestions);

                var requestedQuestions = count ? allTopicQuestions.slice(0, count) : allTopicQuestions;
                var preparedQuestions = [];

                angular.forEach(requestedQuestions, function (question) {
                    preparedQuestions.push(prepareQuestion(question));
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

    .factory('Quizzes', function (Questions, $timeout, $interval, $ionicPopup, $state, $translate) {
        var currentQuiz = {
            ended: false,
            currentQuestion: 4,
            topic: 'bezpieczeństwo',
            count: 12,
            questions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            answers: [],
            scoreDisplayed: false
        };
        var quizInProgress = false;
        var endTimeout;

        var countScore = function (quiz) {
            correctAnswers = 0;
            answersKey = [];

            angular.forEach(quiz.questions, function (question, idx) {
                var ans = quiz.answers[idx];
                var correct = ans === undefined ? undefined : question.correct === ans;

                answersKey.push(correct);

                if (correct) {
                    correctAnswers += 1;
                }
            });

            return {
                correct: correctAnswers,
                result: ( 100 * correctAnswers ) / quiz.count,
                passed: this.result > quiz.minimumScore,
                key: answersKey
            }
        };

        return {
            getAllQuizzes: function () {
                return Questions.getAllTopics();
            },

            endQuiz: function () {
                if (endTimeout) {
                    $interval.cancel(endTimeout);
                }

                currentQuiz.ended = true;
                quizInProgress = false;
                currentQuiz.score = countScore(currentQuiz);
            },

            startNewQuiz: function (quiz) {
                var that = this;

                currentQuiz = {
                    title: quiz.title,
                    count: quiz.count,
                    minimumScore: quiz.minimumScore,
                    questions: Questions.getQuestions(quiz.name, quiz.count),
                    answers: [],
                    scoreDisplayed: false,
                    ended: false,
                    timeLeft: quiz.time * 1000 * 60,
                    time: quiz.time
                };

                endTimeout = $interval(function () {
                    currentQuiz.timeLeft = currentQuiz.timeLeft - 1000;

                    if (currentQuiz.timeLeft <= 0) {
                        $interval.cancel(endTimeout);   
                        that.endQuiz();
                        
                        $translate(['quiz_ended', 'max_time_reached'])
                        .then(function (translations) {
                            var alertPopup = $ionicPopup.alert({
                                title: translations['quiz_ended'],
                                template: translations['max_time_reached']
                            });
                            
                            alertPopup.then(function(res) {
                                $state.go('tab.quiz-summary');
                            });
                        });
                    }


                }, 1000);

                quizInProgress = true;
            },

            summaryShown: function () {
                currentQuiz.scoreDisplayed = true;
            },

            getCurrentQuiz: function () {
                return currentQuiz;
            },

            getQuizQuestion: function (idx) {
                return currentQuiz.questions[idx];
            },

            checkAnswer: function (idx, ans) {
                currentQuiz.answers[idx] = ans;
            },

            isQuizInProgress: function () {
                return quizInProgress;
            }
        };
    });

