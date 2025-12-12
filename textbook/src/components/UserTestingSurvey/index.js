import React, { useState } from 'react';
import styles from './styles.module.css';

const UserTestingSurvey = ({ chapterTitle = "this chapter" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});

  const surveySteps = [
    {
      id: 'navigation',
      title: 'Navigation & Structure',
      questions: [
        {
          id: 'ease_of_navigation',
          text: 'How easy was it to navigate through ' + chapterTitle + '?',
          type: 'likert',
          options: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
        },
        {
          id: 'content_structure',
          text: 'Was the content structure logical and easy to follow?',
          type: 'likert',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        }
      ]
    },
    {
      id: 'content',
      title: 'Content Quality',
      questions: [
        {
          id: 'content_clarity',
          text: 'How clear was the content in ' + chapterTitle + '?',
          type: 'likert',
          options: ['Very Unclear', 'Unclear', 'Neutral', 'Clear', 'Very Clear']
        },
        {
          id: 'technical_depth',
          text: 'Was the technical depth appropriate for your level?',
          type: 'likert',
          options: ['Too Shallow', 'Shallow', 'Appropriate', 'Deep', 'Too Deep']
        },
        {
          id: 'examples_helpful',
          text: 'Were the examples provided helpful?',
          type: 'likert',
          options: ['Not Helpful', 'Slightly Helpful', 'Neutral', 'Helpful', 'Very Helpful']
        }
      ]
    },
    {
      id: 'experience',
      title: 'Overall Experience',
      questions: [
        {
          id: 'would_recommend',
          text: 'How likely are you to recommend this textbook to others?',
          type: 'likert',
          options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely']
        },
        {
          id: 'time_spent',
          text: 'How much time did you spend reading ' + chapterTitle + '?',
          type: 'multiple_choice',
          options: ['Less than 30 minutes', '30-60 minutes', '1-2 hours', '2-3 hours', 'More than 3 hours']
        },
        {
          id: 'difficulty_level',
          text: 'What was the perceived difficulty level?',
          type: 'multiple_choice',
          options: ['Too Easy', 'Easy', 'Moderate', 'Challenging', 'Too Difficult']
        }
      ]
    },
    {
      id: 'feedback',
      title: 'Improvements & Feedback',
      questions: [
        {
          id: 'most_helpful',
          text: 'What was most helpful in this chapter?',
          type: 'text',
          placeholder: 'Please describe what you found most helpful...'
        },
        {
          id: 'most_confusing',
          text: 'What was most confusing or difficult to understand?',
          type: 'text',
          placeholder: 'Please describe what was confusing...'
        },
        {
          id: 'suggestions',
          text: 'What suggestions do you have for improvement?',
          type: 'text',
          placeholder: 'Please share your suggestions...'
        }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < surveySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send data to a backend
    console.log('Survey responses:', responses);
    alert('Thank you for completing the user experience survey! Your feedback helps improve the textbook.');
    setCurrentStep(0);
    setResponses({});
  };

  const currentStepData = surveySteps[currentStep];

  return (
    <div className={styles.surveyContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((currentStep + 1) / surveySteps.length) * 100}%` }}
        ></div>
      </div>

      <div className={styles.stepIndicator}>
        Step {currentStep + 1} of {surveySteps.length}
      </div>

      <div className={styles.surveyStep}>
        <h2 className={styles.stepTitle}>{currentStepData.title}</h2>

        <div className={styles.questions}>
          {currentStepData.questions.map((question) => (
            <div key={question.id} className={styles.question}>
              <label className={styles.questionLabel}>
                {question.text}
              </label>

              {question.type === 'likert' && (
                <div className={styles.likertScale}>
                  {question.options.map((option, idx) => (
                    <label key={idx} className={styles.likertOption}>
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        className={styles.radioInput}
                        checked={responses[question.id] === option}
                        onChange={() => handleAnswer(question.id, option)}
                      />
                      <span className={styles.likertText}>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'multiple_choice' && (
                <div className={styles.multipleChoice}>
                  {question.options.map((option, idx) => (
                    <label key={idx} className={styles.multipleChoiceOption}>
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        className={styles.radioInput}
                        checked={responses[question.id] === option}
                        onChange={() => handleAnswer(question.id, option)}
                      />
                      <span className={styles.choiceText}>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'text' && (
                <textarea
                  className={styles.textArea}
                  value={responses[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  rows={4}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.navigation}>
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`${styles.navButton} ${currentStep === 0 ? styles.disabled : ''}`}
        >
          Previous
        </button>

        {currentStep < surveySteps.length - 1 ? (
          <button
            onClick={nextStep}
            className={styles.navButton}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className={styles.submitButton}
          >
            Submit Survey
          </button>
        )}
      </div>
    </div>
  );
};

export default UserTestingSurvey;