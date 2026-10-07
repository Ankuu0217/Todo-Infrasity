import api from './api';

export const noteService = {
  async getNotes() {
    const response = await api.get('/notes');
    return response.data;
  },

  async getNote(id) {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  async createNote(title, content) {
    const response = await api.post('/notes', { title, content });
    return response.data;
  },

  async updateNote(id, title, content) {
    const response = await api.put(`/notes/${id}`, { title, content });
    return response.data;
  },

  async deleteNote(id) {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};
