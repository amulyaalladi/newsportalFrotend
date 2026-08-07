

const DEFAULT_PROFILE = { name: "", email: "", bio: "", avatarUrl: "", role: "user" };

export default async (req) => {
  const store = getStore("profile");

  if (req.method === "GET") {
    const data = (await store.get("current", { type: "json" })) || DEFAULT_PROFILE;
    return Response.json(data);
  }

  if (req.method === "PUT") {
    const body = await req.json();
    await store.setJSON("current", body);
    return Response.json(body);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/profile" };