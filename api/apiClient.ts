export async function checkLogin(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:5000/auth/check", {
      credentials: "include"
    });

    const data = await res.json();

    return  data.logged_in === true;
  
  } catch (error) {
    console.error("セッション確認エラー", error);
    return false;
  }
}

// src/api/auth.ts
export const login = async (userId: string, password: string) => {
  try {
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ user_id: userId, password }),
    });

    const result = await res.json();
    return { ok: res.ok, data: result };
  } catch (error) {
    console.error('Login API error:', error);
    throw new Error('通信エラーが発生しました');
  }
};


export const logout = async () => {
  const res = await fetch('http://localhost:5000/logout', {
    method: 'POST',
    credentials: 'include',
  });
  return res.ok;
}

export const fetchCurrentUser = async () => {
  try {
    const res = await fetch('http://localhost:5000/auth/user', {
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('ユーザ取得失敗');
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
};

export const fetchFishImageBlob = async (fishPath: string): Promise<Blob | null> => {
  if (!fishPath) return null;
  try {
    const response = await fetch(`http://localhost:5000/fish?path=${encodeURIComponent(fishPath)}`);
    if (response.status === 204) return null;
    return await response.blob();
  } catch (error) {
    console.error("魚の画像の取得に失敗しました", error);
    return null;
  }
}

export const generateFish = async (color: string, shape: string): Promise<Blob> => {
  const response = await fetch('http://localhost:5000/fish/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      ans: { color, shape },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '生成失敗');
  }

  return await response.blob();
};
