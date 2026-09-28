/**
 * ERIC FAN - Luxury Dark Gold Portfolio Script
 * Features:
 * 1. Geometric Cursor Particle Canvas (Squares & Triangles in Gold/Pink/Cyan)
 * 2. 3D Cubic horizontal rotation with seamless 5-image pool cycling
 * 3. 24/7 AI Customer Service Chatbot (Gemini 3.7 / 2.0 Flash Engine & Health Check)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. 幾何粒子游標效果 (Geometric Cursor Burst)
     ========================================================================== */
  const canvas = document.getElementById('cursor-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = [
      'rgba(245, 158, 11, 0.75)',  // Amber Gold
      'rgba(236, 72, 153, 0.75)',  // Neon Pink
      'rgba(6, 182, 212, 0.75)',   // Electric Cyan
      'rgba(251, 191, 36, 0.85)',  // Bright Yellow/Gold
      'rgba(244, 114, 182, 0.7)'   // Soft Pastel Pink
    ];

    class GeometricParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 10 + 6;
        this.speedX = (Math.random() - 0.5) * 3.5;
        this.speedY = (Math.random() - 0.5) * 3.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.shape = Math.random() > 0.5 ? 'square' : 'triangle';
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.1;
        this.alpha = 0.85;
        this.decay = Math.random() * 0.02 + 0.015;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotSpeed;
        this.alpha -= this.decay;
        this.size *= 0.98;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;

        if (this.shape === 'square') {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 1.2);
          ctx.lineTo(this.size / 1.2, this.size / 1.2);
          ctx.lineTo(-this.size / 1.2, this.size / 1.2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // 監聽滑鼠移動
    let lastTime = 0;
    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastTime > 25) { // 節流以確保效能
        for (let i = 0; i < 2; i++) {
          particles.push(new GeometricParticle(e.clientX, e.clientY));
        }
        lastTime = now;
      }
    });

    // 監聽點擊噴發更多粒子
    window.addEventListener('click', (e) => {
      for (let i = 0; i < 12; i++) {
        particles.push(new GeometricParticle(e.clientX, e.clientY));
      }
    });

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0 || particles[i].size <= 1) {
          particles.splice(i, 1);
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }


  /* ==========================================================================
     2. 3D 立方體 (3D Cubic) - 水平旋轉與 5 張圖片循環機制
     ========================================================================== */
  const cube = document.getElementById('rotating-cube');
  const prevBtn = document.getElementById('cube-prev');
  const nextBtn = document.getElementById('cube-next');
  const toggleBtn = document.getElementById('cube-toggle');

  if (cube) {
    const imageList = [
      { src: 'assests/image/shoooot.jpg', tag: '專案與競賽紀錄' },
      { src: 'assests/image/notion.jpg', tag: 'Notion 系統與思維' },
      { src: 'assests/image/S__21233711.jpg', tag: '自律運動與生活' },
      { src: 'assests/image/FB_IMG_1654683411132.jpg', tag: '探索成長歷程' },
      { src: 'assests/image/周行.jpg', tag: '實踐與國際視野' }
    ];

    let currentAngle = 0;
    let isAutoRotating = true;
    let autoRotateInterval;
    let imagePoolIndex = 4; // 下一個準備替換進立方體的圖片索引

    const faces = [
      { el: document.getElementById('face-0'), img: document.getElementById('img-face-0') },
      { el: document.getElementById('face-1'), img: document.getElementById('img-face-1') },
      { el: document.getElementById('face-2'), img: document.getElementById('img-face-2') },
      { el: document.getElementById('face-3'), img: document.getElementById('img-face-3') }
    ];

    function rotateCube(deltaAngle) {
      currentAngle += deltaAngle;
      
      const isMobile = window.innerWidth <= 768;
      const tz = isMobile ? '-130px' : '-160px';
      cube.style.transform = `translateZ(${tz}) rotateY(${currentAngle}deg)`;

      const normalizedAngle = ((currentAngle % 360) + 360) % 360;
      const visibleIndex = Math.round(normalizedAngle / 90) % 4;
      const hiddenFaceIndex = (visibleIndex + 2) % 4;

      const nextImgData = imageList[imagePoolIndex % imageList.length];
      if (faces[hiddenFaceIndex] && faces[hiddenFaceIndex].img) {
        faces[hiddenFaceIndex].img.src = nextImgData.src;
        const tagEl = faces[hiddenFaceIndex].el.querySelector('.face-tag');
        if (tagEl) tagEl.textContent = nextImgData.tag;
      }
      imagePoolIndex++;
    }

    function startAutoRotate() {
      if (autoRotateInterval) clearInterval(autoRotateInterval);
      autoRotateInterval = setInterval(() => {
        if (isAutoRotating) {
          rotateCube(-90);
        }
      }, 3500);
    }

    function stopAutoRotate() {
      if (autoRotateInterval) clearInterval(autoRotateInterval);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => rotateCube(-90));
    if (prevBtn) prevBtn.addEventListener('click', () => rotateCube(90));

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isAutoRotating = !isAutoRotating;
        toggleBtn.innerHTML = isAutoRotating 
          ? '<i class="fa-solid fa-pause"></i>' 
          : '<i class="fa-solid fa-play"></i>';
      });
    }

    const viewport = document.querySelector('.cube-viewport');
    if (viewport) {
      viewport.addEventListener('mouseenter', () => stopAutoRotate());
      viewport.addEventListener('mouseleave', () => {
        if (isAutoRotating) startAutoRotate();
      });

      let isDragging = false;
      let startX = 0;

      viewport.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > 40) {
          if (deltaX > 0) rotateCube(90);
          else rotateCube(-90);
          isDragging = false;
        }
      });
    }

    startAutoRotate();
  }


  /* ==========================================================================
     3. 導航列滾動偵測與手機選單
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.padding = '0.8rem 0';
      navbar.style.background = 'rgba(11, 11, 14, 0.92)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.padding = '1.2rem 0';
      navbar.style.background = 'rgba(11, 11, 14, 0.7)';
      navbar.style.boxShadow = 'none';
    }
  });

  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = 'rgba(18, 18, 24, 0.98)';
        navMenu.style.padding = '2rem 1rem';
        navMenu.style.borderBottom = '1px solid var(--border-gold)';
      }
    });
  }


  /* ==========================================================================
     3.5. AI 成果區 16:9 照片導覽輪換 (1.5秒輪換機制)
     ========================================================================== */
  const aiGalleries = document.querySelectorAll('.gallery-16-9');
  aiGalleries.forEach((gallery) => {
    const slides = gallery.querySelectorAll('.gallery-slide');
    if (slides.length > 1) {
      let activeIndex = 0;
      setInterval(() => {
        slides[activeIndex].classList.remove('active');
        activeIndex = (activeIndex + 1) % slides.length;
        slides[activeIndex].classList.add('active');
      }, 1500);
    }
  });


  /* ==========================================================================
     4. 24/7 AI 客服助理 (Eric 全天候服務機器人)
     ========================================================================== */
  const chatTrigger = document.getElementById('chatbot-trigger');
  const chatWindow = document.getElementById('chatbot-window');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const settingsToggle = document.getElementById('chat-settings-toggle');
  const settingsPanel = document.getElementById('chat-settings-panel');
  const apiKeyInput = document.getElementById('gemini-api-key-input');
  const testKeyBtn = document.getElementById('gemini-test-btn');
  const apiStatusDot = document.getElementById('api-status-dot');
  const apiStatusText = document.getElementById('api-status-text');
  const chatMessagesBody = document.getElementById('chat-messages-body');
  const chatTextarea = document.getElementById('chat-textarea');
  const sendBtn = document.getElementById('chat-send-btn');
  const clearBtn = document.getElementById('chat-clear-btn');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  // 本地快取 API Key 與選定模型
  let savedApiKey = localStorage.getItem('gemini_api_key') || '';
  let isApiHealthy = false;
  let activeModelName = 'gemini-2.0-flash'; // 預設高速流暢引擎
  let validatedCandidateModels = [];

  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
    verifyApiKey(savedApiKey, false);
  }

  // 開關聊天室
  if (chatTrigger && chatWindow) {
    chatTrigger.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
      if (chatWindow.classList.contains('active')) {
        chatTextarea.focus();
      }
    });
  }

  if (chatCloseBtn && chatWindow) {
    chatCloseBtn.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });
  }

  // 開關設定抽屜
  if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener('click', () => {
      settingsPanel.classList.toggle('open');
    });
  }

  // 驗證 API Key 健康度 (Health Check) - 採用更健全的 GET models 探測
  async function verifyApiKey(rawKey, showDrawerIfFailed = true) {
    const key = (rawKey || '').trim().replace(/^["']|["']$/g, '');
    if (!key) {
      apiStatusDot.className = 'status-indicator-dot';
      apiStatusText.textContent = '未設定 API Key，請先貼入並驗證';
      isApiHealthy = false;
      return false;
    }

    apiStatusDot.className = 'status-indicator-dot checking';
    apiStatusText.textContent = '連線測試中 (Health Checking)...';

    try {
      // 1. 先使用 GET /v1beta/models 查詢可用模型（此方法可最精確判斷 Key 是否有效）
      const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
      const res = await fetch(listModelsUrl);
      const data = await res.json();

      if (res.ok && data.models) {
        // 只保留支援 generateContent 的模型名稱，依最穩定流暢順序排序
        const available = data.models
          .filter(m => !m.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent'))
          .map(m => m.name.replace('models/', ''));

        validatedCandidateModels = available.sort((a, b) => {
          const getScore = (name) => {
            if (name === 'gemini-2.0-flash') return 100;
            if (name === 'gemini-2.5-flash') return 95;
            if (name === 'gemini-1.5-flash') return 90;
            if (name.includes('2.0-flash')) return 85;
            if (name.includes('3.7')) return 80;
            if (name.includes('flash')) return 75;
            return 40;
          };
          return getScore(b) - getScore(a);
        });

        activeModelName = validatedCandidateModels[0] || 'gemini-2.0-flash';

        // 格式化顯示名稱
        const displayModel = activeModelName.includes('2.0') ? 'Gemini 2.0 Flash' : (activeModelName.includes('3.7') ? 'Gemini 3.7 Flash' : activeModelName);
        apiStatusDot.className = 'status-indicator-dot healthy';
        apiStatusText.textContent = `🟢 Healthy (${displayModel} 高速流暢引擎已連線)`;
        localStorage.setItem('gemini_api_key', key);
        savedApiKey = key;
        isApiHealthy = true;
        return true;
      } else {
        // 取得 Google 回傳的具體錯誤原因
        const errorMsg = (data.error && data.error.message) ? data.error.message : `HTTP ${res.status}`;
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.warn('Gemini API Key Health Check Failed:', err);
      apiStatusDot.className = 'status-indicator-dot error';
      apiStatusText.textContent = `🔴 驗證失敗: ${err.message || '請確認 API Key 是否正確'}`;
      isApiHealthy = false;
      if (showDrawerIfFailed) {
        settingsPanel.classList.add('open');
      }
      return false;
    }
  }

  if (testKeyBtn) {
    testKeyBtn.addEventListener('click', async () => {
      const key = apiKeyInput.value.trim();
      await verifyApiKey(key, true);
    });
  }

  // 全域知識庫與 System Prompt (去浮誇、重事實、強邏輯)
  const ERIC_SYSTEM_PROMPT = `
你是國立臺北大學企業管理學系大二學生「范哲維（Eric Fan）」的 24/7 AI 個人客服助理。

【回覆準則與排版結構規範】
1. 風格原則：客觀精準、條理清晰、邏輯嚴密。去除誇大與過度修飾詞彙。
2. 結構要求：
   • 核心回答：第一句話直接說明核心重點。
   • 項目標題：每個經歷項目請獨立成段落標題（格式為：【項目名稱】），標題前絕對不要加點點符號（• ）。
   • 項目內細節：在標題下方才使用條列式（• ）列出背景、行動與量化成果。
   • 能力萃取：最後簡明總結所體現的商業、管理或技術能力。
3. 繁體中文回覆，字句簡練，去除一切冗言贅字。
4. 範圍限制：若問題與 Eric 的個人經歷、學業或技能完全無關，請直接回覆：「您好！我是 Eric 的客服助理 🍌 目前僅提供 Eric 的商管經歷、專案競賽、Side Project、運動習慣與職涯目標相關資訊，其餘非相關主題暫不支援回覆。」

【Eric 的核心事實資料庫】
1. 基本背景：
   • 學校科系：國立臺北大學 企業管理學系（大二）。
   • 核心能力：商業分析、專案管理、AI 數位工具整合、自律執行。

2. 商業競賽與組織經歷：
   • ATCC 全國大專商業競賽（社會 x 青年）：跨校系組隊，針對社會議題進行商業模式創新提案，晉級複賽第二階段。
   • PMI 專案管理競賽：歷時 3 個月完整專案生命週期實作，落實時程控管與交付，獲選為決賽代表隊伍。
   • 臺北大學企管系系學會學術部：統籌商業論壇與企業參訪，建立活動標準化運營流程。

3. 數位專案與工具能力：
   • 小綠人記帳 App（Side Project）：針對日常財務預算痛點設計，支援自訂每月金額上限，並打造小綠人動態主視覺，讓記帳更生動直覺。
   • Notion 智慧知識與專案系統：建構模組化個人知識庫與專案管理看板，提升執行力。
   • AI 商業工作流與提示詞系統：掌握生成式 AI、提示詞工程（Prompt Engineering）與工作流自動化。

4. 運動經歷與自律習慣：
   • 新北中山國中籃球隊：接受團隊體能與戰術訓練，培養抗壓性與溝通協作能力。
   • 全方位體能管理：長年維持規律運動與自律作息。
   • 校內 100 公尺短跑冠軍：展現體能爆發力與專注度。

5. 知識傳播與未來目標：
   • 高中英語跨班分享會：主動發起並向校方提案，現場參與逾 70 人，累積觸及超過 200 人。
   • 2027 年目標：預計取得 TOEFL 與法語檢定，朝外商企業與跨國商業諮詢領域發展。
`;

  // 對話歷史記錄
  let chatHistory = [];

  // 滾動訊息區域到底部
  function scrollToBottom() {
    chatMessagesBody.scrollTop = chatMessagesBody.scrollHeight;
  }

  // 渲染使用者訊息 (A)
  function appendUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'msg-row user-row';
    row.innerHTML = `
      <div class="msg-avatar user-avatar">
        <img src="assests/image/user_avatar.png" alt="User">
      </div>
      <div class="msg-bubble user-bubble">
        <p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>
      </div>
    `;
    chatMessagesBody.appendChild(row);
    scrollToBottom();
  }

  // 渲染思考中動態三點 (C)
  function appendThinkingBubble() {
    const row = document.createElement('div');
    row.className = 'msg-row bot-row thinking-row';
    row.innerHTML = `
      <div class="msg-avatar bot-avatar">
        <img src="assests/image/minion_avatar.png" alt="Minion Bot">
      </div>
      <div class="msg-bubble bot-bubble typing-bubble">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatMessagesBody.appendChild(row);
    scrollToBottom();
    return row;
  }

  // 清除 Markdown 語法符號並轉換為高質感 HTML
  function cleanAndFormatMarkdown(text) {
    if (!text) return '';
    let clean = text;

    // 1. 去除水平線 (---, ***, ___)
    clean = clean.replace(/^[ \t]*[-*_]{3,}[ \t]*$/gm, '');

    // 2. 將 Markdown 標題 (###, ##, #) 轉為高雅粗體標題
    clean = clean.replace(/^[ \t]*#{1,6}[ \t]+(.*)$/gm, '<strong class="bot-section-title">$1</strong>');

    // 3. 將項目大標題（如 【...】 或包含冒號的標題行）獨立轉為段落標題，不納入列點點點
    clean = clean.replace(/^[ \t]*[*+-]?[ \t]*(【.*?】)/gm, '<strong class="bot-section-title">$1</strong>');
    clean = clean.replace(/^[ \t]*[*+-]?[ \t]*([0-9]+[\.、]\s*.*?競賽.*?：?|[0-9]+[\.、]\s*.*?App.*?：?)/gm, '<strong class="bot-section-title">$1</strong>');
    clean = clean.replace(/^[ \t]*[*+-][ \t]+(ATCC.*?：|PMI.*?：)/gm, '<strong class="bot-section-title">$1</strong>');

    // 4. 將 Markdown 列表符號 (* , - , + ) 轉為乾淨圓點 •
    clean = clean.replace(/^[ \t]*[*+-][ \t]+/gm, '• ');

    // 5. 將 Markdown 粗體 (**text**) 轉為 <strong>
    clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 6. 將殘留的孤立 * 符號去除
    clean = clean.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1$2$3');

    // 7. 移除多餘空行並轉為 <br>
    clean = clean.replace(/\n{3,}/g, '\n\n');
    clean = clean.trim().replace(/\n/g, '<br>');

    return clean;
  }

  // 將思考泡泡轉為正式回覆
  function resolveBotMessage(thinkingRow, text) {
    if (!thinkingRow) return;
    const bubble = thinkingRow.querySelector('.msg-bubble');
    bubble.classList.remove('typing-bubble');
    
    let formatted = cleanAndFormatMarkdown(text);
    bubble.innerHTML = `<p>${formatted}</p>`;
    thinkingRow.classList.remove('thinking-row');
    scrollToBottom();
  }

  function escapeHtml(string) {
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 發送訊息給 Gemini
  async function sendMessage() {
    const userText = chatTextarea.value.trim();
    if (!userText) return;

    const currentKey = (savedApiKey || apiKeyInput.value || '').trim().replace(/^["']|["']$/g, '');
    if (!currentKey) {
      settingsPanel.classList.add('open');
      apiKeyInput.focus();
      alert('請先在設定中貼入有效的 Gemini API Key 並完成驗證喔！');
      return;
    }

    // 清空輸入框
    chatTextarea.value = '';
    appendUserMessage(userText);

    // 加入思考泡泡 (C)
    const thinkingRow = appendThinkingBubble();

    // 組裝 Gemini 對話內容
    chatHistory.push({ role: 'user', parts: [{ text: userText }] });

    // 僅呼叫 Google API 經實測驗證存在且支援 generateContent 的模型，杜絕 404 / Not Found
    const candidateModels = (validatedCandidateModels && validatedCandidateModels.length > 0)
      ? validatedCandidateModels
      : [activeModelName, 'gemini-2.0-flash', 'gemini-1.5-flash'];

    let botReply = '';
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentKey}`;
        const payload = {
          system_instruction: {
            parts: [{ text: ERIC_SYSTEM_PROMPT }]
          },
          contents: chatHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        };

        // 設定 10 秒逾時控制器，避免 Google 伺服器排隊卡死
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (response.ok && data.candidates && data.candidates[0] && data.candidates[0].content) {
          botReply = data.candidates[0].content.parts.map(p => p.text).join('\n');
          // 成功取得回覆，自動更新當前最順暢的模型
          activeModelName = model;
          break;
        } else {
          const errMsg = (data.error && data.error.message) ? data.error.message : `HTTP ${response.status}`;
          console.warn(`Model ${model} failed, trying fallback:`, errMsg);
          lastError = errMsg;
          // 若為 High Demand 或 503/429，立即嘗試下一個備用模型
          continue;
        }
      } catch (e) {
        console.warn(`Model ${model} request error:`, e.message);
        lastError = e.message;
        continue;
      }
    }

    if (botReply) {
      chatHistory.push({ role: 'model', parts: [{ text: botReply }] });
      resolveBotMessage(thinkingRow, botReply);
    } else {
      resolveBotMessage(
        thinkingRow,
        `⚠️ Google API 伺服器目前流量尖峰（${lastError || '網路逾時'}），請再次發送，系統已為您自動調度最順暢的線路！`
      );
    }
  }

  // 發送按鈕點擊
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      sendMessage();
    });
  }

  // 清除按鈕點擊
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (chatTextarea.value.trim().length > 0) {
        chatTextarea.value = '';
      } else {
        if (confirm('確定要清除目前的對話記錄嗎？')) {
          chatHistory = [];
          chatMessagesBody.innerHTML = `
            <div class="msg-row bot-row">
              <div class="msg-avatar bot-avatar">
                <img src="assests/image/minion_avatar.png" alt="Minion Bot">
              </div>
              <div class="msg-bubble bot-bubble">
                <p>對話記錄已重置！🍌</p>
                <p>歡迎隨時向我提問關於 Eric 的各項商業經歷與專業技能！</p>
              </div>
            </div>
          `;
        }
      }
    });
  }

  // 鍵盤支援：Shift + Enter 換行，Enter 送出
  if (chatTextarea) {
    chatTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // 快捷問題按鈕
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-question');
      if (q) {
        chatTextarea.value = q;
        sendMessage();
      }
    });
  });

});
