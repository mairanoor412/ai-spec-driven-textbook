import React from 'react';
import styles from './styles.module.css';

const UserFeedbackForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send data to a backend
    alert('Thank you for your feedback! It has been recorded.');
    e.target.reset();
  };

  return (
    <div className={styles.feedbackContainer}>
      <h2>Textbook User Experience Feedback</h2>
      <p className={styles.description}>
        Help us improve the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics by sharing your experience.
      </p>

      <form onSubmit={handleSubmit} className={styles.feedbackForm}>
        <div className={styles.formGroup}>
          <label htmlFor="chapter">Chapter:</label>
          <select id="chapter" name="chapter" className={styles.formControl}>
            <option value="">Select a chapter</option>
            <option value="chapter-01">Chapter 1: Physical AI Fundamentals</option>
            <option value="chapter-02">Chapter 2: Humanoid Robot Concepts</option>
            <option value="chapter-03">Chapter 3: Locomotion and Movement Systems</option>
            <option value="chapter-04">Chapter 4: AI-Driven Workflows and Tools</option>
            <option value="chapter-05">Chapter 5: Practical Robotics Skills</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="experience">Overall Experience:</label>
          <div className={styles.ratingGroup}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="experience"
                  value={rating}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>{rating}</span>
              </label>
            ))}
            <span className={styles.ratingLabels}>
              <span>Poor</span>
              <span>Excellent</span>
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="easeOfUse">Ease of Navigation:</label>
          <div className={styles.ratingGroup}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="easeOfUse"
                  value={rating}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>{rating}</span>
              </label>
            ))}
            <span className={styles.ratingLabels}>
              <span>Difficult</span>
              <span>Easy</span>
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contentClarity">Content Clarity:</label>
          <div className={styles.ratingGroup}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="contentClarity"
                  value={rating}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>{rating}</span>
              </label>
            ))}
            <span className={styles.ratingLabels}>
              <span>Unclear</span>
              <span>Very Clear</span>
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="technicalAccuracy">Technical Accuracy:</label>
          <div className={styles.ratingGroup}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="technicalAccuracy"
                  value={rating}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>{rating}</span>
              </label>
            ))}
            <span className={styles.ratingLabels}>
              <span>Inaccurate</span>
              <span>Accurate</span>
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="accessibility">Accessibility:</label>
          <div className={styles.ratingGroup}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="accessibility"
                  value={rating}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>{rating}</span>
              </label>
            ))}
            <span className={styles.ratingLabels}>
              <span>Poor</span>
              <span>Excellent</span>
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="suggestions">Suggestions for Improvement:</label>
          <textarea
            id="suggestions"
            name="suggestions"
            rows="4"
            className={styles.textarea}
            placeholder="Please share any suggestions to improve the textbook..."
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="additionalComments">Additional Comments:</label>
          <textarea
            id="additionalComments"
            name="additionalComments"
            rows="3"
            className={styles.textarea}
            placeholder="Any other feedback about your experience..."
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="consent"
              required
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxText}>
              I consent to having my feedback used to improve the textbook
            </span>
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default UserFeedbackForm;