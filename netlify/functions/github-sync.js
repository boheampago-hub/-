export const handler = async (event) => {
  // POST 요청만 허용
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Netlify 환경변수에서 민감 정보 불러오기 (코드에 절대 직접 입력 X)
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER   = process.env.GITHUB_OWNER;  // boheampago-hub
  const REPO_NAME    = process.env.GITHUB_REPO;   // - (저장소명)
  const FILE_PATH    = 'public/site-data.json';
  const BRANCH       = 'main';

  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Netlify 환경변수가 설정되지 않았습니다.' }),
    };
  }

  try {
    const { data } = JSON.parse(event.body);

    // 1단계: 현재 파일의 SHA 값 가져오기 (GitHub API 필수)
    const getResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    let sha = undefined;
    if (getResponse.ok) {
      const fileInfo = await getResponse.json();
      sha = fileInfo.sha;
    }

    // 2단계: 수정된 데이터를 Base64로 인코딩 후 GitHub에 커밋
    const jsonContent = JSON.stringify(data, null, 2);
    const base64Content = Buffer.from(jsonContent, 'utf-8').toString('base64');

    const putResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '관리자 패널에서 콘텐츠 업데이트',
          content: base64Content,
          sha: sha,
          branch: BRANCH,
        }),
      }
    );

    if (!putResponse.ok) {
      const errorData = await putResponse.json();
      console.error('GitHub API 오류:', errorData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `GitHub 저장 실패: ${errorData.message}` }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'GitHub 저장 완료! Netlify 재배포가 시작됩니다.' }),
    };

  } catch (err) {
    console.error('서버 오류:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `서버 오류: ${err.message}` }),
    };
  }
};
