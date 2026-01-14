import { PortfolioConfig, User } from "./types";

const USERS_KEY = 'foliogen_users';
const PORTFOLIOS_KEY = 'foliogen_portfolios';
const SESSION_KEY = 'foliogen_session';

export const store = {
  login: (email: string): User => {
    const user: User = {
      id: btoa(email),
      email,
      name: email.split('@')[0],
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getUser: (): User | null => {
    const u = localStorage.getItem(SESSION_KEY);
    return u ? JSON.parse(u) : null;
  },

  savePortfolio: (portfolio: PortfolioConfig) => {
    const existing = store.getPortfolios();
    const updated = [...existing.filter(p => p.id !== portfolio.id), portfolio];
    localStorage.setItem(PORTFOLIOS_KEY, JSON.stringify(updated));
  },

  getPortfolios: (): PortfolioConfig[] => {
    const p = localStorage.getItem(PORTFOLIOS_KEY);
    return p ? JSON.parse(p) : [];
  },

  getUserPortfolios: (userId: string): PortfolioConfig[] => {
    return store.getPortfolios().filter(p => p.userId === userId);
  },

  getPortfolioById: (id: string): PortfolioConfig | undefined => {
    return store.getPortfolios().find(p => p.id === id);
  }
};
