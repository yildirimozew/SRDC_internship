class TokenStorage {
  constructor() {
    this.tokens = []; 
  }

  addToken(token) {
    this.tokens.push(token); 
  }

  removeToken(token) {
    const index = this.tokens.indexOf(token);
    if (index !== -1) {
      this.tokens.splice(index, 1); 
    }
  }

  findInTokens(token) {
    return this.tokens.includes(token); 
  }
}

module.exports = new TokenStorage();