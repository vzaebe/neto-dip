const API_BASE_URL = 'https://shfe-diplom.neto-server.ru';

class ApiService {
  async getData() {
    try {
      const response = await fetch(`${API_BASE_URL}/alldata`);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async getSeanceConfig(seanceId, chosenDate) {
    try {
      const response = await fetch(`${API_BASE_URL}/hallconfig?seanceId=${seanceId}&date=${chosenDate}`);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching seance config:', error);
      throw error;
    }
  }

  async setTicket(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/ticket`, {
        method: 'POST',
        body: params
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error setting ticket:', error);
      throw error;
    }
  }

  async addHall(hallName) {
    try {
      const response = await fetch(`${API_BASE_URL}/hall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hallName: hallName
        })
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error adding hall:', error);
      throw error;
    }
  }

  async deleteHall(hallId) {
    try {
      const response = await fetch(`${API_BASE_URL}/hall/${hallId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error deleting hall:', error);
      throw error;
    }
  }

  async saveConfig(hallId, params) {
    try {
      const response = await fetch(`${API_BASE_URL}/hall/${hallId}`, {
        method: 'POST',
        body: params
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }

  async savePrices(hallId, params) {
    try {
      const response = await fetch(`${API_BASE_URL}/price/${hallId}`, {
        method: 'POST',
        body: params
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error saving prices:', error);
      throw error;
    }
  }

  async addFilm(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/film`, {
        method: 'POST',
        body: params
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error adding film:', error);
      throw error;
    }
  }

  async deleteFilm(filmId) {
    try {
      const response = await fetch(`${API_BASE_URL}/film/${filmId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error deleting film:', error);
      throw error;
    }
  }

  async addSession(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/seance`, {
        method: 'POST',
        body: params
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  }

  async deleteSession(transferData) {
    try {
      const response = await fetch(`${API_BASE_URL}/seance/${transferData}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  async openHall(hallId, params) {
    try {
      const response = await fetch(`${API_BASE_URL}/open/${hallId}`, {
        method: 'POST',
        body: params
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error opening hall:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: email,
          password: password
        })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
}

export default new ApiService(); 