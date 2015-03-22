angular.module('pplTester')
    .config(function ($translateProvider) {
        $translateProvider.translations('en', {
            learning_resources: "Learning resources",
            dashboard: "Dashboard",
            dash: "Dash",
            new_quiz: "Start new quiz",
            end_quiz: "End quiz",
            statistics: "Statistics",
            quizzes: 'Quizzes',
            reset_stats: "Reset stats",
            learn: "Learn",
            next_question: "Next question",
            example_questions: "Example questions",
            check: "Check answer",
            questions: "Questions",
            quiz: "Quiz",
            want_to_end: "Do you want to end current quiz?",
            restart_quiz: "Restart quiz",
            return: "Return",
            back_to_summary: "Back to quiz summary",
            choose_quiz_topic: "Choose quiz topic",
            quiz_details: "Quiz details",
            time: "Time",
            number_of_questions: "Number of questions",
            start_quiz: "Start quiz!",
            back: 'Back',
            score: 'Your score',
            summary: 'Quiz summary',
            quiz_possitive: 'Quiz possitive!',
            quiz_negative: 'Quz negative',
            key_sheet: 'Your answers',
            question: 'Question',
            correct: 'Correct',
            incorrect: 'Incorrect',
            preview_your_answers: 'Preview your answers',
            mark: 'Check',
            confirm: 'Are you sure?',
            want_to_submit_empty: 'Do you want to submit empty answer?',
            no_return: "No, return to question",
            yes: "Yes"
        });

        $translateProvider.translations('pl', {
            learning_resources: "Zbiory pytań",
            dashboard: "Menu",
            dash: "Menu",
            new_quiz: "Rozpocznij egzamin",
            end_quiz: "Zakończ",
            statistics: "Statystyki",
            quizzes: 'Egzaminy',
            reset_stats: "Wyzeruj statystyki",
            learn: "Nauka",
            next_question: "Następne pytanie",
            example_questions: "Przykładowe pytania",
            check: "Wybierz odpowiedź",
            questions: "Pytania",
            quiz: "Egzamin",
            want_to_end: "Czy chcesz zakończyć egzamin?",
            restart_quiz: "Restartuj",
            return: "Powrót",
            back_to_summary: "Wyniki",
            choose_quiz_topic: "Wybierz temat",
            quiz_details: "Informacje",
            time: "Czas",
            number_of_questions: "Ilość pytań",
            start_quiz: "Rozpocznij egzamin!",
            back: "Powrót",
            score: 'Wynik egzaminu',
            summary: 'Podsumowanie',
            quiz_possitive: 'Pozytywny',
            quiz_negative: 'Negatywny',
            key_sheet: 'Odpowiedzi',
            question: 'Pytanie',
            correct: 'Poprawne',
            incorrect: 'Błędne',
            preview_your_answers: 'Przeglądaj odpowiedzi',
            mark: 'Wybierz',
            confirm: 'Potwierdż',
            want_to_submit_empty: 'Czy chcesz wybrać pustą odpowiedź?',
            no_return: "Nie, powróć",
            yes: "Tak"
        });

    });
