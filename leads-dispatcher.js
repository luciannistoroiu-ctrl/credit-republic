/**
 * Credit Republic — Centralized Lead Dispatcher Engine
 * Colectează, atribuie UTM-uri, salvează local și transmite automat prin Webhook / Telegram / CRM.
 */
const CreditRepublicLeads = (function(){
  const DB_KEY = 'cr_leads_database';
  const CONFIG_KEY = 'cr_leads_config';

  // Obține parametrii UTM și sursa din URL
  function getTrafficSource() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      referrer: document.referrer || 'direct',
      page_url: window.location.href,
      user_agent: navigator.userAgent
    };
  }

  // Obține configurația de dispatch (Webhook / Telegram)
  function getConfig() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG_KEY)) || {
        webhookUrl: '', // ex: Make.com / Zapier / Google Apps Script
        telegramToken: '',
        telegramChatId: '',
        autoSync: true
      };
    } catch(e) {
      return { webhookUrl: '', telegramToken: '', telegramChatId: '', autoSync: true };
    }
  }

  function saveConfig(cfg) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  }

  // Obține toate lead-urile salvate local
  function getAllLeads() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEY)) || [];
    } catch(e) {
      return [];
    }
  }

  // Salvează baza de lead-uri
  function saveLeads(leads) {
    localStorage.setItem(DB_KEY, JSON.stringify(leads));
  }

  // Transmite lead-ul către Webhook
  async function sendToWebhook(lead, webhookUrl) {
    if (!webhookUrl) return false;
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
        mode: 'cors'
      });
      return response.ok;
    } catch (err) {
      // Fallback cu navigator.sendBeacon dacă fetch e blocat la navigare
      try {
        const blob = new Blob([JSON.stringify(lead)], { type: 'application/json' });
        return navigator.sendBeacon(webhookUrl, blob);
      } catch(e) {
        console.warn('Eroare la transmiterea webhook:', err);
        return false;
      }
    }
  }

  // Notificare instantă pe Telegram
  async function sendToTelegram(lead, token, chatId) {
    if (!token || !chatId) return false;
    try {
      let icon = '🔔';
      let title = 'LEAD NOU CREDIT REPUBLIC';
      if (lead.type === 'alert_ratecheck_pozitie') {
        icon = '📉';
        title = 'ALERTĂ DOBÂNDĂ (POZIȚIA TA)';
      } else if (lead.type === 'alert_market_obs') {
        icon = '📈';
        title = 'ALERTĂ SCHIMBARE PIAȚĂ';
      } else if (lead.type === 'affiliate_lead') {
        icon = '🤝';
        title = 'PARTENERIAT / AFILIERE NOUĂ';
      }

      let text = `<b>${icon} ${title}</b>\n\n`;
      if (lead.name) text += `👤 <b>Nume:</b> ${lead.name}\n`;
      text += `📱 <b>Telefon:</b> <code>${lead.phone}</code>\n`;
      if (lead.email) text += `✉️ <b>Email:</b> ${lead.email}\n`;
      if (lead.rate) text += `📊 <b>Dobândă client:</b> ${lead.rate}%\n`;
      if (lead.category) text += `🏢 <b>Categorie:</b> ${lead.category}\n`;
      if (lead.details) text += `📝 <b>Detalii:</b> ${lead.details}\n`;
      text += `\n🌐 <b>Sursă:</b> ${lead.source.utm_source || 'organic'}\n`;
      text += `⏱ <b>Dată:</b> ${new Date(lead.timestamp).toLocaleString('ro-RO')}`;

      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '💬 WhatsApp Direct', url: `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}` },
                { text: '📞 Apelează', url: `tel:${lead.phone}` }
              ]
            ]
          }
        })
      });
      return res.ok;
    } catch(err) {
      console.warn('Eroare transmitere Telegram:', err);
      return false;
    }
  }

  // Înregistrează și transmite un lead
  async function submitLead(leadData) {
    const lead = {
      id: 'cr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      status: 'nou',
      synced: false,
      source: getTrafficSource(),
      ...leadData
    };

    // 1. Salvare locală de siguranță
    const leads = getAllLeads();
    leads.unshift(lead);
    saveLeads(leads);

    // 2. Dispatch automat prin Webhook & Telegram
    const config = getConfig();
    let syncedWebhook = false;
    let syncedTelegram = false;

    if (config.webhookUrl) {
      syncedWebhook = await sendToWebhook(lead, config.webhookUrl);
    }
    if (config.telegramToken && config.telegramChatId) {
      syncedTelegram = await sendToTelegram(lead, config.telegramToken, config.telegramChatId);
    }

    if (syncedWebhook || syncedTelegram) {
      lead.synced = true;
      saveLeads(leads);
    }

    return lead;
  }

  // Reîncearcă trimiterea lead-urilor nesincronizate
  async function syncPendingLeads() {
    const config = getConfig();
    if (!config.webhookUrl && !config.telegramToken) return 0;
    
    const leads = getAllLeads();
    let count = 0;

    for (let lead of leads) {
      if (!lead.synced) {
        let ok = false;
        if (config.webhookUrl) ok = (await sendToWebhook(lead, config.webhookUrl)) || ok;
        if (config.telegramToken && config.telegramChatId) ok = (await sendToTelegram(lead, config.telegramToken, config.telegramChatId)) || ok;
        if (ok) {
          lead.synced = true;
          count++;
        }
      }
    }
    saveLeads(leads);
    return count;
  }

  return {
    submitLead,
    getAllLeads,
    saveLeads,
    getConfig,
    saveConfig,
    sendToWebhook,
    sendToTelegram,
    syncPendingLeads
  };
})();
