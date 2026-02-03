// Standard API client placeholder
export const base44 = {
  auth: {
    me: async () => null,
    logout: async () => { },
    redirectToLogin: () => {
      console.log('Redirect to login placeholder');
    }
  }
};

export const createClient = () => base44;
