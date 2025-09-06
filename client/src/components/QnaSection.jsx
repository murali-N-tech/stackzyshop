import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from './Button';

const QnaSection = ({ product, productId, onQuestionSubmit }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState({});

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    // This will call a function passed from the parent to refetch the product data
    onQuestionSubmit(question);
    setQuestion('');
  };

  const handleAnswerSubmit = async (questionId) => {
    // This function would be implemented to post an answer
    console.log(`Submitting answer for question ${questionId}:`, answer[questionId]);
    // Clear the answer input after submission
    setAnswer({ ...answer, [questionId]: '' });
  };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-8 border-b pb-4">Questions & Answers</h2>
      {userInfo ? (
        <form onSubmit={handleQuestionSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Ask a Question</h3>
          <textarea
            rows="3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Have a question? Ask the community."
            required
            className="w-full p-3 border rounded-lg"
          ></textarea>
          <Button type="submit" className="mt-4">
            Submit Question
          </Button>
        </form>
      ) : (
        <div className="mb-8 bg-blue-50 p-4 rounded-lg text-blue-800">
          <Link to="/login" className="font-bold hover:underline">
            Log in
          </Link>{' '}
          to ask a question.
        </div>
      )}

      <div className="space-y-8">
        {product.qna && product.qna.length > 0 ? (
          product.qna.map((q) => (
            <div key={q._id} className="border-b pb-6">
              <p className="font-semibold text-lg">Q: {q.question}</p>
              <p className="text-sm text-gray-500">
                by {q.name} on {new Date(q.createdAt).toLocaleDateString()}
              </p>

              {q.answers && q.answers.length > 0 && (
                <div className="mt-4 pl-8 space-y-4">
                  {q.answers.map((a) => (
                    <div key={a._id}>
                      <p className="font-semibold">A: {a.answer}</p>
                      <p className="text-sm text-gray-500">
                        by {a.name} on {new Date(a.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No questions have been asked about this product yet.</p>
        )}
      </div>
    </div>
  );
};

export default QnaSection;