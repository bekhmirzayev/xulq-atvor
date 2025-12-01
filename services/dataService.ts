import { Incident } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbzdWjtR80ts4FHU9lys5ibRmL1YENW39LxVPGRIpksYw6ErDZZVIDfnm5BJitRZGuv9/exec';

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  try {
    // Format DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    // Try YYYY-MM-DD
    const isoParts = dateStr.split('-');
    if (isoParts.length === 3) {
      return new Date(parseInt(isoParts[0]), parseInt(isoParts[1]) - 1, parseInt(isoParts[2]));
    }
  } catch (e) {
    console.warn("Sana formati noto'g'ri:", dateStr);
  }
  return new Date();
}

export const fetchIncidents = async (): Promise<Incident[]> => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(`Server xatoligi: ${response.status} ${response.statusText}`);
    }

    // Avval javob turini tekshiramiz
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
        // Agar HTML qaytsa, demak ruxsatlarda xatolik bor (Login page)
        const text = await response.text();
        console.error("API HTML qaytardi:", text.substring(0, 100));
        throw new Error("DeployRuxsatXatoligi");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("API noto'g'ri formatdagi ma'lumot qaytardi (Array kutilgan)");
    }

    // Google Apps Script JSON'ini dastur interfeysiga moslash
    return data.map((item: any) => ({
        id: item.id ? String(item.id) : Math.random().toString(36).substr(2, 9),
        student: item.student || "Noma'lum",
        staff: item.staff || "Noma'lum",
        reason: item.reason || "Sabab ko'rsatilmagan",
        type: (item.type && String(item.type).toLowerCase().includes('ijobiy')) ? 'Ijobiy' : 'Salbiy',
        score: Number(item.points) || 0, // 'points' ni 'score' ga o'giramiz
        date: item.date || new Date().toLocaleDateString('en-GB'),
        comment: item.comment || '',
        dateObj: parseDate(item.date)
    }));

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};