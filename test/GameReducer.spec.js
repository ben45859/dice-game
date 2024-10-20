import { gameReducer } from "../src/Logic/GameReducer";

describe("GameReducer", () => {
  describe("Hold", () => {
    it("holds without win", () => {
      const nextState = gameReducer(
        {
          status: "PLAYING",
          roundScore: 12,
          winningScore: 200000,
          turn: "1",
          playerScore: {
            1: 6,
            2: 7,
          },
          winCount: {
            1: 8,
            2: 9,
          },
        },
        { type: "hold" }
      );

      expect(nextState.status).toBe("PLAYING");
      expect(nextState.turn).toBe("2");
      expect(nextState.roundScore).toBe(0);
      expect(nextState.playerScore).toEqual({ 1: 18, 2: 7 });
      expect(nextState.winCount).toEqual({ 1: 8, 2: 9 });
    });

    it("holds with win", () => {});
  });
});
