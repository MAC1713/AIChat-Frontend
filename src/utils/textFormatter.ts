export function formatSpecialText(text: string): string {
    // 处理代码块
    text = text.replace(/```([\s\S]*?)```/g, '<div class="code-block">$1</div>');
    
    // 处理高亮文本
    text = text.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>');
  
    return text;
  }