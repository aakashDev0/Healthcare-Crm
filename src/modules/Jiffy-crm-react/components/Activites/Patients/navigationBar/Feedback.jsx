import { Star } from 'lucide-react';
import React, { useState } from 'react'

const Feedback = () => {
    const [feedbacks] = useState([
      {
        id: 1,
        title: "Post-Visit Survey",
        submissionDate: "March 16, 2023",
        visitType: "Cardiology Visit",
        visitDate: "March 15, 2023",
        rating: 4.5,
        questions: [
          { question: "How would you rate your overall experience?", rating: 4 },
          { question: "Was the doctor attentive to your concerns?", rating: 5 },
          { question: "How would you rate the facility cleanliness?", rating: 4 },
          { question: "How likely are you to recommend us to family or friends?", rating: 5 }
        ],
        comments: "Dr. Chen was very thorough and explained everything clearly."
      },
      {
        id: 2,
        title: "Inpatient Experience",
        submissionDate: "February 10, 2023",
        visitType: "Hospital Stay",
        visitDate: "February 1-8, 2023",
        rating: 4,
        questions: [
          { question: "How would you rate your overall hospital stay?", rating: 4 },
          { question: "How would you rate the nursing care?", rating: 5 },
          { question: "How would you rate the food quality?", rating: 3 },
          { question: "How well was your pain managed?", rating: 4 }
        ],
        comments: "The food could be better, but the care was excellent."
      }
    ]);
  
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-gray-700">Feedback History</h1>
          <p className="text-sm text-gray-500">Patient satisfaction and feedback records</p>
        </div>
        
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-medium text-gray-700">{feedback.title}</h2>
                  <p className="text-sm text-gray-500">
                    Submitted on {feedback.submissionDate} for {feedback.visitType} ({feedback.visitDate})
                  </p>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-gray-700">{feedback.rating}/5</span>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                {feedback.questions.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <p className="text-sm text-gray-600 sm:col-span-2">{item.question}</p>
                    <p className="text-sm font-medium text-gray-700">{item.rating}/5</p>
                  </div>
                ))}
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  <p className="text-sm text-gray-600 sm:col-span-2">
                    {feedback.id === 1 ? "Any additional comments?" : "Any suggestions for improvement?"}
                  </p>
                  <p className="text-sm text-gray-700 sm:col-span-3">{feedback.comments}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


export default Feedback