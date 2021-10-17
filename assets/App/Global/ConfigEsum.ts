export const POINT_MAP = {
    "1": "A",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "11": "J",
    "12": "Q",
    "13": "K",
}

export const REVERSE_POINT_MAP = {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "J": "11",
    "Q": "12",
    "K": "13",
}



export enum Area{
    player1List = 0,
    player2List = 1,
    initPokerArea = 2,
    sendArea = 3,
    setArea = 4,
};


export enum Mode {
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

export enum PokerSuit{
    // local 0: heitao 1:hongtao 2:heimei 3:fangkuai
    // online S: heitao H:hongtao C:heimei D:fangkuai
    S = 0,
    H = 1,
    C = 2,
    D = 3,
};