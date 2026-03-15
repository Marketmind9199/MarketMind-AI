"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { SendHorizonal, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generateMarketingContent } from "./actions"

interface Message {
  role: "user" | "ai";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}
function HomeContent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)


  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setIsLoading(true)

    try {
      const result = await generateMarketingContent(userMsg)
      if (result.error) {
        setMessages(prev => [...prev, { role: "ai", content: `ขออภัยครับ: ${result.error}` }])
      } else {
        setMessages(prev => [...prev, { role: "ai", content: result.content || "" }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "เกิดข้อผิดพลาดทางเทคนิค กรุณาลองใหม่อีกครั้ง" }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full w-full relative bg-muted/5">
      {/* Chat History Area - Re-named to Message Area for clarity */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-8 scroll-smooth"
      >

        {/* Welcome Section */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-2xl shadow-primary/5 rotate-3">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-center bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              MarketMind AI
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-md text-center leading-relaxed font-medium">
              Expert Marketing Co-pilot <br />
              ช่วยคุณคิดคอนเทนต์ วางแผนโพสต์ และสร้าง Hook โดนๆ ในพริบตา
            </p>
            <div className="mt-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Temporary Session • No History Saved</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10 w-full max-w-lg">
              <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-start gap-1 rounded-2xl border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all" onClick={() => setInput("ช่วยคิดแคปชั่นขายเซรั่มหน้าใส สำหรับกลุ่มวัยทำงานหน่อย")}>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">ตัวอย่าง</span>
                <span className="text-sm">"ช่วยคิดแคปชั่นขายเซรั่ม..."</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-start gap-1 rounded-2xl border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all" onClick={() => setInput("วางแผนคอนเทนต์เปิดตัวคาเฟ่ใหม่ สไตล์มินิมอล 7 วัน")}>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">ตัวอย่าง</span>
                <span className="text-sm">"วางแผนคอนเทนต์เปิดร้านคาเฟ่..."</span>
              </Button>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-row gap-4 max-w-[90%] sm:max-w-[80%] ${msg.role === "user" ? "ml-auto justify-end animate-in slide-in-from-right-2" : "mr-auto justify-start animate-in slide-in-from-left-2"}`}
          >
            {msg.role === "ai" && (
              <Avatar className="w-9 h-9 border shadow-sm ring-2 ring-primary/10 mt-1 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground"><Sparkles className="w-5 h-5" /></AvatarFallback>
              </Avatar>
            )}

            <div className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-2 group-hover:opacity-100 transition-opacity">
                {msg.role === "user" ? "โจทย์ / คำสั่ง" : "MarketMind AI Plan"}
              </span>
              <div className={`
                 p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                 ${msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                  : "bg-card text-card-foreground border rounded-tl-none font-medium backdrop-blur-sm"}
               `}>
                {msg.content}
              </div>
            </div>

            {msg.role === "user" && (
              <Avatar className="w-9 h-9 border shadow-sm mt-1 shrink-0">
                <AvatarFallback className="bg-muted"><User className="w-5 h-5" /></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-row justify-start items-start gap-4 mr-auto animate-pulse">
            <Avatar className="w-9 h-9 border shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary"><Loader2 className="w-5 h-5 animate-spin" /></AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5 items-start">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest px-2">กำลังประมวลผลกลยุทธ์...</span>
              <div className="bg-muted/30 h-16 w-48 sm:w-64 rounded-3xl rounded-tl-none border border-dashed border-primary/20"></div>
            </div>
          </div>
        )}

        <div className="h-8"></div> {/* Bottom padding */}
      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="px-4 pb-6 pt-2 bg-linear-to-t from-background via-background to-transparent z-20">
        <div className="max-w-4xl mx-auto relative group flex items-end gap-3 bg-card border shadow-2xl shadow-primary/5 p-2 rounded-[2rem] focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-500">
          <Textarea
            id="chat-input"
            placeholder="บอกข้อมูลสินค้า หรือเป้าหมายการตลาดของคุณ..."
            className="min-h-[50px] max-h-40 resize-none border-0 focus-visible:ring-0 bg-transparent shadow-none p-4 field-sizing-content text-base sm:text-sm leading-relaxed"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <div className="flex items-center gap-2 pr-2 pb-2">
            <Button
              size="icon"
              className="h-11 w-11 rounded-[1.25rem] shadow-lg transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground disabled:opacity-50"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-[10px] sm:text-xs text-muted-foreground/60 font-medium">MarketMind AI เป็นระบบแนะนำกลยุทธ์เบื้องต้น โปรดพิจารณาความเหมาะสมกับแบรนด์ก่อนนำไปใช้งาน</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full w-full bg-muted/5">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
