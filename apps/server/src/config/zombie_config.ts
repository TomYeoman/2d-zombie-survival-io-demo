export const config = {
  zombies: {
    waveLength: 10,
    initialAmount: 10,
    // Zombies added per wave passed
    perWave : 5,
    // Zombies per actively participating player
    perPlayer: 2,
    timeoutBetweenWave: 3,
    // Start high, and modify as rounds pass
    spawnRate: 0.01,
    // Start low, and modify as rounds pass
    maxCount:  100,
    maxRounds:  10,
  }
};