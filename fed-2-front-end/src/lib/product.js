const BASE_URL = import.meta.env.VITE_BASE_URL;

async function getBearer() {
  try {
    const clerk = window?.Clerk;
    if (!clerk) return null;
    return await clerk.session?.getToken();
  } catch {
    return null;
  }
}

export const putImage = async ({ file }) => {
  const token = await getBearer();

  const res = await fetch(`${BASE_URL}/api/products/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ fileType: file.type }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to get signed URL (${res.status}) ${text}`);
  }

  const data = await res.json();
  const { url, publicURL } = data;
  console.log(url, publicURL);

  const upload = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!upload.ok) {
    const text = await upload.text().catch(() => "");
    throw new Error(`Upload failed (${upload.status}) ${text}`);
  }

  return publicURL;
};
