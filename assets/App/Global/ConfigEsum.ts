export enum Area{
    player1List = 0,
    player2List = 1,
    initPokerArea = 2,
    sendArea = 3,
    setArea = 4,
};

export enum Mode{
    PVE = 1,
    PVP = 2,
    Online = 3,
};

export enum URL{
    loginUrl = 'http://172.17.173.97:8080/api/user/login',    // post student_id&password
    createRoomUrl = 'http://172.17.173.97:9000/api/game',     // post Authorization private 
    joinRoomUrl = 'http://172.17.173.97:9000/api/game/',     // +uuid
    executeOpUrl = 'http://172.17.173.97:9000/api/game/',     // +uuid
    fetchOpUrl = 'http://172.17.173.97:9000/api/game/',         // +uuid/last
    fetchRoomList = 'http://172.17.173.97:9000/api/game/index',


};