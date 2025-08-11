// src/services/callService.js

import axios from 'axios';

const API_URL = "http://128.185.149.164:8080/ccivrcallservice";

/**
 * Initiates a call between an agent and a customer.
 * @param {object} callData - The data required for the call.
 * @param {number} callData.agentId - The ID of the logged-in agent.
 * @param {number} callData.customerId - The ID of the patient being called.
 * @param {string} callData.agentMsisdn - The phone number of the agent.
 * @param {string} callData.customerMsisdn - The phone number of the patient.
 * @returns {Promise<object>} The response from the API.
 */
export const initiateCall = async (callData) => {
  try {
    const response = await axios.post(API_URL, callData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error initiating call:", error);
    // Rethrow the error to be handled by the calling component
    throw error.response?.data || new Error("Failed to connect to the call service.");
  }
};