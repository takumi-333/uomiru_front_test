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

export const logout = async () => {
  const res = await fetch('http://localhost:5000/logout', {
    method: 'POST',
    credentials: 'include',
  });
  return res.ok;
}
