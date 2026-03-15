import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const HISTORY_FILE = path.join(process.cwd(), "chat_history.json");

async function ensureHistoryFile() {
  try {
    await fs.access(HISTORY_FILE);
  } catch {
    await fs.writeFile(HISTORY_FILE, JSON.stringify([], null, 2));
  }
}

export async function GET() {
  try {
    await ensureHistoryFile();
    const data = await fs.readFile(HISTORY_FILE, "utf-8");
    const history = JSON.parse(data);
    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to read history:", error);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, title, messages } = await req.json();
    await ensureHistoryFile();
    const data = await fs.readFile(HISTORY_FILE, "utf-8");
    let history = JSON.parse(data);

    // Find if session exists, otherwise add new
    const index = history.findIndex((h: any) => h.id === id);
    if (index !== -1) {
      history[index] = { ...history[index], messages, updatedAt: new Date().toISOString() };
    } else {
      history.push({
        id: id || Date.now().toString(),
        title: title || messages[0]?.content?.slice(0, 30) + "...",
        messages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Keep only last 50 sessions
    if (history.length > 50) {
      history = history.slice(-50);
    }

    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save history:", error);
    return NextResponse.json({ error: "Failed to save history" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await ensureHistoryFile();
    const data = await fs.readFile(HISTORY_FILE, "utf-8");
    let history = JSON.parse(data);

    if (id) {
      // Delete specific session
      history = history.filter((h: any) => h.id !== id);
    } else {
      // Clear all history
      history = [];
    }

    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete history:", error);
    return NextResponse.json({ error: "Failed to delete history" }, { status: 500 });
  }
}
