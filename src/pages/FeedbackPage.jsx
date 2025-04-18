import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FeedbackPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subject = formData.get('subject');
    const message = formData.get('message');

    fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, message }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate('/', { replace: true });
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mt-4">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
    );
}