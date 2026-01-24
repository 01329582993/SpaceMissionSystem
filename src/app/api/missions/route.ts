import prisma from "@/src/lib/prisma";

export async function GET() {
  return Response.json(await prisma.mission.findMany());
}

export async function POST(req: Request) {
  const data = await req.json();
  return Response.json(await prisma.mission.create({ data }));
}
