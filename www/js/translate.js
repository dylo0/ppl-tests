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
    	quiz: "Quiz",
        quiz_in_progress: "Quiz in progress",
        want_to_restart: "Do you want to restart current quiz?",
        restart_quiz: "Restart quiz",
        return_to_quiz: "Return to quiz",
        choose_quiz_topic: "Choose quiz topic",
        quiz_details: "Quiz details",
        time: "Time",
        number_of_questions: "Number of questions",
        start_quiz: "Start quiz!",
        back: 'Back'
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
    	quiz: "Test",
        quiz_in_progress: "Test w toku",
        want_to_restart: "Czy chcesz rozpocząć od nowa?",
        restart_quiz: "Restartuj",
        return_to_quiz: "Powróć do testu",
        choose_quiz_topic: "Wybierz temat",
        quiz_details: "Informacje",
        time: "Czas",
        number_of_questions: "Ilość pytań",
        start_quiz: "Rozpocznij test!",
        back: "Powrót"
    });

})
