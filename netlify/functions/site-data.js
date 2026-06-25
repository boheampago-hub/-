export const handler = async (event) => {

  const siteId = process.env.SITE_ID || process.env.NETLIFY_SITE_ID;
  const token  = process.env.NETLIFY_BLOBS_CONTEXT
    ? JSON.parse(process.env.NETLIFY_BLOBS_CONTEXT).token
    : process.env.NETLIFY_AUTH_TOKEN;

  const STORE_NAME = 'site-content';
  const BLOB_KEY = 'site-content';
  const url = `https://api.netlify.com/api/v1/blobs/${siteId}/${STORE_NAME}/${BLOB_KEY}`;

  // ─── GET: 데이터 불러오기 ───────────────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        };
      }

      const data = await res.json();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      };
    } catch (err) {
      console.log('GET 오류:', err.message);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      };
    }
  }

  // ─── POST: 데이터 저장하기 ──────────────────────────────────────────────────
  if (event.httpMethod === 'POST') {
    try {
      const { data } = JSON.parse(event.body);

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Blobs API 오류: ${errText}`);
      }

      console.log('✅ Netlify Blobs 저장 완료');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true }),
      };
    } catch (err) {
      console.error('POST 오류:', err.message);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
