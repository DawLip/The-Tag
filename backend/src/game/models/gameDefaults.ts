export function gameDefault(gameCode, creatorId){
  return (
    {
      name: 'New lobby',
      description: 'Lobby for the game',
      gameCode: gameCode,
      status: 'LOBBY',
      rules: [],
      settings: {
        saveTime: 5,
        gameTime: 30,
        posInterval: 60
      },
      events:{
        interval:[
          {
            name: "Jammer",
            interval: 30,
            roles: [1,2]
          }
        ],
        nTimes:[],
        renewable:[]
      },
      roles: [
        { name: "Spectator" },
        { name: "Seeker" },
        { name: "Runner" },
      ],
      owner: creatorId,
      gameMaster: null,
      spectators: [creatorId],
      players: [],
      gameLogs: [],
    }
  )
}