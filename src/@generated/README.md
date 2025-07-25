# Generated API Client

이 디렉토리의 파일들은 OpenAPI Generator에 의해 자동 생성되었습니다.

## 사용법

```typescript
import { Configuration, DefaultApi } from './generated';

// API 클라이언트 설정
const config = new Configuration({
  basePath: 'http://localhost:3000',
  // 인증이 필요한 경우
  accessToken: 'your-token'
});

const api = new DefaultApi(config);

// API 호출
const response = await api.someApiMethod();
```

## 재생성

`npm run generate` 명령으로 다시 생성할 수 있습니다.
