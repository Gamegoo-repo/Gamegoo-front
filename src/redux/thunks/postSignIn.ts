import { joinMember } from '@/api/join';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { updateEmail, updatePassword } from '../slices/signInSlice';
import { AxiosError } from 'axios';

interface SignInData {
  isAgree: boolean;
  email: string;
  password: string;
  gameName: string;
  tag: string;
}

export const postSignIn = createAsyncThunk(
  'signIn/postSignIn',
  async (_, { getState, dispatch }) => {
    try {
      /* 현재 스토어에서 회원가입 정보 가져오기 */
      const signInState = (getState() as RootState).signIn;

       /* API 호출을 위한 요청 데이터 준비 */
      const joinData = {
        isAgree: signInState.terms[2],
        email: signInState.email,
        password: signInState.password,
        gameName: signInState.summonerName,
        tag: signInState.summonerTag,
      };
      
      if (signInState.authStatus === true) {
        const response = await joinMember(joinData);
        console.log('회원가입 성공:', response);

        /* 성공적으로 회원가입 완료 후, Redux 상태 초기화 */
        dispatch(updateEmail(''));
        dispatch(updatePassword(''));

        return response;
      } else {
        throw new Error('인증 상태가 올바르지 않습니다.');
      }
    } catch (error) {
      throw new Error('회원가입 실패: ' +  (error as AxiosError).message);
    }
  }
);
