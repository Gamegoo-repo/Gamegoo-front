export const MATCH_PAGE_DATA = [
    { id: 1, pathname: 'match', image: '/assets/images/card/matching.svg', title: '바로 매칭하기' },
    { id: 2, pathname: 'board', image: '/assets/images/card/board.svg', title: '매칭 게시판에서 찾기' },
];

export const MATCH_TYPE_PAGE_DATA = [
    { id: 1, type:'fun', pathname: 'match/game-mode', width: '600px', height: '380px', top: '100px', left: '50px', title: '즐겜', sub: '승패에 상관 없이 즐겁게 게임하고 싶은\n유저들끼리 매칭할게요.', background: "/assets/images/card/matching.svg"  },
    { id: 2, type:'hard', pathname: 'match/game-mode', width: '600px', height: '380px', top: '100px', left: '50px', title: '빡겜', sub: '열심히 게임을 이겨서 티어를 올리고자 하는\n유저들끼리 매칭할게요.' , background: "/assets/images/card/matching.svg" },
];

export const GAME_MODE_PAGE_DATA = [
    { id: 1, type: 'fun', pathname: 'profile', width: '296px', height: '156px', top: '50%', left: '50%', title: '빠른 대전' },
    { id: 2, type: 'fun', pathname: 'profile', width: '296px', height: '156px', top: '50%', left: '50%', title: '솔로 랭크' },
    { id: 3, type: 'fun', pathname: 'profile', width: '296px', height: '156px', top: '50%', left: '50%', title: '자유 랭크' },
    { id: 4, type: 'fun', pathname: 'profile', width: '296px', height: '156px', top: '50%', left: '50%', title: '칼바람' },
  ];
