import { Incident } from '../types';

const CSV_DATA = `№,O'quvchi,Xodim,Sabab,Sabab turi,Ball,Sana,Izoh
1,G'anixanov Abdulqodir Isroil o'g'li,Hamidulloh Mo'ydinov,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,28/11/2025,Rus tili darsida o'quvchilarni chalg'itgan ustozga dars o'tishiga halaqit bergan
2,Yoqubov Islomjon Davlatbek o'g'li,Hamidulloh Mo'ydinov,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,28/11/2025,Rus tili darsida o'quvchilarni chalg'itgan ustozga dars o'tishiga halaqit bergan
3,Abdumajidov Muhammadsodiq Zohid o'g'li,Hamidulloh Mo'ydinov,1.6 – Texnikani noto‘g‘ri ishlatish,Salbiy,15,27/11/2025,Maktab hududida  noutbookda ta'limga bo'lmagan maqsadda foydalangan
4,Karimjonov Umidjon Eldorbek o'g'li,Hamidulloh Mo'ydinov,1.6 – Texnikani noto‘g‘ri ishlatish,Salbiy,15,27/11/2025,Maktab hududida noutbookda ta'limga oid bo'lmagan maqsadda foydalangan
5,Masuma Sayfiddinova Maxmudjon qizi,Shahzoda Muhammadjonovna,1.2 – Darsga puxta tayyorgarlik,Ijobiy,3,27/11/2025,darslarga yaxshi tayyorlanib faol ishtiroklari uchun
6,Karimjonova Mohinur Eldonrjon qizi,Shahzoda Muhammadjonovna,1.2 – Darsga puxta tayyorgarlik,Ijobiy,3,27/11/2025,darslarga puhta tayyorgarlik korganlari uchun
7,Yoqubov Islomjon Davlatbek o'g'li,Hamidulloh Mo'ydinov,2.4 – Kamsitish va masxaralash,Salbiy,15,27/11/2025,"Dars vaqtida so'kinib o'tribdi hurmatsizlik qilib, sheriklarini ustidan kulib"
8,Abrorbek To'rayev Umar,Musharrafxon Raxmonberdiyeva,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,27/11/2025,darsda boshqalarni chalg'itadi
9,Siddiqov Akbarshox Erkin o'g'li,Musharrafxon Raxmonberdiyeva,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,27/11/2025,darsda boshqalarni chalg'itadi
10,Abdulloh Bekmurodov Ibrohimjon o'g'li,Musharrafxon Raxmonberdiyeva,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,27/11/2025,darsda boshqalarni chalg'itadi
11,Ruhiddinov Muhammad Nodir o'g'li,Musharrafxon Raxmonberdiyeva,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,27/11/2025,darsda boshqalarni chalg'itgan
12,Abdulahad Asadullayev Abdulaziz,Musharrafxon Raxmonberdiyeva,2.3 – Tengdosh bilan janjallashish,Salbiy,5,27/11/2025,Tengdoshlari bilan urishgan.
13,Ibragimov Behruz Ismatillo o'g'li,Musharrafxon Raxmonberdiyeva,2.3 – Tengdosh bilan janjallashish,Salbiy,5,27/11/2025,Tengdoshlari bilan urishgan.
14,Abdulmumin Axadov Akmal o'g'li,Mirjalol Turdimirzayev,2.3 – Tengdosh bilan janjallashish,Salbiy,5,26/11/2025,Tushlikdan so'ng sinfdoshi Azizxo'ja bilan urushgan
15,Baxodirov Azizxo'ja Ibrohimxon o'g'li,Mirjalol Turdimirzayev,2.3 – Tengdosh bilan janjallashish,Salbiy,5,26/11/2025,Tushlikdan so'ng sinfdoshi Abdulmo'min bilan urushgan
16,Ibrohimov Imronbek Ikromjon o'g'li,Hamidulloh Mo'ydinov,1.6 – Texnikani noto‘g‘ri ishlatish,Salbiy,15,26/11/2025,Maktab hududida kompyuterda ta'limga oid bo'lmagan o'yinlarni o'ynagan
17,Ibrohim Anasov Isoxon o'g'li,Hamidulloh Mo'ydinov,1.6 – Texnikani noto‘g‘ri ishlatish,Salbiy,15,26/11/2025,Maktab hududida kompyuterda ta'limga oid bo'lmagan o'yinlarni o'ynagan
18,Abdulloh Bekmurodov Ibrohimjon o'g'li,Musharrafxon Raxmonberdiyeva,2.2 - Ustozga hurmatsizlik,Salbiy,20,26/11/2025,"Robototexnika darsida ustozni hurmat qimasdan, boshqa o'quvchilarni masxara qilib, laqab qo'yib chaqiradi. Ustozni gapiga kirmasdan, boshqalarni darsda chalg'itadi."
19,Muhammadamin Abdullayev Abdulbosit o'g'li,Asaloy Jamoliddinova,2.3 – Tengdosh bilan janjallashish,Salbiy,5,26/11/2025,3-sinf o'quvchisini itarib yuborgan.
20,Dadabayev Muhammad Dilshodjon ogli,Ibrohim Qodirov Ahmad o'g'li,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,25/11/2025,Informatika fanida boshqalarni chalg'itib do'sti bilan tortishmoqda.
21,Sodiqjonov Akmalxon Sobitxon,Ibrohim Qodirov Ahmad o'g'li,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,25/11/2025,Informatika fanida boshqalarni chalg'itib do'sti bilan tortishmoqda.
22,Rahimjanov Muhammadyusuf Bahromjon o'g'li,Ibrohim Qodirov Ahmad o'g'li,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,25/11/2025,Informatika boshqa o'quvchilarni chalg'itdi.
23,Ruhiddinov Muhammad Nodir o'g'li,Musharrafxon Raxmonberdiyeva,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,25/11/2025,"Darsda boshqalarni chalg'itib, tinmay gapirib o'tiradilar. bu birinchisi emas."
24,Murodjon Bekmirzayev Umidjon,Hamidulloh Mo'ydinov,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,25/11/2025,Sinfdoshi Mumisho bilan dans vaqtida shovqin chiqarib sheriklarini chalg'itdi
25,Qosimov Muminsho Maruf-o'g'li,Hamidulloh Mo'ydinov,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,25/11/2025,Sinfdoshi Murodjon bilan dans vaqtida shovqin chiqarib qolganlarga halaqit berdi
26,Sobitov Abdulloh Nasimxon o'g'li,Hamidulloh Mo'ydinov,1.6 – Texnikani noto‘g‘ri ishlatish,Salbiy,15,25/11/2025,Maktab hududida talimga oid bo'lmagan o'yin o'ynagan
27,Abdulaziz Rustamov Abdullo ogli,Ibrohim Qodirov Ahmad o'g'li,2.3 – Tengdosh bilan janjallashish,Salbiy,5,25/11/2025,Darsda janjallashishdi.
28,Shamsiddin Hamidov ...,Ibrohim Qodirov Ahmad o'g'li,2.3 – Tengdosh bilan janjallashish,Salbiy,5,25/11/2025,Darsda janjallashishdi.
29,Muhammad Ali Hamidov ...,Ibrohim Qodirov Ahmad o'g'li,2.3 – Tengdosh bilan janjallashish,Salbiy,5,25/11/2025,Darsda janjallashishdi.
30,Muhammadyusuf Olimov Xasanxon o'g'li,Musharrafxon Raxmonberdiyeva,1.1 – Darsga kech qolish,Salbiy,2,25/11/2025,"Har darsda kech qoladi, darsga o'qituvchidan keyin kiradi."
31,Abdulloh Bekmurodov Ibrohimjon o'g'li,Musharrafxon Raxmonberdiyeva,2.3 – Tengdosh bilan janjallashish,Salbiy,5,25/11/2025,Tengdoshlari  bilan urishgan
32,Abdullajanov Muhammadsodiq Ayubxon,Musharrafxon Raxmonberdiyeva,2.3 – Tengdosh bilan janjallashish,Salbiy,5,25/11/2025,"Darsdan chiqib, ikkita o'quvchi bilan urishdi."
33,Dovudxon Lutfullayev Zohid o'g'li,Musharrafxon Raxmonberdiyeva,2.3 – Tengdosh bilan janjallashish,Salbiy,5,25/11/2025,"Darsdan chiqib, ikkita o'quvchi bilan urishdi"
34,Abrorbek To'rayev Umar,Musharrafxon Raxmonberdiyeva,2.3 – Tengdosh bilan janjallashish,Salbiy,5,25/11/2025,"Darsdan chiqib, ikkita o'quvchi bilan urishdi."
35,Sobitov Abdulloh Nasimxon o'g'li,Hamidulloh Mo'ydinov,1.2 – Uy vazifa bajarmaslik,Salbiy,3,24/11/2025,Fizika fanidan uy  ishini bajarmagan va dars jarayonida faol ishtirok etmagan
36,Karimjonova Mohinur Eldonrjon qizi,Shahzoda Muhammadjonovna,1.2 – Uy vazifa bajarmaslik,Salbiy,3,24/11/2025,xorijiy til darsidagi uyga vazifani bajarmagani uchun
37,Bilolxon Qodirxanov Odiljon o'g'li,Shahzoda Muhammadjonovna,1.2 – Uy vazifa bajarmaslik,Salbiy,3,24/11/2025,xorijiy til darsidagi uyga vaazifa yo'qligi uchun
38,Muhammadsodiq Nasimov Abdullo o'g'li,Shahzoda Muhammadjonovna,1.2 – Uy vazifa bajarmaslik,Salbiy,3,24/11/2025,xorijiy til darsidagi uyga vazifa qilinmagan
39,Ikromjon Qaxorov Nomalum,Shahzoda Muhammadjonovna,1.2 – Darsga puxta tayyorgarlik,Ijobiy,3,24/11/2025,xorijiy til darsiga puhta tayyorlanib faol ishtiroki uchun
40,Dilshodbek Mamadaliyev Durbek o'g'li,Shahzoda Muhammadjonovna,1.2 – Darsga puxta tayyorgarlik,Ijobiy,3,24/11/2025,xorijiy til darsiga puhta tyyorlanib faol ishtiroki uchun
41,Masuma Sayfiddinova Maxmudjon qizi,Shahzoda Muhammadjonovna,1.2 – Darsga puxta tayyorgarlik,Ijobiy,3,24/11/2025,xorijiiy til darsiga puhta tayyorlanib faol ishtiroki uchun
42,Afruzbek Ahmadjonov Ahmadjon o'g'li,Shahzoda Muhammadjonovna,1.2 – Darsga puxta tayyorgarlik,Ijobiy,3,24/11/2025,xorijiiy til darsiga puxta tayyorlanib faol qatnashdila
43,Boqixon Bosidxonov Orifxon o'g'li,Mirjalol Turdimirzayev,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,24/11/2025,"Ona tili ustozidan shikoyat tushdi, darsda sinfdoshlariga xalaqit beradi, juda ko'p shovqin qilaveradi"
44,Mahammadxanov Rahmatillo Akramjon o'g'li,Hamidulloh Mo'ydinov,1.1 – Darsga kech qolish,Salbiy,2,24/11/2025,Adabiyot darsiga kech qolib kirgan
45,Ibrohimjanov Abdulaziz Botirjon o'g'li,Hamidulloh Mo'ydinov,1.6 – Texnikani noto‘g‘ri ishlatish,Salbiy,15,24/11/2025,Dars vaqtida noutoookda ta'limga oid bolmagan maqsadda foydalangan
46,Rahimjanov Muhammadyusuf Bahromjon o'g'li,Mirjalol Turdimirzayev,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,24/11/2025,"ona tili darsida shaxmat o'ynab o'tirgan, ustozi yig'ishtir desa ham o'ynayvergan"
47,Madaminjonov Tohirjon Muzaffar,Mirjalol Turdimirzayev,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,24/11/2025,"Ona tili darsida shaxmat o'ynab o'tirgan, ustozi yig'ishtir desa ham olmagan"
48,Muhammadsodiq Rahmatullayev Farrux ogli,Hamidulloh Mo'ydinov,1.6 – Texnikani noto‘g‘ri ishlatish,Salbiy,15,24/11/2025,"Maktab hududida noutbookda ta'limga oid bo'lmagan maqsadda foydalangan , o'yin o'ynashgan"
49,G'iyasov MuhammadAmin Anasxon,Hamidulloh Mo'ydinov,1.6 – Texnikani noto‘g‘ri ishlatish,Salbiy,15,24/11/2025,Maktab hududida noutbookdan ta'limga oid bolmagan maqsadda foydalangan o'yin o'ynagan
50,Abdumajidov Muhammadsodiq Zohid o'g'li,Hamidulloh Mo'ydinov,1.6 – Texnikani noto‘g‘ri ishlatish,Salbiy,15,24/11/2025,Maktab hududida noutbookda ta'limga oid bo'lmagan maqsadda foydalangan
51,Yoqubov Islomjon Davlatbek o'g'li,Hamidulloh Mo'ydinov,1.1 – Darsga kech qolish,Salbiy,2,24/11/2025,Adabiyot darsiga kechikib kirgan
52,Rakibov Ibrohim Abduvohid o'g'li,Hamidulloh Mo'ydinov,1.1 – Darsga kech qolish,Salbiy,2,24/11/2025,Adabiyot darsiga kechikib kirgan
53,Yoldoshaliyeva Gavharoybonu Doniyorbek qizi,Hamidulloh Mo'ydinov,1.1 – Darsga kech qolish,Salbiy,2,24/11/2025,Adabiyot darsiga kechikib kirgan
54,Marjona Maxmudjanova Mirjalol qizi,Hamidulloh Mo'ydinov,1.1 – Darsga kech qolish,Salbiy,2,24/11/2025,Adabiyot darsiga kech qolib kirgan
55,Murodjon Bekmirzayev Umidjon,Hamidulloh Mo'ydinov,1.1 – Darsga kech qolish,Salbiy,2,24/11/2025,Adabiyot darsiga kech kirgan
56,Muhammadyusuf Olimov Xasanxon o'g'li,Musharrafxon Raxmonberdiyeva,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,24/11/2025,"Darsda boshqalarni chalg'itib, urishmoqchi bo'ldi."
57,Abduraximovjonov Mustafo Rasul o'g'li,Hamidulloh Mo'ydinov,1.1 – Darsga kech qolish,Salbiy,2,24/11/2025,Adabiyot fanida darsga kech kirgan
58,Giyasov Ziynatillo Yaxyoxon o'g'li,Musharrafxon Raxmonberdiyeva,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,24/11/2025,"Informatika fanida boshqa o'quvchilarga halaqit berib,urishmoqchi bo'ldi."
59,Muhammadvafo Abduvaxobov Xurshidjon o'g'li,Mirjalol Turdimirzayev,2.3 – Tengdosh bilan janjallashish,Salbiy,5,24/11/2025,"sinfdoshi Umarxon bilan urushgan, shaxsan direktor guvoh bo'lgan"
60,Ismailov Umarxon Abdulloh og'li,Mirjalol Turdimirzayev,2.3 – Tengdosh bilan janjallashish,Salbiy,5,24/11/2025,"sinfdoshi Muhammadvafo bilan urushgan, shaxsan direktor guvoh bo'lgan"
61,Karimov Jaloliddin Jobirxon o'g'li,Mirjalol Turdimirzayev,2.3 – Tengdosh bilan janjallashish,Salbiy,5,24/11/2025,Dars vaqtida sinfdoshi Aliy bilan urushgan
62,Mamadaliyev Abdulhakim Rahmatulloh o'g'li,Mirjalol Turdimirzayev,2.3 – Tengdosh bilan janjallashish,Salbiy,5,24/11/2025,23-noyabr kuni sayohat vaqtida sinfdoshi Aliy bilan urushdi
63,Mahmudjanov Aliy Sohibjon o'g'li,Mirjalol Turdimirzayev,2.3 – Tengdosh bilan janjallashish,Salbiy,5,24/11/2025,23-noyabr kuni sayohat vaqtida sinfdoshi Abdulhakim bilan urushdi
64,Mahmudjanov Aliy Sohibjon o'g'li,Mirjalol Turdimirzayev,2.3 – Tengdosh bilan janjallashish,Salbiy,5,24/11/2025,Darsda sinfdoshi Jaloliddin bilan urushib ketgan
65,Saidamin Muhammadsoliyev Abbosjonn ogli,Hamidulloh Mo'ydinov,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,24/11/2025,8 sinf o'quvchisi  Islomjon bilan tortishib boshqalarni darsdan chalg'itdi
66,Yoqubov Islomjon Davlatbek o'g'li,Hamidulloh Mo'ydinov,1.4 – Darsda boshqalarni chalg‘itish,Salbiy,3,24/11/2025,ingliz tili darıda bollarni chalg'itib o'trishdi 7 sinf Saidamin bilan`;

// Helper to parse CSV properly handling quoted strings
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseDate(dateStr: string): Date {
  // Format DD/MM/YYYY
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  return new Date();
}

export const getIncidents = (): Incident[] => {
  const lines = CSV_DATA.split('\n');
  const data: Incident[] = [];
  
  // Skip header (index 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const cols = parseCSVLine(line);
    // Columns: №, O'quvchi, Xodim, Sabab, Sabab turi, Ball, Sana, Izoh
    if (cols.length >= 8) {
        // Clean quotes from text fields
        const cleanComment = cols[7].replace(/^"|"$/g, '');
        const cleanReason = cols[3].replace(/^"|"$/g, '');
        const score = parseInt(cols[5]);

        if (!isNaN(score)) {
            data.push({
                id: cols[0],
                student: cols[1],
                staff: cols[2],
                reason: cleanReason,
                type: cols[4] as 'Ijobiy' | 'Salbiy',
                score: score,
                date: cols[6],
                comment: cleanComment,
                dateObj: parseDate(cols[6])
            });
        }
    }
  }
  return data;
};