angular.module('pplTester')
.config(function ($translateProvider) {    
    $translateProvider.translations('en', {
    	learning_resources: "Learning resources",
    	dashboard: "Dashboard",
    	dash: "Dash",
    	new_quiz: "Start new quiz",
    	statistics: "Statistics",
    	quizzes: 'Quizzes',
    	reset_stats: "Reset stats",
    	learn: "Learn",
    	next_question: "Next question",
    	example_questions: "Example questions",
    	check: "Check answer",
    	questions: "Questions",
    	quiz: "Quiz"
    });
 
    $translateProvider.translations('pl', {
        learning_resources: "Zbiory pytań",
    	dashboard: "Menu",
    	dash: "Menu",
    	new_quiz: "Rozpocznij nowy test",
    	statistics: "Statystyki",
    	quizzes: 'Testy',
    	reset_stats: "Wyzeruj statystyki",
    	learn: "Nauka",
    	next_question: "Następne pytanie",
    	example_questions: "Przykładowe pytania",
    	check: "Sprawdź odpowiedź",
    	questions: "Pytania",
    	quiz: "Test"
    });

})
