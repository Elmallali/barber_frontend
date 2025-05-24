import axios from 'axios';

export const clientService = {
  async getAllClients(salonId, status = 'ALL') {
    try {
      const response = await axios.get('/api/queue/entries', {
        params: { salon_id: salonId, status: status === 'ALL' ? null : status }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }
};