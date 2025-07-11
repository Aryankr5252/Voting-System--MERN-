import api from './api';

export const getCandidates = async () => {
  const response = await api.get('/vote/candidates');
  return response.data;
};

export const castVote = async (candidateId, token) => {
  const response = await api.post(
    '/vote/cast',
    { candidateId },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};
