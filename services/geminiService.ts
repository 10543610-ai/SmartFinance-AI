
import { GoogleGenAI } from "@google/genai";
import { Transaction, Budget } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[], budgets: Budget[]) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return "💡 提示：目前處於展示模式。若要啟用 AI 財務建議，請在環境變數中設定 API_KEY。";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const summary = transactions.slice(-20).map(t => `${t.date}: ${t.category} ${t.type === 'EXPENSE' ? '-' : '+'}${t.amount} (${t.description})`).join('\n');
  const budgetInfo = budgets.map(b => `${b.category} 預算: ${b.limit}`).join(', ');

  const prompt = `
    你是一位專業的個人理財顧問。以下是使用者最近的財務紀錄摘要：
    ${summary}
    
    預算設定：
    ${budgetInfo}
    
    請根據這些數據提供 3 個具體的理財建議，幫助使用者改善財務狀況。
    請用繁體中文回答，並保持口吻友善且專業。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，目前 AI 顧問忙碌中，請稍後再試。";
  }
};
