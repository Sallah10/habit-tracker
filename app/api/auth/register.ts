/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password, name } = req.body;

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password,
          name,
        },
      });

      res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      res.status(400).json({ error: "User already exists" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}