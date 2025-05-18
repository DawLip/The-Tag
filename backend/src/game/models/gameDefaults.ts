export function gameDefault(gameCode: string, name: string, creatorId: string) {
  return {
    name: name || 'New Game',
    description: 'Lobby for the game',
    gameCode: gameCode,
    status: 'LOBBY',
    rules: [],
    settings: {
      saveTime: 5,
      gameTime: 30,
      posInterval: 60,
    },
    border: {
      type: 'polygon',
      points: [
        { lat: 0, lng: 0 },
        { lat: 0, lng: 1 },
        { lat: 1, lng: 0 },
        { lat: 1, lng: 1 },
      ],
    },
    events: {
      interval: [
        {
          name: 'Jammer',
          interval: 30,
          roles: [1, 2],
        },
      ]
    },
    roles: [
      { name: 'Spectator' },
      { name: 'Seeker' },
      { name: 'Runner' },
    ],
    skills: [
      {
        type: 'fireball1',
        description: 'Fireball 2',
        area: [
          {
            type: 'circle',
            points: [
              { lat: 50.123, lng: 19.456 },
              { lat: 50.124, lng: 19.457 }
            ]
          }
        ],

        cooldown: 60,
        uses: 3,
        duration: 10,
        waitToStart: 0,
        affectedClasses: ['seeker'],
        classes: ['runner']
      },
      {
        type: 'fireball2',
        description: 'Fireball 2',
        area: [
          {
            type: 'circle',
            points: [
              { lat: 50.123, lng: 19.456 },
              { lat: 50.124, lng: 19.457 }
            ]
          }
        ],

        cooldown: 60,
        uses: 3,
        duration: 10,
        waitToStart: 0,
        affectedClasses: ['runner'],
        classes: ['seeker']
      },
    ],
    effectors: [],
    owner: creatorId,
    gameMaster: null,
    players: [
      {
        playerId: creatorId,
        role: 0,
      },
    ],
    gameLogs: [],
  };
}
