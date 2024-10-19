/* 토큰 저장 */
export const setToken = (accessToken: string, refreshToken: string, autoLogin: boolean) => {
    if (typeof window !== 'undefined') {
        const storage = autoLogin ? localStorage : sessionStorage;
        storage.setItem('accessToken', accessToken);
        storage.setItem('refreshToken', refreshToken);
    }
};

/* 닉네임 저장 */
export const setName = (name: string, autoLogin: boolean) => {
    if (typeof window !== 'undefined') {
        const storage = autoLogin ? localStorage : sessionStorage;
        storage.setItem('name', name);
    }
    return null;
};

/* 프로필 이미지 저장 */
export const setProfileImg = (profileImg: string, autoLogin: boolean) => {
    if (typeof window !== 'undefined') {
        const storage = autoLogin ? localStorage : sessionStorage;
        storage.setItem('profileImg', profileImg);
    }
    return null;
};

export const setId = (id: number, autoLogin: boolean) => {
    if (typeof window !== 'undefined') {
        const storage = autoLogin ? localStorage : sessionStorage;
        storage.setItem('userId', id.toString());
    }
    return null;
};

/* 토큰 사용 */
export const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    }
    return null;
};

export const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    }
    return null;
};

/* 닉네임 사용 */
export const getName = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('name') || sessionStorage.getItem('name');
    }
    return null;
};

/* 프로필 이미지 사용 */
export const getProfileImg = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('profileImg') || sessionStorage.getItem('profileImg');
    }
    return null;
};

/* 유저 id 사용 */
export const getUserId = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userId') || sessionStorage.getItem('userId');
    }
    return null;
};


/* 토큰 제거 */
export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('name');
    localStorage.removeItem('profileImg');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('profileImg');
    sessionStorage.removeItem('userId');
};

/* 매칭 완료 여부 */
export const setIsCompleted = (isCompleted: string) => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem("isCompleted", isCompleted);
    }
    return null;
};

export const getIsCompleted = () => {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem('isCompleted');
    }
    return null;
};