"use server";

import { env } from "@/env";
import axios from "axios";

export async function sendDiscordMessage(message: string) {
  try {
    await axios.post(env.DISCORD_WEBHOOK_URL, {
      content: message,
    });
  } catch (error) {
    console.error("Error sending Discord message", error);
  }
}
