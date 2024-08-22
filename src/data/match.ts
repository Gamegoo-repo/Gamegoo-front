export const MATCH_PAGE_DATA = [
    { id: 1, pathname: 'match', image: '/assets/images/card/matching.svg', title: '바로 매칭하기' },
    { id: 2, pathname: 'board', image: '/assets/images/card/board.svg', title: '매칭 게시판에서 찾기' },
];

export const MATCH_TYPE_PAGE_DATA = [
    { id: 1, type:'gamgoo', pathname: 'match/game-mode', width: '600px', height: '380px', top: '100px', left: '50px', title: '겜구 매칭', sub: '간단한 조건만 맞으면 바로 매칭 완료!\n다양한 실력의 플레이어들과\n신나는 게임을 즐겨보세요!', background: "/assets/images/card/gamgoo_match.svg"  },
    { id: 2, type:'custom', pathname: 'match/game-mode', width: '600px', height: '380px', top: '100px', left: '50px', title: '맞춤 매칭', sub: '원하는 조건에 딱 맞는 게임 친구를 찾아드려요!\n조건에 꼭 맞는 플레이어들과 함께\n승리를 향해 달려보세요.' , background: "/assets/images/card/custom_match.svg" },
];

export const GAME_MODE_PAGE_DATA = [
    { id: 1, rank: 'personal', pathname: 'profile', width: '296px', height: '156px', top: '50%', left: '50%', title: '개인 랭크' },
    { id: 2, rank: 'free', pathname: 'profile', width: '296px', height: '156px', top: '50%', left: '50%', title: '자유 랭크' },
    { id: 3, rank: 'fast', pathname: 'profile', width: '296px', height: '156px', top: '50%', left: '50%', title: '빠른 대전' },
    { id: 4, rank: 'wind', pathname: 'profile', width: '296px', height: '156px', top: '50%', left: '50%', title: '칼바람' },
  ];
