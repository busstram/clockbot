const Move = require('./Move');

module.exports = class Game {
  static Move = Move;
  static DEFAULT_STATE = { members: [], hits: [] };

  constructor(state) {
    this.state = state || { members: [], hits: [] };
  }

  handleMove(user, move) {
    this.ensureMember(user);
    if (this.hasMoveBeenClaimed(move)) {
      return { reply: 'already claimed!', state: this.state };
    }
    if (!move.isValid()) {
      return { reply: 'move not valid!', state: this.state };
    }
    this.addScore(user.id, move);
    return { reply: 'score!', state: this.state };
  }

  reset() {
    this.state = { members: [], hits: [] };
  }

  scoreboard() {
    const scores = this.members
      .sort((a, b) => (a.score < b.score ? 1 : -1)) // TODO: pure sort
      .map(m => `${m.user.name}: ${m.score}`)
      .join('\n');
    return `Current scores:\n${scores}`;
  }

  get members() {
    return this.state.members;
  }

  get hits() {
    return this.state.hits;
  }

  ensureMember(user) {
    if (!this.members.find(m => m.user.id === user.id)) {
      this.members.push({ user, score: 0 });
    }
  }

  hasMoveBeenClaimed(move) {
    return !!this.hits.find(({ moveId }) => moveId === move.toUniqueId());
  }

  addScore(userId, move) {
    this.members.find(m => userId === m.user.id).score += move.score();
    this.hits.push({ userId, moveId: move.toUniqueId() });
  }

  setScore(user, score) {
    this.ensureMember(user);
    this.members.find(m => user.id === m.id).score = score;
  }
};
