// o: test egasiga ("siz" shakli). g: do'stga ("u" shakli): oldidan egasining ismi qo'shiladi.
//    g ichida {N} (ism), {N:ning} {N:ni} {N:ga} {N:dan} (ism + qo'shimcha) ishlatish mumkin. Masalan: "{N:ning} do'sti kasal bo'lsa, nima qiladi?"
// opts: do'st ko'radigan variantlar (3-shaxs). oo: egasi ko'radigan variantlar ("men" shakli); yozilmasa opts ishlatiladi.
// MUHIM: mavjud savollar tartibini o'zgartirmang va o'chirmang! Saqlangan testlar savolni indeks bo'yicha eslaydi.
//        Yangi savollarni faqat OXIRIGA qo'shing.
// tag: deep, love, fun, friend, life, taste, dilemma, uz, dream  (turlari logic.js dagi STYLES da)
// Birinchi 31 ta savol (#0-#30) allaqachon ishlayotgan testlarda bor, ularning ma'nosini o'zgartirmang.
module.exports = [
  { tag: "deep", o: "Agar bir kun hech kim bilan gaplashmasangiz, sababi nima?", g: "bir kun hech kim bilan gaplashmasa, sababi nima?",
    opts: ["😔 Kayfiyati yo'q", "🧘 Yolg'iz qolishni xohlaydi", "😤 Nimadandir xafa", "😴 Shunchaki dam olyapti"],
    oo: ["😔 Kayfiyatim yo'q", "🧘 Yolg'iz qolishni xohlayman", "😤 Nimadandir xafaman", "😴 Shunchaki dam olyapman"] }, // #0
  { tag: "deep", o: "Siz uchun eng qadrli narsa qaysi?", g: "uchun eng qadrli narsa nima?",
    opts: ["💰 Pul va boylik", "👨‍👩‍👧 Oila va yaqinlar", "🕊 Erkinlik", "👑 Hurmat va obro'"] }, // #1
  { tag: "deep", o: "Katta miqdorda pul berilsa, birinchi nima qilasiz?", g: "katta miqdorda pul olsa, birinchi nima qiladi?",
    opts: ["🏠 Uy yoki mashina oladi", "🤲 Oilasiga yordam beradi", "✈️ Sayohatga ketadi", "📈 Biznes boshlaydi"],
    oo: ["🏠 Uy yoki mashina olaman", "🤲 Oilamga yordam beraman", "✈️ Sayohatga ketaman", "📈 Biznes boshlayman"] }, // #2
  { tag: "deep", o: "Odamda eng yomon ko'radigan xususiyatingiz qaysi?", g: "odamda eng yomon ko'radigan xususiyati qaysi?",
    opts: ["🤥 Yolg'on", "💔 Xiyonat", "🎭 Ikkiyuzlamachilik", "🙄 Mensimaslik"] }, // #3
  { tag: "deep", o: "Hayotda nimaga eng ko'p erishishni xohlaysiz?", g: "hayotda nimaga eng ko'p erishishni xohlaydi?",
    opts: ["🚀 Boy va muvaffaqiyatli bo'lish", "🥹 Ota-onasini faxrlantirish", "🌿 Baxtli va tinch hayot", "🌟 Odamlar eslab yuradigan inson bo'lish"],
    oo: ["🚀 Boy va muvaffaqiyatli bo'lish", "🥹 Ota-onamni faxrlantirish", "🌿 Baxtli va tinch hayot", "🌟 Odamlar eslab yuradigan inson bo'lish"] }, // #4
  { tag: "deep", o: "Jahlingiz chiqsa nima qilasiz?", g: "{N:ning} jahli chiqsa, nima qiladi?",
    opts: ["🗣 Baqiradi", "🤐 Indamay qoladi", "😢 Yig'laydi", "😅 Kulib o'tkazib yuboradi"],
    oo: ["🗣 Baqiraman", "🤐 Indamay qolaman", "😢 Yig'layman", "😅 Kulib o'tkazib yuboraman"] }, // #5
  { tag: "deep", o: "Do'stlikda siz uchun eng muhimi nima?", g: "do'stlikda eng muhim deb nimani biladi?",
    opts: ["🤝 Sodiqlik", "😂 Hazil-mazax", "🆘 Qiyin paytda yordam", "💬 Haqiqatni yuzga aytishi"] }, // #6
  { tag: "deep", o: "Sizni tanqid qilishsa nima qilasiz?", g: "{N:ni} tanqid qilishsa, nima qiladi?",
    opts: ["👂 Tinglab, xulosa chiqaradi", "😞 Xafa bo'lib ketadi", "🤷 E'tibor bermaydi", "⚔️ Qarshi gapiradi"],
    oo: ["👂 Tinglab, xulosa chiqaraman", "😞 Xafa bo'lib ketaman", "🤷 E'tibor bermayman", "⚔️ Qarshi gapiraman"] }, // #7
  { tag: "deep", o: "Kelajakda hayotingizni qayerda ko'rasiz?", g: "kelajakda hayotini qayerda ko'radi?",
    opts: ["🏙 Toshkentda", "🏡 Tinch qishloqda", "🌍 Xorijda", "🧳 Dunyo bo'ylab sayohatda"] }, // #8
  { tag: "deep", o: "Bugun yangi kasb tanlasangiz, qaysi birini?", g: "bugun yangi kasb tanlasa, qaysi birini tanlaydi?",
    opts: ["🩺 Shifokor", "💻 Dasturchi", "💼 Biznesmen", "📱 Blogger"] }, // #9
  { tag: "deep", o: "Sirni saqlay olasizmi?", g: "sirni saqlay oladimi?",
    opts: ["🔒 Qabrgacha saqlaydi", "👯 Faqat eng yaqiniga aytadi", "🙊 Tez og'zidan chiqib ketadi", "😰 Saqlaydi, lekin ichida qiynaladi"],
    oo: ["🔒 Qabrgacha saqlayman", "👯 Faqat eng yaqinimga aytaman", "🙊 Tez og'zimdan chiqib ketadi", "😰 Saqlayman, lekin ichimda qiynalaman"] }, // #10
  { tag: "love", o: "Yaqin odamingiz bilan janjallashsangiz, nima qilasiz?", g: "yaqin odami bilan janjallashsa, nima qiladi?",
    opts: ["🙋 Birinchi bo'lib kechirim so'raydi", "⏳ U so'rashini kutadi", "🎁 Sovg'a olib boradi", "🌫 Vaqt o'tishini kutadi"],
    oo: ["🙋 Birinchi bo'lib kechirim so'rayman", "⏳ U so'rashini kutaman", "🎁 Sovg'a olib boraman", "🌫 Vaqt o'tishini kutaman"] }, // #11
  { tag: "love", o: "Mukammal uchrashuvni qanday tasavvur qilasiz?", g: "mukammal uchrashuvni qanday tasavvur qiladi?",
    opts: ["☕️ Kafe va uzun suhbat", "🎬 Kino", "🌆 Kechki sayr", "🍿 Uyda film va yegulik"] }, // #12
  { tag: "love", o: "Qaysi holatda ko'proq yig'laysiz?", g: "qaysi holatda ko'proq yig'laydi?",
    opts: ["🎞 Kino yoki qo'shiq ta'sirida", "💔 Xafa bo'lganda", "🚫 Deyarli yig'lamaydi", "🤣 Kulganda"],
    oo: ["🎞 Kino yoki qo'shiq ta'sirida", "💔 Xafa bo'lganda", "🚫 Deyarli yig'lamayman", "🤣 Kulganda"] }, // #13
  { tag: "fun", o: "Sevimli taomingiz?", g: "{N:ning} sevimli taomi nima?",
    opts: ["🍚 Palov", "🍜 Lag'mon", "🍕 Pitsa", "🍢 Shashlik"] }, // #14
  { tag: "fun", o: "Dam olish kuni nima qilasiz?", g: "dam olish kuni nima qiladi?",
    opts: ["😴 Uxlaydi", "🛍 Do'stlari bilan chiqadi", "📱 Telefonda o'tiradi", "🎬 Kino ko'radi"],
    oo: ["😴 Uxlayman", "🛍 Do'stlarim bilan chiqaman", "📱 Telefonda o'tiraman", "🎬 Kino ko'raman"] }, // #15
  { tag: "fun", o: "Qaysi ichimlikni afzal ko'rasiz?", g: "qaysi ichimlikni afzal ko'radi?",
    opts: ["🍵 Choy", "🥤 Kola", "☕️ Kofe", "🧃 Sharbat"] }, // #16
  { tag: "fun", o: "Eng katta qo'rqinchingiz?", g: "eng ko'p nimadan qo'rqadi?",
    opts: ["🌑 Qorong'ilik", "🪳 Hasharotlar", "🏔 Balandlik", "🫥 Yolg'izlik"] }, // #17
  { tag: "fun", o: "Qaysi super kuchni tanlaysiz?", g: "qaysi super kuchni tanlaydi?",
    opts: ["🕊 Uchish", "👻 Ko'rinmas bo'lish", "⏱ Vaqtni to'xtatish", "🧠 Odamlar fikrini bilish"] }, // #18
  { tag: "fun", o: "Kechqurun odatda qachon uxlaysiz?", g: "kechqurun odatda qachon uxlaydi?",
    opts: ["🌙 22:00 gacha", "🕛 Yarim tungacha", "🦉 Soat 2 gacha", "🌅 Tongda"] }, // #19
  { tag: "fun", o: "Telefonda eng ko'p qaysi ilovada vaqt o'tkazasiz?", g: "telefonda eng ko'p qaysi ilovada vaqt o'tkazadi?",
    opts: ["📸 Instagram", "✈️ Telegram", "▶️ YouTube", "🎮 O'yin"] }, // #20
  { tag: "fun", o: "Qaysi joyga sayohat qilgingiz keladi?", g: "qaysi joyga sayohat qilishni xohlaydi?",
    opts: ["🏜 Dubay", "🕌 Turkiya", "🏛 Samarqand", "⛰ Tog'lar (Chimyon)"] }, // #21
  { tag: "fun", o: "Xabarga odatda qanday javob berasiz?", g: "xabarga odatda qanday javob beradi?",
    opts: ["⚡️ Darhol", "🕐 Bir soatdan keyin", "👀 Ko'rib qo'yib, unutadi", "🎤 Faqat ovozli yuboradi"],
    oo: ["⚡️ Darhol", "🕐 Bir soatdan keyin", "👀 Ko'rib qo'yib, unutaman", "🎤 Faqat ovozli yuboraman"] }, // #22
  { tag: "fun", o: "Ertalab qanday uyg'onasiz?", g: "ertalab qanday uyg'onadi?",
    opts: ["⏰ Birinchi budilnikda", "😵 5 ta budilnikdan keyin", "📞 Kimdir uyg'otadi", "🕛 Tushga yaqin"] }, // #23
  { tag: "fun", o: "Sehrli chiroq faqat bitta tilak bajarsa, nimani so'raysiz?", g: "sehrli chiroqdan bitta tilak so'rasa, nimani so'raydi?",
    opts: ["💸 Cheksiz pul", "💪 Mustahkam sog'liq", "❤️ Haqiqiy sevgi", "🌟 Mashhurlik"] }, // #24
  { tag: "fun", o: "Qaysi holat kayfiyatingizni eng ko'p buzadi?", g: "qaysi holat kayfiyatini eng ko'p buzadi?",
    opts: ["🌧 Yomg'ir", "📵 Internet o'chib qolishi", "🪫 Telefon quvvati tugashi", "🧍 Navbatda turish"] }, // #25
  { tag: "fun", o: "Qaysi faslni yaxshi ko'rasiz?", g: "qaysi faslni yaxshi ko'radi?",
    opts: ["❄️ Qish", "🌸 Bahor", "☀️ Yoz", "🍂 Kuz"] }, // #26
  { tag: "fun", o: "Lotereyada yutib olsangiz, kimga aytasiz?", g: "lotereyada yutib olsa, kimga aytadi?",
    opts: ["🤫 Hech kimga", "👨‍👩‍👧 Oilasiga", "🫂 Eng yaqin do'stiga", "📣 Hammaga, storiesda ham"],
    oo: ["🤫 Hech kimga", "👨‍👩‍👧 Oilamga", "🫂 Eng yaqin do'stimga", "📣 Hammaga, storiesda ham"] }, // #27
  { tag: "fun", o: "Telefoningiz yo'qolsa nima qilasiz?", g: "{N:ning} telefoni yo'qolsa, nima qiladi?",
    opts: ["😱 Vahimaga tushadi", "🔎 Tinchgina qidiradi", "🛒 Yangisini oladi", "😌 Tinchlanib, xursand bo'ladi"],
    oo: ["😱 Vahimaga tushaman", "🔎 Tinchgina qidiraman", "🛒 Yangisini olaman", "😌 Tinchlanib, xursand bo'laman"] }, // #28
  { tag: "fun", o: "Kayfiyatingiz ko'tarilishi uchun nima qilasiz?", g: "{N:ning} kayfiyati ko'tarilishi uchun nima qiladi?",
    opts: ["🎧 Musiqa tinglaydi", "☎️ Do'sti bilan gaplashadi", "🍔 Yaxshi ovqat yeydi", "🛌 Uxlaydi"],
    oo: ["🎧 Musiqa tinglayman", "☎️ Do'stim bilan gaplashaman", "🍔 Yaxshi ovqat yeyman", "🛌 Uxlayman"] }, // #29
  { tag: "dilemma", o: "O'zingizni qaysi hayvonga o'xshatasiz?", g: "o'zini qaysi hayvonga o'xshatadi?",
    opts: ["🦁 Sher", "🐱 Mushuk", "🐶 It", "🦅 Burgut"] }, // #30
  { tag: "deep", o: "Hayotda eng ko'p nimadan pushaymonsiz?", g: "hayotda eng ko'p nimadan pushaymon?",
    opts: ["📚 O'qish yoki ishga kam kuch sarflaganidan", "💔 Noto'g'ri odamga ishonganidan", "⏳ Vaqtini bekorga o'tkazganidan", "🙌 Hech narsadan pushaymon emas"],
    oo: ["📚 O'qish yoki ishga kam kuch sarflaganimdan", "💔 Noto'g'ri odamga ishonganimdan", "⏳ Vaqtimni bekorga o'tkazganimdan", "🙌 Hech narsadan pushaymon emasman"] }, // #31
  { tag: "deep", o: "Sizni nima eng ko'p xursand qiladi?", g: "{N:ni} nima eng ko'p xursand qiladi?",
    opts: ["🎁 Kutilmagan sovg'a", "🤗 Yaqinlarining e'tibori", "🏆 Yutuq va muvaffaqiyat", "🌄 Tinch va sokin lahzalar"],
    oo: ["🎁 Kutilmagan sovg'a", "🤗 Yaqinlarimning e'tibori", "🏆 Yutuq va muvaffaqiyat", "🌄 Tinch va sokin lahzalar"] }, // #32
  { tag: "deep", o: "Kelajakda nimadan eng ko'p xavotirlanasiz?", g: "kelajakda nimadan eng ko'p xavotirlanadi?",
    opts: ["💸 Pul yetmay qolishidan", "🫂 Yaqinlarini yo'qotishdan", "📉 Maqsadiga erisha olmaslikdan", "🩺 Sog'ligi yomonlashishidan"],
    oo: ["💸 Pul yetmay qolishidan", "🫂 Yaqinlarimni yo'qotishdan", "📉 Maqsadimga erisha olmaslikdan", "🩺 Sog'ligim yomonlashishidan"] }, // #33
  { tag: "deep", o: "Kimdir sizga yomonlik qilsa, nima qilasiz?", g: "{N:ga} kimdir yomonlik qilsa, nima qiladi?",
    opts: ["🕊 Kechiradi, lekin unutmaydi", "🚪 Hayotidan chiqarib tashlaydi", "🔥 Xuddi shunday javob qaytaradi", "🙏 Ko'p o'ylamay kechiradi"],
    oo: ["🕊 Kechiraman, lekin unutmayman", "🚪 Hayotimdan chiqarib tashlayman", "🔥 Xuddi shunday javob qaytaraman", "🙏 Ko'p o'ylamay kechiraman"] }, // #34
  { tag: "deep", o: "Qaror qabul qilishda nimaga tayanasiz?", g: "qaror qabul qilishda nimaga tayanadi?",
    opts: ["🧠 Mantiq va hisob-kitob", "❤️ Yurak va his-tuyg'u", "👨‍👩‍👧 Yaqinlari maslahati", "🎲 Taqdirga ishonadi"],
    oo: ["🧠 Mantiq va hisob-kitob", "❤️ Yurak va his-tuyg'u", "👨‍👩‍👧 Yaqinlarim maslahati", "🎲 Taqdirga ishonaman"] }, // #35
  { tag: "deep", o: "Bolaligingizdan eng yaxshi xotirangiz qaysi?", g: "bolaligidan eng yaxshi xotirasi qaysi?",
    opts: ["🛝 Hovlida o'ynagan kunlar", "🍲 Oilaviy dasturxon", "🎒 Maktab do'stlari", "🏖 Yozgi ta'tillar"] }, // #36
  { tag: "deep", o: "O'zingizni qanday inson deb bilasiz?", g: "o'zini qanday inson deb biladi?",
    opts: ["🌞 Optimist", "⚖️ Realist", "🌧 Pessimist", "🎢 Kayfiyatga qarab o'zgaradi"],
    oo: ["🌞 Optimist", "⚖️ Realist", "🌧 Pessimist", "🎢 Kayfiyatga qarab o'zgaraman"] }, // #37
  { tag: "deep", o: "Yutqazsangiz o'zingizni qanday tutasiz?", g: "yutqazsa o'zini qanday tutadi?",
    opts: ["💪 Qayta urinadi", "😤 Jahli chiqadi", "🤝 Rahmat aytib, o'rganadi", "🙈 Bir muddat yo'qolib qoladi"],
    oo: ["💪 Qayta urinaman", "😤 Jahlim chiqadi", "🤝 Rahmat aytib, o'rganaman", "🙈 Bir muddat yo'qolib qolaman"] }, // #38
  { tag: "deep", o: "Pul yoki sevgi: qaysi biri muhimroq?", g: "pul va sevgidan qaysi birini muhimroq biladi?",
    opts: ["💰 Pul", "❤️ Sevgi", "⚖️ Ikkalasi teng", "🧘 Ikkalasi emas, tinch hayot"] }, // #39
  { tag: "deep", o: "Kimdir sizdan yordam so'rasa, nima qilasiz?", g: "{N:dan} kimdir yordam so'rasa, nima qiladi?",
    opts: ["🤲 Darhol yordam beradi", "🤔 Avval o'ylab ko'radi", "💬 Maslahat beradi, o'zi aralashmaydi", "😅 Imkoni bo'lmasa, to'g'ri aytadi"],
    oo: ["🤲 Darhol yordam beraman", "🤔 Avval o'ylab ko'raman", "💬 Maslahat beraman, o'zim aralashmayman", "😅 Imkonim bo'lmasa, to'g'ri aytaman"] }, // #40
  { tag: "deep", o: "Yangi odam bilan tanishganda nimaga e'tibor berasiz?", g: "yangi odam bilan tanishganda nimaga e'tibor beradi?",
    opts: ["👀 Tashqi ko'rinishiga", "🗣 Gapirishiga", "😊 Tabassumi va mehriga", "🧠 Fikrlashiga"] }, // #41
  { tag: "deep", o: "Hayotda eng ko'p kimga ishonasiz?", g: "hayotda eng ko'p kimga ishonadi?",
    opts: ["👩 Onasiga", "👨 Otasiga", "🫂 Eng yaqin do'stiga", "🪞 Faqat o'ziga"],
    oo: ["👩 Onamga", "👨 Otamga", "🫂 Eng yaqin do'stimga", "🪞 Faqat o'zimga"] }, // #42
  { tag: "love", o: "Sevgida eng muhim narsa nima?", g: "sevgida eng muhim narsa nima deb biladi?",
    opts: ["🤝 Ishonch", "🗣 Ochiq gaplashish", "🎁 E'tibor va g'amxo'rlik", "😂 Birga kulish"] }, // #43
  { tag: "love", o: "Sevgingizni qanday izhor qilasiz?", g: "sevgisini qanday izhor qiladi?",
    opts: ["🗣 Yuzma-yuz aytadi", "💌 Xat yoki xabar yozadi", "🎁 Sovg'a bilan bildiradi", "🤐 Harakatlari bilan ko'rsatadi"],
    oo: ["🗣 Yuzma-yuz aytaman", "💌 Xat yoki xabar yozaman", "🎁 Sovg'a bilan bildiraman", "🤐 Harakatlarim bilan ko'rsataman"] }, // #44
  { tag: "love", o: "Yaqin odamingizda eng ko'p nimani qadrlaysiz?", g: "yaqin odamida eng ko'p nimani qadrlaydi?",
    opts: ["😊 Samimiylik", "🤣 Hazil tuyg'usi", "🛡 Himoya qilishi", "🧠 Aql-idrok"] }, // #45
  { tag: "love", o: "Sizni nima eng ko'p ranjitadi?", g: "{N:ni} nima eng ko'p ranjitadi?",
    opts: ["🤥 Yolg'on gapirishsa", "📵 Xabarga javob bermasalar", "🙄 Uni tushunishmasa", "😶 Qadrlamasalar"],
    oo: ["🤥 Yolg'on gapirishsa", "📵 Xabarga javob bermasalar", "🙄 Meni tushunishmasa", "😶 Qadrlamasalar"] }, // #46
  { tag: "love", o: "Qaysi sovg'a sizni eng ko'p xursand qiladi?", g: "qaysi sovg'adan eng ko'p xursand bo'ladi?",
    opts: ["💐 Gul", "📖 Qo'lda yozilgan xat", "🎧 Kerakli texnika", "🍫 Shirinlik"] }, // #47
  { tag: "love", o: "Sizni kim eng yaxshi tushunadi?", g: "{N:ni} kim eng yaxshi tushunadi?",
    opts: ["👩 Onasi", "🫂 Eng yaqin do'sti", "❤️ Sevgan odami", "🤷 Hech kim to'liq tushunmaydi"],
    oo: ["👩 Onam", "🫂 Eng yaqin do'stim", "❤️ Sevgan odamim", "🤷 Hech kim to'liq tushunmaydi"] }, // #48
  { tag: "love", o: "Ota-onangiz bilan munosabatingiz qanday?", g: "{N:ning} ota-onasi bilan munosabati qanday?",
    opts: ["🤗 Juda yaqin", "🙂 Yaxshi, lekin hammasini aytmaydi", "😐 Ozgina uzoq", "💬 Do'stlardek"],
    oo: ["🤗 Juda yaqinmiz", "🙂 Yaxshi, lekin hammasini aytmayman", "😐 Ozgina uzoqmiz", "💬 Do'stlardekmiz"] }, // #49
  { tag: "love", o: "Yolg'izlikni qanday his qilasiz?", g: "yolg'izlikni qanday his qiladi?",
    opts: ["🧘 Tinchlik deb biladi", "😔 Unga og'ir", "⚖️ Ba'zan kerak, ba'zan yo'q", "🏃 Qochadi, doim odam bilan bo'lishni xohlaydi"],
    oo: ["🧘 Tinchlik deb bilaman", "😔 Menga og'ir", "⚖️ Ba'zan kerak, ba'zan yo'q", "🏃 Qochaman, doim odam bilan bo'lishni xohlayman"] }, // #50
  { tag: "love", o: "Kimdir sizni yaxshi ko'rishini qanday bilasiz?", g: "kimdir uni yaxshi ko'rishini qanday biladi?",
    opts: ["💬 Aytganda", "🎁 Qilgan ishlaridan", "👀 Qarashlaridan", "⏰ Vaqt ajratishidan"] }, // #51
  { tag: "love", o: "Siz uchun eng romantik joy qaysi?", g: "uchun eng romantik joy qaysi?",
    opts: ["🌅 Dengiz bo'yi", "🏔 Tog'", "🌃 Tungi shahar", "🏡 Uy, sham yorug'ida"] }, // #52
  { tag: "love", o: "Yaqin odamingiz sizni xafa qilsa, buni aytasizmi?", g: "{N:ni} yaqini xafa qilsa, buni aytadimi?",
    opts: ["🗣 Darhol aytadi", "⏳ Biroz o'tgach aytadi", "🤐 Ichiga yutadi", "😢 Yig'lab bildiradi"],
    oo: ["🗣 Darhol aytaman", "⏳ Biroz o'tgach aytaman", "🤐 Ichimga yutaman", "😢 Yig'lab bildiraman"] }, // #53
  { tag: "love", o: "Munosabatdagi eng katta xato nima?", g: "munosabatdagi eng katta xatoni nima deb biladi?",
    opts: ["🤥 Yolg'on", "💔 Xiyonat", "🔇 Gaplashmaslik", "🙄 Qadrlamaslik"] }, // #54
  { tag: "love", o: "Sevgi qanday paydo bo'ladi, deb o'ylaysiz?", g: "sevgi qanday paydo bo'ladi, deb o'ylaydi?",
    opts: ["⚡️ Birinchi nazarda", "⏳ Vaqt o'tib, tanishgach", "🤝 Avval do'st bo'lib", "🤷 Sevgiga unchalik ishonmaydi"],
    oo: ["⚡️ Birinchi nazarda", "⏳ Vaqt o'tib, tanishgach", "🤝 Avval do'st bo'lib", "🤷 Sevgiga unchalik ishonmayman"] }, // #55
  { tag: "friend", o: "Do'stlar guruhida qaysi rolni o'ynaysiz?", g: "do'stlar guruhida qaysi rolni o'ynaydi?",
    opts: ["🤡 Hazilkash", "🧠 Aqlli maslahatchi", "🎉 Tashabbuskor, hammani yig'adi", "🎧 Jim tinglovchi"],
    oo: ["🤡 Hazilkash", "🧠 Aqlli maslahatchi", "🎉 Tashabbuskor, hammani yig'aman", "🎧 Jim tinglovchi"] }, // #56
  { tag: "friend", o: "Do'stingiz noto'g'ri ish qilsa, nima qilasiz?", g: "{N:ning} do'sti noto'g'ri ish qilsa, nima qiladi?",
    opts: ["🗣 Yuziga aytadi", "🤝 Qo'llab-quvvatlaydi", "🤐 Aralashmaydi", "🎯 Boshqa yo'l bilan tushuntiradi"],
    oo: ["🗣 Yuziga aytaman", "🤝 Qo'llab-quvvatlayman", "🤐 Aralashmayman", "🎯 Boshqa yo'l bilan tushuntiraman"] }, // #57
  { tag: "friend", o: "Eng yaqin do'stingiz bilan qanchalik tez-tez gaplashasiz?", g: "eng yaqin do'sti bilan qanchalik tez-tez gaplashadi?",
    opts: ["📱 Har kuni", "📅 Haftada bir necha marta", "🗓 Oyiga bir-ikki marta", "🔁 Faqat kerak bo'lganda"] }, // #58
  { tag: "friend", o: "Do'stingizning tug'ilgan kuniga nima sovg'a qilasiz?", g: "do'stining tug'ilgan kuniga nima sovg'a qiladi?",
    opts: ["🎁 Qimmat sovg'a", "💌 Chiroyli tabrik va gul", "🍰 Tort va ziyofat", "💸 Pul beradi"],
    oo: ["🎁 Qimmat sovg'a", "💌 Chiroyli tabrik va gul", "🍰 Tort va ziyofat", "💸 Pul beraman"] }, // #59
  { tag: "friend", o: "Do'stlaringiz bilan qayerda ko'proq vaqt o'tkazasiz?", g: "do'stlari bilan qayerda ko'proq vaqt o'tkazadi?",
    opts: ["☕️ Kafe", "🌳 Park yoki ko'cha", "🏠 Uyda", "🎮 Onlayn"] }, // #60
  { tag: "friend", o: "Do'stingiz qarz so'rasa, nima qilasiz?", g: "{N:ning} do'sti undan qarz so'rasa, nima qiladi?",
    opts: ["🤲 Hech o'ylamay beradi", "🤔 Sababini so'raydi", "💸 Ozroq beradi", "🙅 Bermaslikka harakat qiladi"],
    oo: ["🤲 Hech o'ylamay beraman", "🤔 Sababini so'rayman", "💸 Ozroq beraman", "🙅 Bermaslikka harakat qilaman"] }, // #61
  { tag: "friend", o: "Yangi do'st orttirish sizga qanchalik oson?", g: "{N:ga} yangi do'st orttirish qanchalik oson?",
    opts: ["😎 Juda oson, hamma bilan topishadi", "🙂 Biroz vaqt kerak", "😶 Qiyin, uyaladi", "🎯 Kam do'st, lekin sodiq"],
    oo: ["😎 Juda oson, hamma bilan topishaman", "🙂 Biroz vaqt kerak", "😶 Qiyin, uyalaman", "🎯 Kam do'st, lekin sodiq"] }, // #62
  { tag: "friend", o: "Do'stingiz uchrashuvga kech qolsa, nima qilasiz?", g: "{N:ning} do'sti uchrashuvga kech qolsa, nima qiladi?",
    opts: ["😤 Jahli chiqadi", "😌 Tinchgina kutadi", "📞 Qo'ng'iroq qiladi", "🚶 Ketib qoladi"],
    oo: ["😤 Jahlim chiqadi", "😌 Tinchgina kutaman", "📞 Qo'ng'iroq qilaman", "🚶 Ketib qolaman"] }, // #63
  { tag: "friend", o: "Do'stlaringiz sizni qanday ta'riflashadi?", g: "{N:ni} do'stlari qanday ta'riflashadi?",
    opts: ["😂 Kulgili", "🤝 Sodiq", "🧠 Aqlli", "❤️ Mehribon"] }, // #64
  { tag: "friend", o: "Sayohatga kim bilan borishni xohlaysiz?", g: "sayohatga kim bilan borishni xohlaydi?",
    opts: ["🫂 Do'stlari bilan", "👨‍👩‍👧 Oilasi bilan", "❤️ Sevgan odami bilan", "🧍 Yolg'iz"],
    oo: ["🫂 Do'stlarim bilan", "👨‍👩‍👧 Oilam bilan", "❤️ Sevgan odamim bilan", "🧍 Yolg'iz"] }, // #65
  { tag: "friend", o: "Do'stingiz bilan eng ko'p nima haqida gaplashasiz?", g: "do'sti bilan eng ko'p nima haqida gaplashadi?",
    opts: ["💼 Ish va o'qish", "❤️ Sevgi va munosabat", "😂 Hazil va mem", "🌟 Orzu va rejalar"] }, // #66
  { tag: "friend", o: "Do'stingiz sizni xafa qilsa, kechirasizmi?", g: "{N:ni} do'sti xafa qilsa, kechiradimi?",
    opts: ["🕊 Tez kechiradi", "⏳ Ko'p vaqt o'tgach kechiradi", "🚪 Qaytib gaplashmaydi", "🗣 Gaplashib hal qiladi"],
    oo: ["🕊 Tez kechiraman", "⏳ Ko'p vaqt o'tgach kechiraman", "🚪 Qaytib gaplashmayman", "🗣 Gaplashib hal qilaman"] }, // #67
  { tag: "friend", o: "Guruhda kimdir yolg'iz qolsa, nima qilasiz?", g: "guruhda kimdir yolg'iz qolsa, nima qiladi?",
    opts: ["🤗 Yoniga borib gaplashadi", "👀 Kuzatadi, lekin aralashmaydi", "📣 Hammani unga jalb qiladi", "🙈 E'tibor bermaydi"],
    oo: ["🤗 Yoniga borib gaplashaman", "👀 Kuzataman, lekin aralashmayman", "📣 Hammani unga jalb qilaman", "🙈 E'tibor bermayman"] }, // #68
  { tag: "friend", o: "Sirlaringizni eng ko'p kimga aytasiz?", g: "sirlarini eng ko'p kimga aytadi?",
    opts: ["🫂 Eng yaqin do'stiga", "👩 Onasiga", "❤️ Sevgan odamiga", "🤐 Hech kimga"],
    oo: ["🫂 Eng yaqin do'stimga", "👩 Onamga", "❤️ Sevgan odamimga", "🤐 Hech kimga"] }, // #69
  { tag: "friend", o: "Do'stlaringiz sizning nimangizga eng ko'p kulishadi?", g: "{N:ning} do'stlari eng ko'p nimasiga kulishadi?",
    opts: ["😴 Uyquchanligiga", "🤷 Narsalarni yo'qotib qo'yishiga", "📱 Telefonga yopishib qolishiga", "🕐 Kech qolishiga"],
    oo: ["😴 Uyquchanligimga", "🤷 Narsalarni yo'qotib qo'yishimga", "📱 Telefonga yopishib qolishimga", "🕐 Kech qolishimga"] }, // #70
  { tag: "friend", o: "Do'stingiz tunda yordam so'rasa, nima qilasiz?", g: "{N:ning} do'sti tunda yordam so'rasa, nima qiladi?",
    opts: ["🌙 Darhol boradi", "📞 Telefonda yordam beradi", "⏰ Ertalab boradi", "🤔 Sababiga qarab"],
    oo: ["🌙 Darhol boraman", "📞 Telefonda yordam beraman", "⏰ Ertalab boraman", "🤔 Sababiga qarab"] }, // #71
  { tag: "life", o: "Ertalab uyg'onib, birinchi nima qilasiz?", g: "ertalab uyg'onib, birinchi nima qiladi?",
    opts: ["📱 Telefonga qaraydi", "🚿 Dush qabul qiladi", "☕️ Choy yoki kofe ichadi", "🛏 Yana uxlaydi"],
    oo: ["📱 Telefonga qarayman", "🚿 Dush qabul qilaman", "☕️ Choy yoki kofe ichaman", "🛏 Yana uxlayman"] }, // #72
  { tag: "life", o: "Qaysi vaqtda eng samarali ishlaysiz?", g: "qaysi vaqtda eng samarali ishlaydi?",
    opts: ["🌅 Ertalab", "☀️ Kunduzi", "🌆 Kechqurun", "🌙 Tunda"] }, // #73
  { tag: "life", o: "Pulni qanday sarflaysiz?", g: "pulni qanday sarflaydi?",
    opts: ["🛍 Darhol sarflab yuboradi", "🏦 Yig'adi", "📊 Rejalashtirib ishlatadi", "🎁 Boshqalarga sarflaydi"],
    oo: ["🛍 Darhol sarflab yuboraman", "🏦 Yig'aman", "📊 Rejalashtirib ishlataman", "🎁 Boshqalarga sarflayman"] }, // #74
  { tag: "life", o: "Yo'lda ketayotib nima qilasiz?", g: "yo'lda ketayotib nima qiladi?",
    opts: ["🎧 Musiqa tinglaydi", "📱 Telefonda o'tiradi", "🪟 Derazadan qaraydi", "😴 Uxlab ketadi"],
    oo: ["🎧 Musiqa tinglayman", "📱 Telefonda o'tiraman", "🪟 Derazadan qarayman", "😴 Uxlab ketaman"] }, // #75
  { tag: "life", o: "Kunni qanday tugatasiz?", g: "kunni qanday tugatadi?",
    opts: ["📺 Serial yoki kino ko'radi", "📱 Ijtimoiy tarmoqlarda o'tiradi", "📖 Kitob o'qiydi", "💭 Yotib o'ylaydi"],
    oo: ["📺 Serial yoki kino ko'raman", "📱 Ijtimoiy tarmoqlarda o'tiraman", "📖 Kitob o'qiyman", "💭 Yotib o'ylayman"] }, // #76
  { tag: "life", o: "Xonangiz odatda qanday holatda bo'ladi?", g: "{N:ning} xonasi odatda qanday holatda bo'ladi?",
    opts: ["✨ Top-toza va tartibli", "🙂 O'rtacha", "🌪 Biroz tartibsiz", "💥 To'polon"] }, // #77
  { tag: "life", o: "Odatda soat nechada turasiz?", g: "odatda soat nechada turadi?",
    opts: ["🌄 5-6 da", "⏰ 7-8 da", "🕘 9-10 da", "🕛 Tushga yaqin"] }, // #78
  { tag: "life", o: "Sport bilan shug'ullanasizmi?", g: "sport bilan shug'ullanadimi?",
    opts: ["🏋️ Muntazam", "🚶 Ba'zan, yurish bilan", "🛋 Rejalashtiradi, lekin boshlamaydi", "🙅 Yo'q"],
    oo: ["🏋️ Muntazam", "🚶 Ba'zan, yurish bilan", "🛋 Rejalashtiraman, lekin boshlamayman", "🙅 Yo'q"] }, // #79
  { tag: "life", o: "Kuningizning eng ko'p qismi nimaga ketadi?", g: "{N:ning} kunining eng ko'p qismi nimaga ketadi?",
    opts: ["💼 Ish yoki o'qish", "📱 Telefon", "🚗 Yo'l", "🛋 Dam olish"] }, // #80
  { tag: "life", o: "Xarid qilganda eng avval nimaga qaraysiz?", g: "xarid qilganda eng avval nimaga qaraydi?",
    opts: ["💰 Narxiga", "⭐️ Sifatiga", "🎨 Ko'rinishiga", "🏷 Brendiga"] }, // #81
  { tag: "life", o: "Uydan chiqayotganda eng avval nimani olasiz?", g: "uydan chiqayotganda eng avval nimani oladi?",
    opts: ["📱 Telefon", "🔑 Kalit", "💳 Hamyon", "🎧 Quloqchin"] }, // #82
  { tag: "life", o: "Ovqatni qayerda yeyishni yoqtirasiz?", g: "ovqatni qayerda yeyishni yoqtiradi?",
    opts: ["🏠 Uyda", "🍽 Restoranda", "🥡 Olib ketib, yo'lda", "🌳 Tabiatda"] }, // #83
  { tag: "life", o: "Telefoningizni qancha vaqtda almashtirasiz?", g: "telefonini qancha vaqtda almashtiradi?",
    opts: ["🆕 Har yili yangisini oladi", "📆 2-3 yilda", "🔧 Buzilguncha ishlatadi", "💸 Pul bo'lganda"],
    oo: ["🆕 Har yili yangisini olaman", "📆 2-3 yilda", "🔧 Buzilguncha ishlataman", "💸 Pul bo'lganda"] }, // #84
  { tag: "life", o: "Yomg'ir yog'sa nima qilasiz?", g: "yomg'ir yog'sa nima qiladi?",
    opts: ["🏠 Uyda choy ichadi", "🚶 Ko'chada yuradi", "😞 Kayfiyati tushadi", "🎬 Kino qo'yadi"],
    oo: ["🏠 Uyda choy ichaman", "🚶 Ko'chada yuraman", "😞 Kayfiyatim tushadi", "🎬 Kino qo'yaman"] }, // #85
  { tag: "life", o: "Eng ko'p nimani yo'qotib qo'yasiz?", g: "eng ko'p nimani yo'qotib qo'yadi?",
    opts: ["🔑 Kalit", "📱 Telefon", "🎧 Quloqchin", "🧾 Mayda-chuyda narsalar"] }, // #86
  { tag: "life", o: "Vaqtga qanchalik rioya qilasiz?", g: "vaqtga qanchalik rioya qiladi?",
    opts: ["⏱ Doim aniq vaqtida", "🕐 5-10 daqiqa kechikadi", "🐢 Tez-tez kechikadi", "🧘 Vaqtga bog'lanmaydi"],
    oo: ["⏱ Doim aniq vaqtida", "🕐 5-10 daqiqa kechikaman", "🐢 Tez-tez kechikaman", "🧘 Vaqtga bog'lanmayman"] }, // #87
  { tag: "life", o: "Kuniga qancha choy yoki kofe ichasiz?", g: "kuniga qancha choy yoki kofe ichadi?",
    opts: ["1️⃣ 1-2 stakan", "3️⃣ 3-4 stakan", "🔥 5 tadan ko'p", "🚫 Deyarli ichmaydi"],
    oo: ["1️⃣ 1-2 stakan", "3️⃣ 3-4 stakan", "🔥 5 tadan ko'p", "🚫 Deyarli ichmayman"] }, // #88
  { tag: "taste", o: "Qaysi musiqa janrini yoqtirasiz?", g: "qaysi musiqa janrini yoqtiradi?",
    opts: ["🎤 Rep", "🎶 Pop", "🎻 Milliy qo'shiqlar", "🎸 Rok"] }, // #89
  { tag: "taste", o: "Qaysi janrdagi kinolarni yoqtirasiz?", g: "qaysi janrdagi kinolarni yoqtiradi?",
    opts: ["😂 Komediya", "😱 Qo'rqinchli", "💥 Jangari", "🥹 Melodrama"] }, // #90
  { tag: "taste", o: "Sevimli shirinligingiz nima?", g: "{N:ning} sevimli shirinligi nima?",
    opts: ["🍰 Tort", "🍫 Shokolad", "🍨 Muzqaymoq", "🍯 Halva yoki navvot"] }, // #91
  { tag: "taste", o: "Qaysi taomni har kuni yeya olasiz?", g: "qaysi taomni har kuni yeya oladi?",
    opts: ["🍚 Palov", "🍝 Makaron", "🍟 Fast-fud", "🍲 Sho'rva"] }, // #92
  { tag: "taste", o: "Sovuq ichimlikmi yoki issiqmi?", g: "sovuq va issiq ichimlikdan qaysi birini afzal ko'radi?",
    opts: ["🧊 Sovuq", "☕️ Issiq", "🌡 Mavsumga qarab", "🤷 Farqi yo'q"] }, // #93
  { tag: "taste", o: "Qaysi rangni yoqtirasiz?", g: "qaysi rangni yoqtiradi?",
    opts: ["🖤 Qora", "🤍 Oq", "💙 Ko'k", "❤️ Qizil"] }, // #94
  { tag: "taste", o: "Qaysi mashinani orzu qilasiz?", g: "qaysi mashinani orzu qiladi?",
    opts: ["🚙 Jip", "🏎 Sport mashina", "🚘 Oddiy sedan", "⚡️ Elektromobil"] }, // #95
  { tag: "taste", o: "Qaysi kiyim uslubini yoqtirasiz?", g: "qaysi kiyim uslubini yoqtiradi?",
    opts: ["👕 Sport", "👔 Klassik", "🧥 Ko'cha uslubi", "👗 Milliy kiyim"] }, // #96
  { tag: "taste", o: "Uyda qaysi hayvonni saqlashni xohlaysiz?", g: "uyda qaysi hayvonni saqlashni xohlaydi?",
    opts: ["🐱 Mushuk", "🐶 It", "🐠 Baliq", "🦜 Qush"] }, // #97
  { tag: "taste", o: "Kitob o'qiysizmi?", g: "kitob o'qiydimi?",
    opts: ["📚 Muntazam o'qiydi", "📖 Ba'zan o'qiydi", "🎧 Audiokitob eshitadi", "🙅 Deyarli o'qimaydi"],
    oo: ["📚 Muntazam o'qiyman", "📖 Ba'zan o'qiyman", "🎧 Audiokitob eshitaman", "🙅 Deyarli o'qimayman"] }, // #98
  { tag: "taste", o: "Qaysi sport turini yoqtirasiz?", g: "qaysi sport turini yoqtiradi?",
    opts: ["⚽️ Futbol", "🥊 Jang san'ati", "🏀 Basketbol", "🏊 Suzish"] }, // #99
  { tag: "taste", o: "Qaysi mevani yaxshi ko'rasiz?", g: "qaysi mevani yaxshi ko'radi?",
    opts: ["🍉 Tarvuz", "🍇 Uzum", "🍎 Olma", "🍑 Shaftoli"] }, // #100
  { tag: "taste", o: "Qaysi mamlakatda yashashni xohlaysiz?", g: "qaysi mamlakatda yashashni xohlaydi?",
    opts: ["🇺🇿 O'zbekiston", "🇹🇷 Turkiya", "🇦🇪 BAA", "🇩🇪 Germaniya"] }, // #101
  { tag: "taste", o: "Qaysi o'yin turini yoqtirasiz?", g: "qaysi o'yin turini yoqtiradi?",
    opts: ["📱 Telefon o'yinlari", "🎮 PlayStation", "♟ Shaxmat va mantiqiy o'yinlar", "🎲 Stol o'yinlari"] }, // #102
  { tag: "taste", o: "Qaysi ta'mni yoqtirasiz?", g: "qaysi ta'mni yoqtiradi?",
    opts: ["🌶 Achchiq", "🍬 Shirin", "🍋 Nordon", "🧂 Sho'r"] }, // #103
  { tag: "taste", o: "Qaysi telefon markasini yoqtirasiz?", g: "qaysi telefon markasini yoqtiradi?",
    opts: ["🍎 iPhone", "🤖 Samsung", "📱 Xiaomi", "🔧 Boshqa"] }, // #104
  { tag: "dilemma", o: "Bitta narsadan abadiy voz kechishingiz kerak bo'lsa, nimani tanlaysiz?", g: "bitta narsadan abadiy voz kechishi kerak bo'lsa, nimani tanlaydi?",
    opts: ["📱 Telefon", "🍟 Sevimli taom", "🎧 Musiqa", "📺 Kino va seriallar"] }, // #105
  { tag: "dilemma", o: "Siz qaysi biriga o'xshaysiz?", g: "o'zini qaysi biriga o'xshatadi?",
    opts: ["🦉 Boyqush (kech uxlaydi)", "🐓 Xo'roz (erta turadi)", "🐻 Ayiq (ko'p uxlaydi)", "🐜 Chumoli (doim band)"],
    oo: ["🦉 Boyqush (kech uxlayman)", "🐓 Xo'roz (erta turaman)", "🐻 Ayiq (ko'p uxlayman)", "🐜 Chumoli (doim bandman)"] }, // #106
  { tag: "dilemma", o: "Bir hafta telefonsiz qolsangiz, nima qilasiz?", g: "bir hafta telefonsiz qolsa, nima qiladi?",
    opts: ["😱 Chiday olmaydi", "🌿 Rohatlanadi", "📚 Kitob o'qiydi", "🚶 Do'stlari bilan ko'proq chiqadi"],
    oo: ["😱 Chiday olmayman", "🌿 Rohatlanaman", "📚 Kitob o'qiyman", "🚶 Do'stlarim bilan ko'proq chiqaman"] }, // #107
  { tag: "dilemma", o: "Vaqt mashinasi bo'lsa, qayerga borasiz?", g: "vaqt mashinasi bo'lsa, qayerga boradi?",
    opts: ["🦖 O'tmishga", "🚀 Kelajakka", "👶 Bolaligiga", "🚫 Hech qayerga"],
    oo: ["🦖 O'tmishga", "🚀 Kelajakka", "👶 Bolaligimga", "🚫 Hech qayerga"] }, // #108
  { tag: "dilemma", o: "Bir kunga cheksiz mablag' olsangiz, nima qilasiz?", g: "bir kunga cheksiz mablag' olsa, nima qiladi?",
    opts: ["🛍 Hammasiga xarid qiladi", "🍽 Hammaga ziyofat beradi", "🤲 Muhtojlarga beradi", "🏦 Bankka qo'yib qo'yadi"],
    oo: ["🛍 Hammasiga xarid qilaman", "🍽 Hammaga ziyofat beraman", "🤲 Muhtojlarga beraman", "🏦 Bankka qo'yib qo'yaman"] }, // #109
  { tag: "dilemma", o: "Orolda qolib ketsangiz, yoningizda kim bo'lishini xohlaysiz?", g: "orolda qolib ketsa, yonida kim bo'lishini xohlaydi?",
    opts: ["👩 Onasi", "🫂 Eng yaqin do'sti", "❤️ Sevgan odami", "🧗 Omon qolish bo'yicha mutaxassis"],
    oo: ["👩 Onam", "🫂 Eng yaqin do'stim", "❤️ Sevgan odamim", "🧗 Omon qolish bo'yicha mutaxassis"] }, // #110
  { tag: "dilemma", o: "Mashhur bo'lsangiz, nimangiz bilan mashhur bo'lishni xohlaysiz?", g: "mashhur bo'lsa, nimasi bilan mashhur bo'lishni xohlaydi?",
    opts: ["🎤 Ovozi bilan", "🧠 Aqli bilan", "😂 Hazili bilan", "💼 Biznesi bilan"],
    oo: ["🎤 Ovozim bilan", "🧠 Aqlim bilan", "😂 Hazilim bilan", "💼 Biznesim bilan"] }, // #111
  { tag: "dilemma", o: "Bir kun hech qanday majburiyat bo'lmasa, nima qilasiz?", g: "bir kun hech qanday majburiyat bo'lmasa, nima qiladi?",
    opts: ["😴 Kun bo'yi uxlaydi", "✈️ Yo'lga chiqib ketadi", "👯 Do'stlari bilan bo'ladi", "📺 Kino maratoni qiladi"],
    oo: ["😴 Kun bo'yi uxlayman", "✈️ Yo'lga chiqib ketaman", "👯 Do'stlarim bilan bo'laman", "📺 Kino maratoni qilaman"] }, // #112
  { tag: "dilemma", o: "Bir zumda qaysi tilni bilishni tanlaysiz?", g: "bir zumda qaysi tilni bilishni tanlaydi?",
    opts: ["🇬🇧 Ingliz tili", "🇰🇷 Koreys tili", "🇨🇳 Xitoy tili", "🇩🇪 Nemis tili"] }, // #113
  { tag: "dilemma", o: "Hayvon bilan gaplasha olsangiz, qaysi hayvonni tanlaysiz?", g: "hayvon bilan gaplasha olsa, qaysi hayvonni tanlaydi?",
    opts: ["🐶 It", "🐱 Mushuk", "🐴 Ot", "🐦 Qush"] }, // #114
  { tag: "dilemma", o: "Bir kunga boshqa odam bo'lsangiz, kim bo'lardingiz?", g: "bir kunga boshqa odam bo'lsa, kim bo'lardi?",
    opts: ["🏆 Mashhur sportchi", "🎤 Mashhur qo'shiqchi", "💰 Milliarder", "🚀 Astronavt"] }, // #115
  { tag: "dilemma", o: "Tarixdagi qaysi shaxs bilan suhbatlashishni xohlaysiz?", g: "tarixdagi qaysi shaxs bilan suhbatlashishni xohlaydi?",
    opts: ["👑 Amir Temur", "🔭 Mirzo Ulug'bek", "📖 Alisher Navoiy", "🧬 Ibn Sino"] }, // #116
  { tag: "dilemma", o: "Qaysi ish sizga eng qiyin?", g: "{N:ga} qaysi ish eng qiyin?",
    opts: ["⏰ Erta turish", "🏃 Sport qilish", "📚 Kitob o'qish", "🧹 Uy yig'ishtirish"] }, // #117
  { tag: "dilemma", o: "Qaysi xususiyatga ega bo'lishni tanlaysiz?", g: "qaysi xususiyatga ega bo'lishni tanlaydi?",
    opts: ["💪 Kuchli", "🧠 Aqlli", "💰 Boy", "✨ Chiroyli"] }, // #118
  { tag: "fun", o: "Uyda yolg'iz qolsangiz nima qilasiz?", g: "uyda yolg'iz qolsa nima qiladi?",
    opts: ["💃 Musiqa qo'yib raqsga tushadi", "🍕 Muzlatgichni titkilaydi", "📱 Telefonga yopishadi", "😴 Uxlab qoladi"],
    oo: ["💃 Musiqa qo'yib raqsga tushaman", "🍕 Muzlatgichni titkilayman", "📱 Telefonga yopishaman", "😴 Uxlab qolaman"] }, // #119
  { tag: "fun", o: "Dushda qo'shiq aytasizmi?", g: "dushda qo'shiq aytadimi?",
    opts: ["🎤 Har doim, butun uy eshitadi", "🤫 Ichida, past ovozda", "🚿 Yo'q, tez yuvinib chiqadi", "🎶 Faqat kayfiyati yaxshi bo'lsa"],
    oo: ["🎤 Har doim, butun uy eshitadi", "🤫 Ichimda, past ovozda", "🚿 Yo'q, tez yuvinib chiqaman", "🎶 Faqat kayfiyatim yaxshi bo'lsa"] }, // #120
  { tag: "fun", o: "Kechikib qolsangiz, nima deysiz?", g: "kechikib qolsa, nima deydi?",
    opts: ["🚗 «Yo'ldaman, 5 daqiqa»", "🚦 «Tirbandlik bo'ldi»", "🙏 «Uzr, uxlab qolibman»", "📵 Hech narsa demaydi, shunchaki keladi"],
    oo: ["🚗 «Yo'ldaman, 5 daqiqa»", "🚦 «Tirbandlik bo'ldi»", "🙏 «Uzr, uxlab qolibman»", "📵 Hech narsa demayman, shunchaki kelaman"] }, // #121
  { tag: "fun", o: "Bitta chiroyli selfi uchun nechta surat olasiz?", g: "bitta chiroyli selfi uchun nechta surat oladi?",
    opts: ["📸 1-2 ta", "🤳 5-10 ta", "🔁 20 tadan ko'p", "🙈 Umuman selfi olmaydi"],
    oo: ["📸 1-2 ta", "🤳 5-10 ta", "🔁 20 tadan ko'p", "🙈 Umuman selfi olmayman"] }, // #122
  { tag: "fun", o: "Qaysi ovqatni yoqtirmaysiz?", g: "qaysi ovqatni yoqtirmaydi?",
    opts: ["🐟 Baliq", "🍄 Qo'ziqorin", "🍆 Baqlajon", "🥛 Qatiq"] }, // #123
  { tag: "fun", o: "Yarim tunda och qolsangiz nima qilasiz?", g: "yarim tunda och qolsa nima qiladi?",
    opts: ["🍳 O'zi tayyorlaydi", "🛵 Yetkazib berishga buyurtma beradi", "🥪 Muzlatgichdan bor narsani yeydi", "😤 Chidab uxlab qoladi"],
    oo: ["🍳 O'zim tayyorlayman", "🛵 Yetkazib berishga buyurtma beraman", "🥪 Muzlatgichdan bor narsani yeyman", "😤 Chidab uxlab qolaman"] }, // #124
  { tag: "fun", o: "Eng yoqtirgan bayramingiz qaysi?", g: "{N:ning} eng yoqtirgan bayrami qaysi?",
    opts: ["🎆 Navro'z", "🎂 Tug'ilgan kun", "🥂 Yangi yil", "🌙 Hayit"] }, // #125
  { tag: "fun", o: "Hamma oldida yiqilib tushsangiz, nima qilasiz?", g: "hamma oldida yiqilib tushsa, nima qiladi?",
    opts: ["😂 O'zi birinchi bo'lib kuladi", "😳 Qizarib, tezda ketib qoladi", "🙂 Hech narsa bo'lmagandek davom etadi", "🤕 Og'riganini yashirib, jilmayadi"],
    oo: ["😂 O'zim birinchi bo'lib kulaman", "😳 Qizarib, tezda ketib qolaman", "🙂 Hech narsa bo'lmagandek davom etaman", "🤕 Og'riganini yashirib, jilmayaman"] }, // #126
  { tag: "fun", o: "Yoqmagan sovg'a olsangiz, nima qilasiz?", g: "yoqmagan sovg'a olsa, nima qiladi?",
    opts: ["😊 Rahmat aytib, xursand bo'lib ko'rsatadi", "🔁 Boshqa odamga sovg'a qilib yuboradi", "😅 Rostini aytib qo'yadi", "🗄 Shkafga solib qo'yadi"],
    oo: ["😊 Rahmat aytib, xursand bo'lib ko'rsataman", "🔁 Boshqa odamga sovg'a qilib yuboraman", "😅 Rostini aytib qo'yaman", "🗄 Shkafga solib qo'yaman"] }, // #127
  { tag: "fun", o: "Zombi apokalipsisi boshlansa, birinchi nima qilasiz?", g: "zombi apokalipsisi boshlansa, birinchi nima qiladi?",
    opts: ["🏃 Qochib ketadi", "🛒 Do'konga borib yegulik yig'adi", "📞 Yaqinlarini qidiradi", "⚔️ Jang qilishga tayyorlanadi"],
    oo: ["🏃 Qochib ketaman", "🛒 Do'konga borib yegulik yig'aman", "📞 Yaqinlarimni qidiraman", "⚔️ Jang qilishga tayyorlanaman"] }, // #128
  { tag: "fun", o: "Telefoningiz galereyasida eng ko'p nima bor?", g: "{N:ning} telefoni galereyasida eng ko'p nima bor?",
    opts: ["🤳 Selfilar", "🍽 Taom suratlari", "📸 Skrinshotlar", "🐱 Hayvonlar va mem suratlari"] }, // #129
  { tag: "fun", o: "Do'konga bitta narsa uchun kirsangiz, nechta narsa bilan chiqasiz?", g: "do'konga bitta narsa uchun kirsa, nechta narsa bilan chiqadi?",
    opts: ["1️⃣ Faqat o'sha narsani oladi", "🛒 3-4 ta qo'shimcha narsa oladi", "🛍 To'la savat bilan chiqadi", "🚪 Hech narsa olmasdan chiqib ketadi"],
    oo: ["1️⃣ Faqat o'sha narsani olaman", "🛒 3-4 ta qo'shimcha narsa olaman", "🛍 To'la savat bilan chiqaman", "🚪 Hech narsa olmasdan chiqib ketaman"] }, // #130
  { tag: "fun", o: "Eng ko'p qaysi bahonani ishlatasiz?", g: "eng ko'p qaysi bahonani ishlatadi?",
    opts: ["😴 «Uxlab qolibman»", "🚦 «Tirbandlik bo'ldi»", "📵 «Telefonim o'chib qolgan edi»", "🤒 «Ahvolim yaxshi emas edi»"] }, // #131
  { tag: "fun", o: "Ovqat yeyayotganda telefon ushlaysizmi?", g: "ovqat yeyayotganda telefon ushlaydimi?",
    opts: ["📱 Doim, telefonsiz yeyolmaydi", "📺 Faqat video ko'rib yeydi", "🍽 Yo'q, telefonni qo'yib yeydi", "🙈 Aytishdan uyaladi"],
    oo: ["📱 Doim, telefonsiz yeyolmayman", "📺 Faqat video ko'rib yeyman", "🍽 Yo'q, telefonni qo'yib yeyman", "🙈 Aytishdan uyalaman"] }, // #132
  { tag: "fun", o: "Eng ko'p qaysi emojini ishlatasiz?", g: "eng ko'p qaysi emojini ishlatadi?",
    opts: ["😂 Kulgi", "❤️ Yurak", "😭 Yig'i", "🔥 Olov"] }, // #133
  { tag: "fun", o: "Yangi yil kechasi soat 00:00 da nima qilasiz?", g: "Yangi yil kechasi soat 00:00 da nima qiladi?",
    opts: ["🙏 Tilak tilaydi", "📱 Hammaga tabrik yuboradi", "🎆 Ko'chaga chiqib, salyut ko'radi", "😴 Allaqachon uxlab qolgan bo'ladi"],
    oo: ["🙏 Tilak tilayman", "📱 Hammaga tabrik yuboraman", "🎆 Ko'chaga chiqib, salyut ko'raman", "😴 Allaqachon uxlab qolgan bo'laman"] }, // #134
  { tag: "fun", o: "Qaysi mavzuda soatlab gapira olasiz?", g: "qaysi mavzuda soatlab gapira oladi?",
    opts: ["⚽️ Futbol va sport", "💻 Texnologiya", "🎬 Kino va seriallar", "🍳 Ovqat va retseptlar"] }, // #135
  { tag: "deep", o: "O'zingizda qaysi xususiyatni o'zgartirgingiz kelardi?", g: "o'zida qaysi xususiyatni o'zgartirishni xohlaydi?",
    opts: ["😤 Jahldorlikni", "😶 Uyatchanlikni", "🐢 Dangasalikni", "😟 Ko'p tashvishlanishni"] }, // #136
  { tag: "deep", o: "Qaysi yutuq sizga eng ko'p g'urur bag'ishlaydi?", g: "qaysi yutug'idan eng ko'p g'ururlanadi?",
    opts: ["🎓 O'qishdagi yutug'i", "💼 Ishdagi yutug'i", "💪 O'zini yengani", "🏅 Hali eng kattasi oldinda"],
    oo: ["🎓 O'qishdagi yutug'im", "💼 Ishdagi yutug'im", "💪 O'zimni yengganim", "🏅 Hali eng kattasi oldinda"] }, // #137
  { tag: "deep", o: "Yolg'iz qolganda ko'proq nimani o'ylaysiz?", g: "yolg'iz qolganda ko'proq nimani o'ylaydi?",
    opts: ["🔮 Kelajakni", "⏪ O'tmishni", "👨‍👩‍👧 Yaqinlarini", "💭 Hech narsani, shunchaki dam oladi"],
    oo: ["🔮 Kelajakni", "⏪ O'tmishni", "👨‍👩‍👧 Yaqinlarimni", "💭 Hech narsani, shunchaki dam olaman"] }, // #138
  { tag: "deep", o: "Hayotda sizga qaysi biri muhimroq?", g: "hayotda qaysi birini muhimroq biladi?",
    opts: ["🕊 Tinchlik", "🏆 Yutuq", "❤️ Muhabbat", "🎓 Bilim"] }, // #139
  { tag: "deep", o: "Kimdir sizga ishonmasa, nima qilasiz?", g: "{N:ga} kimdir ishonmasa, nima qiladi?",
    opts: ["💪 Isbotlab ko'rsatadi", "🤷 Parvo qilmaydi", "😞 Xafa bo'ladi", "🗣 Tushuntirishga urinadi"],
    oo: ["💪 Isbotlab ko'rsataman", "🤷 Parvo qilmayman", "😞 Xafa bo'laman", "🗣 Tushuntirishga urinaman"] }, // #140
  { tag: "deep", o: "Kimgadir bergan va'dangizni bajara olmasangiz, nima qilasiz?", g: "kimgadir bergan va'dasini bajara olmasa, nima qiladi?",
    opts: ["🙏 Ochiq aytib, uzr so'raydi", "😬 Bahona topadi", "🔁 Baribir uddalashga harakat qiladi", "🤐 Jim qolib, mavzuni chetlab o'tadi"],
    oo: ["🙏 Ochiq aytib, uzr so'rayman", "😬 Bahona topaman", "🔁 Baribir uddalashga harakat qilaman", "🤐 Jim qolib, mavzuni chetlab o'taman"] }, // #141
  { tag: "deep", o: "Boshqalar sizni nimada eng ko'p maqtashadi?", g: "{N:ni} boshqalar nimada eng ko'p maqtashadi?",
    opts: ["🤝 Mehribonligida", "🧠 Aqlida", "💪 Mehnatsevarligida", "😂 Hazil tuyg'usida"],
    oo: ["🤝 Mehribonligimda", "🧠 Aqlimda", "💪 Mehnatsevarligimda", "😂 Hazil tuyg'umda"] }, // #142
  { tag: "love", o: "Yaqin odamingizga qanday sovg'a olib berishni yoqtirasiz?", g: "yaqin odamiga qanday sovg'a olib berishni yoqtiradi?",
    opts: ["🎁 Kutilmagan, sirli sovg'a", "🛍 U so'ragan narsani", "💐 Gul va shirinlik", "🖼 Xotira bo'ladigan narsa (surat, albom)"] }, // #143
  { tag: "love", o: "Yaqin odamingiz bilan eng ko'p nima qilishni yoqtirasiz?", g: "yaqin odami bilan eng ko'p nima qilishni yoqtiradi?",
    opts: ["🚶 Sayr qilishni", "🎬 Kino ko'rishni", "🍽 Birga ovqatlanishni", "💬 Soatlab gaplashishni"] }, // #144
  { tag: "love", o: "Birinchi uchrashuvga qanday kiyinasiz?", g: "birinchi uchrashuvga qanday kiyinadi?",
    opts: ["👔 Chiroyli va rasmiy", "👕 Oddiy va qulay", "✨ Uzoq tayyorlanib, eng yaxshisini kiyadi", "🤷 Qanday bo'lsa shunday"],
    oo: ["👔 Chiroyli va rasmiy", "👕 Oddiy va qulay", "✨ Uzoq tayyorlanib, eng yaxshisini kiyaman", "🤷 Qanday bo'lsa shunday"] }, // #145
  { tag: "love", o: "Kimgadir yoqib qolsangiz, buni qanday bildirasiz?", g: "kimgadir yoqib qolsa, buni qanday bildiradi?",
    opts: ["👀 Ko'proq qarab turadi", "💬 Ko'proq yozishadi", "🎁 Kichik e'tibor ko'rsatadi", "🤐 Hech kimga bildirmaydi"],
    oo: ["👀 Ko'proq qarab turaman", "💬 Ko'proq yozishaman", "🎁 Kichik e'tibor ko'rsataman", "🤐 Hech kimga bildirmayman"] }, // #146
  { tag: "love", o: "Sevgi qaysi shaklda sizga ko'proq ta'sir qiladi?", g: "{N:ga} sevgi qaysi shaklda ko'proq ta'sir qiladi?",
    opts: ["💬 Yaxshi so'zlar", "🤲 Qilingan ishlar", "🎁 Sovg'alar", "⏰ Birga o'tkazilgan vaqt"] }, // #147
  { tag: "love", o: "Yaqin odamingiz bilan bir hafta ko'rishmasangiz, nima qilasiz?", g: "yaqin odami bilan bir hafta ko'rishmasa, nima qiladi?",
    opts: ["📞 Har kuni qo'ng'iroq qiladi", "💌 Ko'proq yozadi", "🚗 Borib ko'rib keladi", "😌 Tinch, bunga o'rgangan"],
    oo: ["📞 Har kuni qo'ng'iroq qilaman", "💌 Ko'proq yozaman", "🚗 Borib ko'rib kelaman", "😌 Tinchman, bunga o'rganganman"] }, // #148
  { tag: "love", o: "Surpriz yoki oldindan rejalashtirilgan kun: qaysi biri yoqadi?", g: "surpriz yoki oldindan rejalashtirilgan kundan qaysi birini yoqtiradi?",
    opts: ["🎉 Surprizni", "📅 Rejalashtirilgan kunni", "🤷 Farqi yo'q", "🙅 Surprizni yoqtirmaydi"],
    oo: ["🎉 Surprizni", "📅 Rejalashtirilgan kunni", "🤷 Farqi yo'q", "🙅 Surprizni yoqtirmayman"] }, // #149
  { tag: "love", o: "Qanday odam sizga ko'proq yoqadi?", g: "{N:ga} qanday odam ko'proq yoqadi?",
    opts: ["😄 Kulgili va quvnoq", "🧠 Aqlli va jiddiy", "🤫 Sirli va sokin", "🤗 Mehribon va g'amxo'r"] }, // #150
  { tag: "love", o: "Yaqin odamingizni xursand qilish uchun nima qilasiz?", g: "yaqin odamini xursand qilish uchun nima qiladi?",
    opts: ["🎁 Sovg'a oladi", "🍳 Ovqat tayyorlaydi", "🎉 Kutilmagan surpriz qiladi", "🤗 Uni tinglab, yonida bo'ladi"],
    oo: ["🎁 Sovg'a olaman", "🍳 Ovqat tayyorlayman", "🎉 Kutilmagan surpriz qilaman", "🤗 Uni tinglab, yonida bo'laman"] }, // #151
  { tag: "love", o: "Munosabatda qaysi qoida eng muhim?", g: "munosabatda qaysi qoidani eng muhim deb biladi?",
    opts: ["🗣 Doim rostgo'y bo'lish", "🤝 Bir-birini hurmat qilish", "⏳ Sabr qilish", "🔒 Sirlarni saqlash"] }, // #152
  { tag: "friend", o: "Do'stingiz yangi kiyim kiyib, fikringizni so'rasa, nima deysiz?", g: "{N:ning} do'sti yangi kiyim kiyib, fikrini so'rasa, nima deydi?",
    opts: ["😍 Doim yaxshi deydi", "🗣 Rostini aytadi", "🤔 Muloyimlik bilan maslahat beradi", "😅 Hazil qilib o'tkazadi"],
    oo: ["😍 Doim yaxshi deyman", "🗣 Rostini aytaman", "🤔 Muloyimlik bilan maslahat beraman", "😅 Hazil qilib o'tkazaman"] }, // #153
  { tag: "friend", o: "Do'stingiz bilan qaysi mavzuda tez-tez bahslashasiz?", g: "do'sti bilan qaysi mavzuda tez-tez bahslashadi?",
    opts: ["⚽️ Sport", "🎬 Kino va musiqa", "💰 Pul va ish", "❤️ Munosabatlar"] }, // #154
  { tag: "friend", o: "Do'stlaringiz bilan sayohatda rejani kim tuzadi?", g: "do'stlari bilan sayohatda rejani kim tuzadi?",
    opts: ["🗺 O'zi", "🧠 Eng tashkilotchi do'sti", "🎲 Rejasiz, qanday bo'lsa shunday", "📱 Hamma birga internetdan qidiradi"],
    oo: ["🗺 O'zim", "🧠 Eng tashkilotchi do'stim", "🎲 Rejasiz, qanday bo'lsa shunday", "📱 Hamma birga internetdan qidiramiz"] }, // #155
  { tag: "friend", o: "Do'stingiz bilan arazlashsangiz, birinchi nima qilasiz?", g: "do'sti bilan arazlashsa, birinchi nima qiladi?",
    opts: ["🙋 Birinchi bo'lib yozadi", "⏳ U yozishini kutadi", "🎁 Kichik sovg'a bilan yarashadi", "🤷 Vaqt hammasini hal qiladi deydi"],
    oo: ["🙋 Birinchi bo'lib yozaman", "⏳ U yozishini kutaman", "🎁 Kichik sovg'a bilan yarashaman", "🤷 Vaqt hammasini hal qiladi deyman"] }, // #156
  { tag: "friend", o: "Do'stlaringizning tug'ilgan kunini eslab qolasizmi?", g: "do'stlarining tug'ilgan kunini eslab qoladimi?",
    opts: ["🧠 Hammasini yoddan biladi", "📱 Telefon eslatadi", "🙈 Ko'pincha unutadi", "🎂 Faqat eng yaqinlarinikini biladi"],
    oo: ["🧠 Hammasini yoddan bilaman", "📱 Telefon eslatadi", "🙈 Ko'pincha unutaman", "🎂 Faqat eng yaqinlarimnikini bilaman"] }, // #157
  { tag: "friend", o: "Do'stlaringiz sizdan eng ko'p nima so'rashadi?", g: "{N:dan} do'stlari eng ko'p nima so'rashadi?",
    opts: ["💡 Maslahat", "💸 Qarz", "🆘 Yordam", "🍔 Ovqat ulashishni"] }, // #158
  { tag: "friend", o: "Do'stingiz kasal bo'lsa, nima qilasiz?", g: "{N:ning} do'sti kasal bo'lsa, nima qiladi?",
    opts: ["🏥 Yoniga borib, xabar oladi", "🍲 Ovqat yoki dori olib boradi", "📞 Qo'ng'iroq qilib so'raydi", "💬 Yozib, tezroq tuzalsin deydi"],
    oo: ["🏥 Yoniga borib, xabar olaman", "🍲 Ovqat yoki dori olib boraman", "📞 Qo'ng'iroq qilib so'rayman", "💬 Yozib, tezroq tuzalsin deyman"] }, // #159
  { tag: "friend", o: "Do'stingizda qaysi xususiyat albatta bo'lishi kerak?", g: "do'stida qaysi xususiyat albatta bo'lishi kerak deb biladi?",
    opts: ["🔒 Sirni saqlay olishi", "🤝 Sodiqlik", "😄 Hazil tuyg'usi", "🧠 Aql-idrok"] }, // #160
  { tag: "friend", o: "Do'stlaringiz bilan suratga tushganda qayerda turasiz?", g: "do'stlari bilan suratga tushganda qayerda turadi?",
    opts: ["🎯 O'rtada", "🙈 Chetda", "🧍 Orqada", "📸 Suratga oladi, o'zi tushmaydi"],
    oo: ["🎯 O'rtada", "🙈 Chetda", "🧍 Orqada", "📸 Suratga olaman, tushmayman"] }, // #161
  { tag: "friend", o: "Do'stingiz sizga yolg'on gapirganini bilib qolsangiz, nima qilasiz?", g: "{N:ning} do'sti yolg'on gapirganini bilib qolsa, nima qiladi?",
    opts: ["🗣 Darhol so'raydi", "🤐 Indamaydi, lekin yodda tutadi", "🙄 Bir ozdan keyin tushuntirish talab qiladi", "💔 Ishonchi sinadi, uzoqlashadi"],
    oo: ["🗣 Darhol so'rayman", "🤐 Indamayman, lekin yodda tutaman", "🙄 Bir ozdan keyin tushuntirish talab qilaman", "💔 Ishonchim sinadi, uzoqlashaman"] }, // #162
  { tag: "friend", o: "Do'stingiz muvaffaqiyatga erishsa, nima qilasiz?", g: "{N:ning} do'sti muvaffaqiyatga erishsa, nima qiladi?",
    opts: ["🎉 Hammaga maqtab yuradi", "🤗 Chin dildan tabriklaydi", "🎁 Sovg'a olib boradi", "😶 Ichida xursand, lekin aytmaydi"],
    oo: ["🎉 Hammaga maqtab yuraman", "🤗 Chin dildan tabriklayman", "🎁 Sovg'a olib boraman", "😶 Ichimda xursandman, lekin aytmayman"] }, // #163
  { tag: "friend", o: "Do'stingiz bilan eng yaxshi xotirangiz qaysi?", g: "do'sti bilan eng yaxshi xotirasi qaysi?",
    opts: ["🏕 Sayohat", "🎉 Tug'ilgan kun", "🏫 Maktab yoki universitet kunlari", "🌃 Tungi suhbat"] }, // #164
  { tag: "life", o: "Tashqi ko'rinishingizga kuniga qancha vaqt sarflaysiz?", g: "tashqi ko'rinishiga kuniga qancha vaqt sarflaydi?",
    opts: ["⚡️ 5 daqiqagacha", "⏱ 15 daqiqa", "🪞 Yarim soat", "💅 Bir soatdan ko'p"] }, // #165
  { tag: "life", o: "Haftasiga necha marta tashqarida ovqatlanasiz?", g: "haftasiga necha marta tashqarida ovqatlanadi?",
    opts: ["🏠 Deyarli hech", "🍽 1-2 marta", "🍔 3-4 marta", "🛵 Deyarli har kuni"] }, // #166
  { tag: "life", o: "Kuniga necha soat uxlaysiz?", g: "kuniga necha soat uxlaydi?",
    opts: ["😵 5 soatdan kam", "🙂 6-7 soat", "😴 8-9 soat", "🛌 9 soatdan ko'p"] }, // #167
  { tag: "life", o: "Kuniga necha soat telefon ishlatasiz?", g: "kuniga necha soat telefon ishlatadi?",
    opts: ["📱 1-2 soat", "📲 3-4 soat", "🔥 5-6 soat", "💀 7 soatdan ko'p"] }, // #168
  { tag: "life", o: "Ertalab uyg'ongach, birinchi bo'lib nimani ochasiz?", g: "ertalab uyg'ongach, birinchi bo'lib nimani ochadi?",
    opts: ["✈️ Telegram", "📸 Instagram", "▶️ YouTube yoki TikTok", "⏰ Faqat budilnikni o'chiradi"],
    oo: ["✈️ Telegram", "📸 Instagram", "▶️ YouTube yoki TikTok", "⏰ Faqat budilnikni o'chiraman"] }, // #169
  { tag: "life", o: "Pulingiz tugab qolsa, nima qilasiz?", g: "{N:ning} puli tugab qolsa, nima qiladi?",
    opts: ["🤲 Yaqinlaridan qarz oladi", "💼 Qo'shimcha ish topadi", "✂️ Xarajatlarni qisqartiradi", "🧘 Tashvishlanmaydi, bir yo'li topiladi"],
    oo: ["🤲 Yaqinlarimdan qarz olaman", "💼 Qo'shimcha ish topaman", "✂️ Xarajatlarni qisqartiraman", "🧘 Tashvishlanmayman, bir yo'li topiladi"] }, // #170
  { tag: "life", o: "Uy yumushlaridan qaysi birini eng yoqtirmaysiz?", g: "uy yumushlaridan qaysi birini eng yoqtirmaydi?",
    opts: ["🍽 Idish yuvish", "🧹 Supurish", "👕 Kir yuvish", "🗑 Axlat chiqarish"] }, // #171
  { tag: "life", o: "Hafta kunlaridan qaysi birini eng yaxshi ko'rasiz?", g: "hafta kunlaridan qaysi birini eng yaxshi ko'radi?",
    opts: ["😩 Dushanba", "😎 Juma", "🛋 Shanba", "🌤 Yakshanba"] }, // #172
  { tag: "life", o: "Sovg'a olish va sovg'a berishdan qaysi birini yoqtirasiz?", g: "sovg'a olish va sovg'a berishdan qaysi birini yoqtiradi?",
    opts: ["🎁 Sovg'a berishni", "🤩 Sovg'a olishni", "⚖️ Ikkalasini ham", "🙅 Ikkalasiga unchalik qiziqmaydi"],
    oo: ["🎁 Sovg'a berishni", "🤩 Sovg'a olishni", "⚖️ Ikkalasini ham", "🙅 Ikkalasiga unchalik qiziqmayman"] }, // #173
  { tag: "life", o: "Kuningiz qanday tartibda o'tadi?", g: "{N:ning} kuni qanday tartibda o'tadi?",
    opts: ["📋 Hamma narsa rejada", "🙂 Taxminiy reja bor", "🌀 Qanday bo'lsa shunday", "🎲 Har kuni har xil"] }, // #174
  { tag: "life", o: "Eng ko'p qaysi narsaga pul sarflaysiz?", g: "eng ko'p qaysi narsaga pul sarflaydi?",
    opts: ["🍔 Ovqatga", "👕 Kiyimga", "📱 Texnika va ilovalarga", "🚕 Yo'l kiraga"] }, // #175
  { tag: "life", o: "Yangi narsani o'rganish uchun nimadan foydalanasiz?", g: "yangi narsani o'rganish uchun nimadan foydalanadi?",
    opts: ["▶️ YouTube", "📚 Kitoblar", "🤖 Sun'iy intellekt", "👨‍🏫 Odamlardan so'raydi"],
    oo: ["▶️ YouTube", "📚 Kitoblar", "🤖 Sun'iy intellekt", "👨‍🏫 Odamlardan so'rayman"] }, // #176
  { tag: "life", o: "Kunning qaysi qismi sizga eng og'ir?", g: "{N:ga} kunning qaysi qismi eng og'ir?",
    opts: ["🌅 Ertalab turish", "☀️ Tushlikdan keyin uyqu bosishi", "🌆 Kechqurungi charchoq", "🌙 Kechasi uxlay olmaslik"] }, // #177
  { tag: "taste", o: "Qaysi tilda kino ko'rishni yoqtirasiz?", g: "qaysi tilda kino ko'rishni yoqtiradi?",
    opts: ["🇺🇿 O'zbek tilida", "🇷🇺 Rus tilida", "🇬🇧 Original (ingliz) tilida", "🇰🇷 Subtitrli koreys yoki turk serialini"] }, // #178
  { tag: "taste", o: "Qaysi ijtimoiy tarmoqni eng ko'p yoqtirasiz?", g: "qaysi ijtimoiy tarmoqni eng ko'p yoqtiradi?",
    opts: ["📸 Instagram", "✈️ Telegram", "🎵 TikTok", "▶️ YouTube"] }, // #179
  { tag: "taste", o: "Nonushtada nima yeysiz?", g: "nonushtada nima yeydi?",
    opts: ["🍳 Tuxum", "🥣 Bo'tqa yoki yogurt", "🫓 Non va choy", "🚫 Nonushta qilmaydi"],
    oo: ["🍳 Tuxum", "🥣 Bo'tqa yoki yogurt", "🫓 Non va choy", "🚫 Nonushta qilmayman"] }, // #180
  { tag: "taste", o: "Fast-fuddan qaysi birini tanlaysiz?", g: "fast-fuddan qaysi birini tanlaydi?",
    opts: ["🍔 Burger", "🌭 Hot-dog", "🥙 Lavash", "🍗 Qovurilgan tovuq"] }, // #181
  { tag: "taste", o: "Qaysi mahoratga ega bo'lishni xohlaysiz?", g: "qaysi mahoratga ega bo'lishni xohlaydi?",
    opts: ["🎸 Asbobda chalish", "🍳 Mazali pishirish", "🎨 Rasm chizish", "💃 Raqsga tushish"] }, // #182
  { tag: "taste", o: "Qaysi tabiat go'shasini yoqtirasiz?", g: "qaysi tabiat go'shasini yoqtiradi?",
    opts: ["🌊 Dengiz", "🏔 Tog'", "🏜 Cho'l", "🌲 O'rmon"] }, // #183
  { tag: "taste", o: "Qaysi turdagi kitoblarni o'qishni yoqtirasiz?", g: "qaysi turdagi kitoblarni o'qishni yoqtiradi?",
    opts: ["🕵️ Detektiv", "💞 Roman", "🧠 Rivojlanish va psixologiya", "📜 Tarixiy kitoblar"] }, // #184
  { tag: "taste", o: "Musiqani qaysi paytda eng ko'p tinglaysiz?", g: "musiqani qaysi paytda eng ko'p tinglaydi?",
    opts: ["🚶 Yo'lda", "🏋️ Sport paytida", "🛌 Uxlashdan oldin", "💼 Ishlayotganda"] }, // #185
  { tag: "taste", o: "Qaysi rangdagi kiyimni ko'proq kiyasiz?", g: "qaysi rangdagi kiyimni ko'proq kiyadi?",
    opts: ["🖤 Qora", "🤍 Oq", "💙 Ko'k yoki kulrang", "🌈 Yorqin ranglar"] }, // #186
  { tag: "taste", o: "Qaysi dam olish turini tanlaysiz?", g: "qaysi dam olish turini tanlaydi?",
    opts: ["🏨 Mehmonxona va hovuz", "⛺️ Chodir va tabiat", "🏙 Katta shahar sayohati", "🏡 Uyda, hech qayerga bormay"] }, // #187
  { tag: "taste", o: "Qaysi gazakni afzal ko'rasiz?", g: "qaysi gazakni afzal ko'radi?",
    opts: ["🍿 Popkorn", "🥜 Yong'oq va quritilgan mevalar", "🍟 Chips", "🍪 Pechenye"] }, // #188
  { tag: "taste", o: "Qaysi mavzu sizni ko'proq qiziqtiradi?", g: "qaysi mavzuga ko'proq qiziqadi?",
    opts: ["🚀 Kosmos", "🧬 Inson tanasi", "🤖 Sun'iy intellekt", "🏛 Tarix"] }, // #189
  { tag: "taste", o: "Bolaligingizda qaysi o'yin sevimli bo'lgan?", g: "bolaligida qaysi o'yin sevimli bo'lgan?",
    opts: ["⚽️ To'p o'yinlari", "🎮 Video o'yinlar", "🧩 Konstruktor va mashinalar", "🪁 Hovlidagi o'yinlar"] }, // #190
  { tag: "dilemma", o: "Qaysi holat sizga eng yomon?", g: "{N:ga} qaysi holat eng yomon?",
    opts: ["📵 Bir oy internetsiz", "🍽 Bir oy sevimli taomsiz", "🎧 Bir oy musiqasiz", "🛌 Bir hafta uyqusiz"] }, // #191
  { tag: "dilemma", o: "Faqat bittasini tanlashingiz kerak bo'lsa, nimani tanlaysiz?", g: "faqat bittasini tanlashi kerak bo'lsa, nimani tanlaydi?",
    opts: ["💪 Mukammal sog'liq", "💰 Cheksiz pul", "❤️ Haqiqiy sevgi", "🧠 Cheksiz bilim"] }, // #192
  { tag: "dilemma", o: "Hayotni qaytadan boshlash imkoni bo'lsa, nimani o'zgartirasiz?", g: "hayotni qaytadan boshlash imkoni bo'lsa, nimani o'zgartiradi?",
    opts: ["🎓 Kasbini", "🌍 Yashash joyini", "👥 Atrofidagi odamlarni", "🚫 Hech narsani, hammasi joyida"],
    oo: ["🎓 Kasbimni", "🌍 Yashash joyimni", "👥 Atrofimdagi odamlarni", "🚫 Hech narsani, hammasi joyida"] }, // #193
  { tag: "dilemma", o: "Bir oy yolg'iz orolda yashash uchun nimani olib borasiz?", g: "bir oy yolg'iz orolda yashash uchun nimani olib boradi?",
    opts: ["📚 Kitoblar", "🎧 Musiqa va quloqchin", "🧰 Omon qolish uskunalari", "🍲 Ko'p ovqat"] }, // #194
  { tag: "dilemma", o: "Qaysi uyni tanlaysiz?", g: "qaysi uyni tanlaydi?",
    opts: ["🏙 Shahar markazidagi kichik kvartira", "🏡 Shahardan uzoqdagi katta hovli", "🏖 Dengiz bo'yidagi uy", "🏔 Tog'dagi tinch uy"] }, // #195
  { tag: "dilemma", o: "Bir yil faqat bitta taom yeyishingiz kerak bo'lsa, qaysi birini tanlaysiz?", g: "bir yil faqat bitta taom yeyishi kerak bo'lsa, qaysi birini tanlaydi?",
    opts: ["🍚 Palov", "🍕 Pitsa", "🍢 Shashlik", "🥟 Manti"] }, // #196
  { tag: "dilemma", o: "Ishda nimani eng muhim deb bilasiz?", g: "ishda nimani eng muhim deb biladi?",
    opts: ["💰 Yuqori maosh", "🏖 Erkin jadval", "🤝 Yaxshi jamoa", "📈 O'sish imkoniyati"] }, // #197
  { tag: "dilemma", o: "Bir kunga hokimiyatni olsangiz, avval nimani o'zgartirasiz?", g: "bir kunga hokimiyatni olsa, avval nimani o'zgartiradi?",
    opts: ["🚦 Yo'llar va tirbandlikni", "🏫 Ta'lim tizimini", "🏥 Sog'liqni saqlashni", "🌳 Shahar ko'kalamzorligini"] }, // #198
  { tag: "dilemma", o: "Qaysi ish sizga eng zerikarli bo'lardi?", g: "{N:ga} qaysi ish eng zerikarli bo'lardi?",
    opts: ["📊 Kun bo'yi jadval to'ldirish", "🏭 Bir xil ishni takrorlash", "📞 Qo'ng'iroqlarga javob berish", "🧾 Qog'oz ishlari"] }, // #199
  { tag: "dilemma", o: "Faqat bitta davlatga sayohat qila olsangiz, qaysi birini tanlaysiz?", g: "faqat bitta davlatga sayohat qila olsa, qaysi birini tanlaydi?",
    opts: ["🇯🇵 Yaponiya", "🇹🇷 Turkiya", "🇫🇷 Fransiya", "🇰🇷 Janubiy Koreya"] }, // #200
  { tag: "uz", o: "Mehmon kelsa, birinchi nima qilasiz?", g: "mehmon kelsa, birinchi nima qiladi?",
    opts: ["🍵 Choy qo'yadi", "🍉 Dasturxonga meva qo'yadi", "🍲 Ovqat tayyorlashga kirishadi", "🤗 Kutib olib, ahvol so'raydi"],
    oo: ["🍵 Choy qo'yaman", "🍉 Dasturxonga meva qo'yaman", "🍲 Ovqat tayyorlashga kirishaman", "🤗 Kutib olib, ahvol so'rayman"] }, // #201
  { tag: "uz", o: "To'yda sizga eng ko'p nima yoqadi?", g: "{N:ga} to'yda eng ko'p nima yoqadi?",
    opts: ["💃 Raqs va musiqa", "🍲 Dasturxon va taomlar", "👗 Kiyimlar va ko'rinish", "👯 Do'stlar bilan uchrashuv"] }, // #202
  { tag: "uz", o: "O'zbek taomlaridan qaysi birini yoqtirasiz?", g: "o'zbek taomlaridan qaysi birini yoqtiradi?",
    opts: ["🥟 Manti", "🍲 Sho'rva", "🥘 Dimlama", "🍖 Kabob"] }, // #203
  { tag: "uz", o: "Qarindoshlar yig'ilganda nima qilasiz?", g: "qarindoshlar yig'ilganda nima qiladi?",
    opts: ["😂 Hammani kuldiradi", "🍽 Dasturxonga qaraydi", "👂 Kattalarni tinglaydi", "📱 Telefonda o'tiradi"],
    oo: ["😂 Hammani kuldiraman", "🍽 Dasturxonga qarayman", "👂 Kattalarni tinglayman", "📱 Telefonda o'tiraman"] }, // #204
  { tag: "uz", o: "Bolaligingizda yozgi ta'tilni qayerda o'tkazgansiz?", g: "bolaligida yozgi ta'tilni qayerda o'tkazgan?",
    opts: ["🏡 Qishloqda, buvisinikida", "🌊 Daryo yoki ko'l bo'yida", "🏙 Shaharda, hovlida", "⛰ Tog'da"],
    oo: ["🏡 Qishloqda, buvimnikida", "🌊 Daryo yoki ko'l bo'yida", "🏙 Shaharda, hovlida", "⛰ Tog'da"] }, // #205
  { tag: "uz", o: "Navro'zda qaysi taomni eng ko'p yoqtirasiz?", g: "Navro'zda qaysi taomni eng ko'p yoqtiradi?",
    opts: ["🌿 Sumalak", "🥣 Halim", "🥬 Ko'k somsa", "🍚 Palov"] }, // #206
  { tag: "uz", o: "Choyxonaga borsangiz, nima buyurtma berasiz?", g: "choyxonaga borsa, nima buyurtma beradi?",
    opts: ["🍵 Yashil choy", "🍢 Kabob", "🍲 Sho'rva", "🥟 Somsa"] }, // #207
  { tag: "uz", o: "Bayramda qarindoshlarnikiga borasizmi?", g: "bayramda qarindoshlarnikiga boradimi?",
    opts: ["🏃 Hammasinikiga boradi", "👨‍👩‍👧 Faqat eng yaqinlarinikiga", "📞 Telefonda tabriklaydi", "🏠 Uyda mehmon kutadi"],
    oo: ["🏃 Hammasinikiga boraman", "👨‍👩‍👧 Faqat eng yaqinlarimnikiga", "📞 Telefonda tabriklayman", "🏠 Uyda mehmon kutaman"] }, // #208
  { tag: "uz", o: "Qishda uyda nima qilishni yaxshi ko'rasiz?", g: "qishda uyda nima qilishni yaxshi ko'radi?",
    opts: ["🍵 Issiq choy ichadi", "📺 Kino ko'radi", "🍲 Issiq ovqat pishiradi", "📖 Kitob o'qiydi"],
    oo: ["🍵 Issiq choy ichaman", "📺 Kino ko'raman", "🍲 Issiq ovqat pishiraman", "📖 Kitob o'qiyman"] }, // #209
  { tag: "uz", o: "Qaysi maqol sizga eng yaqin?", g: "{N:ga} qaysi maqol eng yaqin?",
    opts: ["⏳ Sabr tagi sariq oltin", "💬 Yaxshi so'z jon ozig'i", "🏡 Ona yurt oltin beshik", "🤝 Birlashgan o'zar, birlashmagan to'zar"] }, // #210
  { tag: "uz", o: "Ko'chada tanish odamni ko'rsangiz, nima qilasiz?", g: "ko'chada tanish odamni ko'rsa, nima qiladi?",
    opts: ["🤝 To'xtab, ahvol so'raydi", "👋 Salom berib o'tib ketadi", "🙈 Ko'rmaganga oladi", "📱 Telefonga qaragan bo'lib o'tadi"],
    oo: ["🤝 To'xtab, ahvol so'rayman", "👋 Salom berib o'tib ketaman", "🙈 Ko'rmaganga olaman", "📱 Telefonga qaragan bo'lib o'taman"] }, // #211
  { tag: "uz", o: "O'zbekistonda qaysi hududda yashashni xohlaysiz?", g: "O'zbekistonda qaysi hududda yashashni xohlaydi?",
    opts: ["🏙 Toshkent", "🏛 Samarqand", "🕌 Buxoro", "🌄 Farg'ona vodiysi"] }, // #212
  { tag: "uz", o: "Choy yoniga nima qo'yishni yoqtirasiz?", g: "choy yoniga nima qo'yishni yoqtiradi?",
    opts: ["🍬 Navvot va shirinlik", "🥜 Yong'oq va mayiz", "🍞 Non va qaymoq", "🍪 Pechenye"] }, // #213
  { tag: "uz", o: "Yaqinlaringiz bilan qaysi paytda eng ko'p yig'ilasiz?", g: "yaqinlari bilan qaysi paytda eng ko'p yig'iladi?",
    opts: ["🌙 Ramazon iftorligida", "🎆 Bayramlarda", "💍 To'ylarda", "🍽 Oddiy dam olish kunlarida"] }, // #214
  { tag: "uz", o: "Oilangizda kim eng ko'p gapiradi?", g: "oilasida kim eng ko'p gapiradi?",
    opts: ["👩 Onasi", "👨 Otasi", "👧 Opa-singillari", "🧒 O'zi"],
    oo: ["👩 Onam", "👨 Otam", "👧 Opa-singillarim", "🧒 O'zim"] }, // #215
  { tag: "uz", o: "Mahallangizda nimani eng ko'p yaxshi ko'rasiz?", g: "mahallasida nimani eng ko'p yaxshi ko'radi?",
    opts: ["🤝 Qo'shnilarni", "🌳 Tinch ko'chalarni", "🍞 Novvoyxonani", "⚽️ Futbol maydonini"] }, // #216
  { tag: "uz", o: "Ertalabki nonushtada nima bo'lishi shart?", g: "ertalabki nonushtada nima bo'lishi shart deb biladi?",
    opts: ["🍵 Choy", "🫓 Non", "🥚 Tuxum", "🥛 Qaymoq va sut"] }, // #217
  { tag: "uz", o: "Yangi yil va Navro'zdan qaysi birini ko'proq yoqtirasiz?", g: "Yangi yil va Navro'zdan qaysi birini ko'proq yoqtiradi?",
    opts: ["🎄 Yangi yilni", "🌱 Navro'zni", "🎉 Ikkalasini ham", "🤷 Farqi yo'q"] }, // #218
  { tag: "uz", o: "Bolaligingizda hovlida qaysi o'yinni o'ynardingiz?", g: "bolaligida hovlida qaysi o'yinni o'ynagan?",
    opts: ["⚽️ Futbol", "🪀 Oshiq yoki chillak", "🏃 Quvlashmachoq", "🚲 Velosiped"] }, // #219
  { tag: "uz", o: "Maktabda qaysi fan sizga yoqardi?", g: "{N:ga} maktabda qaysi fan yoqqan?",
    opts: ["🔢 Matematika", "📖 Ona tili va adabiyot", "🧪 Fizika yoki kimyo", "⚽️ Jismoniy tarbiya"] }, // #220
  { tag: "uz", o: "Qishloq va shahar hayotidan qaysi birini yoqtirasiz?", g: "qishloq va shahar hayotidan qaysi birini yoqtiradi?",
    opts: ["🏙 Shahar hayotini", "🏡 Qishloq hayotini", "🔁 Ikkalasini ham", "✈️ Boshqa mamlakatni"] }, // #221
  { tag: "uz", o: "Shaharda qanday yurasiz?", g: "shaharda qanday yuradi?",
    opts: ["🚕 Taksi (Yandex)", "🚌 Avtobus", "🚇 Metro", "🚗 O'z mashinasida"],
    oo: ["🚕 Taksi (Yandex)", "🚌 Avtobus", "🚇 Metro", "🚗 O'z mashinamda"] }, // #222
  { tag: "uz", o: "Oilangiz bilan qanday filmlarni ko'rishni yoqtirasiz?", g: "oilasi bilan qanday filmlarni ko'rishni yoqtiradi?",
    opts: ["😂 Komediya", "🧸 Multfilm", "📺 Serial", "🎞 Eski sovet filmlari"] }, // #223
  { tag: "dream", o: "Besh yildan keyin o'zingizni qayerda ko'rasiz?", g: "besh yildan keyin o'zini qayerda ko'radi?",
    opts: ["💼 Yaxshi lavozimda", "🏢 O'z biznesida", "🌍 Boshqa mamlakatda", "🏡 Oilasi bilan tinch hayotda"],
    oo: ["💼 Yaxshi lavozimda", "🏢 O'z biznesimda", "🌍 Boshqa mamlakatda", "🏡 Oilam bilan tinch hayotda"] }, // #224
  { tag: "dream", o: "Eng katta orzuingiz qaysi sohada?", g: "{N:ning} eng katta orzusi qaysi sohada?",
    opts: ["💰 Moliya", "🎓 Ta'lim va kasb", "❤️ Oila va sevgi", "🌍 Sayohat va tajriba"] }, // #225
  { tag: "dream", o: "Birinchi bo'lib nimani sotib olishni orzu qilasiz?", g: "birinchi bo'lib nimani sotib olishni orzu qiladi?",
    opts: ["🏠 Uy", "🚗 Mashina", "💻 Kompyuter yoki telefon", "🏝 Dam olish safari"] }, // #226
  { tag: "dream", o: "Qaysi mamlakatda o'qishni xohlaysiz?", g: "qaysi mamlakatda o'qishni xohlaydi?",
    opts: ["🇬🇧 Angliya", "🇺🇸 AQSh", "🇰🇷 Koreya", "🇩🇪 Germaniya"] }, // #227
  { tag: "dream", o: "O'z biznesingiz bo'lsa, qaysi sohada bo'lardi?", g: "o'z biznesi bo'lsa, qaysi sohada bo'lardi?",
    opts: ["🍽 Restoran yoki kafe", "💻 IT va texnologiya", "🛍 Savdo va do'kon", "🎬 Media va kontent"] }, // #228
  { tag: "dream", o: "Qanday odam bo'lib eslanishni xohlaysiz?", g: "qanday odam bo'lib eslanishni xohlaydi?",
    opts: ["🤝 Mehribon", "🧠 Dono", "🏆 Muvaffaqiyatli", "😂 Quvnoq"] }, // #229
  { tag: "dream", o: "O'ttiz yoshga kelib nimaga erishgan bo'lishni xohlaysiz?", g: "o'ttiz yoshga kelib nimaga erishgan bo'lishni xohlaydi?",
    opts: ["🏠 Uy va mashina", "👨‍👩‍👧 Oila va farzandlar", "💼 Katta kasbiy yutuq", "✈️ Dunyoni ko'rib chiqish"] }, // #230
  { tag: "dream", o: "Yangi yilga qanday maqsad qo'yasiz?", g: "yangi yilga qanday maqsad qo'yadi?",
    opts: ["💪 Sog'lom bo'lish", "💰 Ko'proq pul ishlash", "📚 Yangi narsa o'rganish", "✈️ Sayohat qilish"] }, // #231
  { tag: "dream", o: "Sizni nima yaxshiroq bo'lishga undaydi?", g: "{N:ni} nima yaxshiroq bo'lishga undaydi?",
    opts: ["👨‍👩‍👧 Oilasi", "🏆 Raqobat", "🌟 O'z orzulari", "💬 Ishonadigan odamlari"],
    oo: ["👨‍👩‍👧 Oilam", "🏆 Raqobat", "🌟 O'z orzularim", "💬 Ishonadigan odamlarim"] }, // #232
  { tag: "dream", o: "Bir yildan keyin eng katta o'zgarish nima bo'lishini xohlaysiz?", g: "bir yildan keyin eng katta o'zgarish nima bo'lishini xohlaydi?",
    opts: ["💼 Yangi ish yoki kasb", "🏃 Sog'lom hayot", "💰 Moliyaviy erkinlik", "📍 Yangi shahar yoki mamlakat"] }, // #233
  { tag: "dream", o: "Orzuingizga erishishda eng katta to'siq nima?", g: "orzusiga erishishda eng katta to'siq nima?",
    opts: ["💸 Pul yetishmasligi", "⏳ Vaqt yo'qligi", "😨 Qo'rquv va ishonchsizlik", "🐢 Dangasalik"] }, // #234
  { tag: "dream", o: "Keksayganingizda qayerda yashashni xohlaysiz?", g: "keksayganda qayerda yashashni xohlaydi?",
    opts: ["🏡 Qishloqda", "🏙 Katta shaharda", "🌊 Dengiz bo'yida", "👨‍👩‍👧 Farzandlari yonida"],
    oo: ["🏡 Qishloqda", "🏙 Katta shaharda", "🌊 Dengiz bo'yida", "👨‍👩‍👧 Farzandlarim yonida"] }, // #235
  { tag: "dream", o: "Orzularingiz haqida birinchi kimga aytasiz?", g: "orzulari haqida birinchi kimga aytadi?",
    opts: ["👩 Onasiga", "🫂 Do'stiga", "❤️ Sevgan odamiga", "🤐 Hech kimga, sir saqlaydi"],
    oo: ["👩 Onamga", "🫂 Do'stimga", "❤️ Sevgan odamimga", "🤐 Hech kimga, sir saqlayman"] }, // #236
  { tag: "dream", o: "Bolaligingizda qaysi kasbni orzu qilgansiz?", g: "bolaligida qaysi kasbni orzu qilgan?",
    opts: ["🩺 Shifokor", "✈️ Uchuvchi", "🪖 Harbiy yoki politsiyachi", "👩‍🏫 O'qituvchi"] }, // #237
  { tag: "dream", o: "Sizningcha muvaffaqiyat nima?", g: "muvaffaqiyat deganda nimani tushunadi?",
    opts: ["💰 Ko'p pul", "❤️ Baxtli oila", "🌟 Nomi mashhur bo'lishi", "🧘 Ichki tinchlik"] }, // #238
  { tag: "dream", o: "Hayotingizda qaysi ishni ertaroq boshlagan bo'lardingiz?", g: "hayotida qaysi ishni ertaroq boshlagan bo'lardi?",
    opts: ["💼 Ishlashni", "📚 O'qishni", "🏋️ Sport bilan shug'ullanishni", "💰 Pul yig'ishni"] }, // #239
  { tag: "dream", o: "Dunyodagi qaysi muammoni hal qilishni xohlardingiz?", g: "dunyodagi qaysi muammoni hal qilishni xohlaydi?",
    opts: ["🍞 Ochlik", "🏥 Kasalliklar", "🌳 Tabiat ifloslanishi", "📚 Savodsizlik"] }, // #240
  { tag: "dream", o: "Eng katta maqsadingizga erishsangiz, birinchi nima qilasiz?", g: "eng katta maqsadiga erishsa, birinchi nima qiladi?",
    opts: ["🎉 Bayram qiladi", "🙏 Yaqinlariga rahmat aytadi", "🚀 Yangi maqsad qo'yadi", "😌 Dam oladi"],
    oo: ["🎉 Bayram qilaman", "🙏 Yaqinlarimga rahmat aytaman", "🚀 Yangi maqsad qo'yaman", "😌 Dam olaman"] }, // #241
  { tag: "dream", o: "Boy bo'lsangiz, qanday yaxshilik qilasiz?", g: "boy bo'lsa, qanday yaxshilik qiladi?",
    opts: ["🏫 Maktab quradi", "🏥 Kasallarga yordam beradi", "🍞 Muhtojlarga ovqat beradi", "📚 Iste'dodli yoshlarni o'qitadi"],
    oo: ["🏫 Maktab quraman", "🏥 Kasallarga yordam beraman", "🍞 Muhtojlarga ovqat beraman", "📚 Iste'dodli yoshlarni o'qitaman"] }, // #242
  { tag: "dream", o: "Qaysi texnologiya hayotingizni eng ko'p o'zgartiradi, deb o'ylaysiz?", g: "qaysi texnologiya hayotini eng ko'p o'zgartiradi, deb o'ylaydi?",
    opts: ["🤖 Sun'iy intellekt", "🚗 O'zi haydaydigan mashinalar", "🧬 Tibbiyot yangiliklari", "🚀 Kosmik sayohat"] }, // #243
  { tag: "dream", o: "Eng ko'p qaysi sohada o'sishni xohlaysiz?", g: "eng ko'p qaysi sohada o'sishni xohlaydi?",
    opts: ["💼 Kasbda", "💰 Moliyada", "🧠 Bilimda", "❤️ Munosabatlarda"] }, // #244
  { tag: "dream", o: "Bir yil bo'sh vaqtingiz bo'lsa, nima qilasiz?", g: "bir yil bo'sh vaqti bo'lsa, nima qiladi?",
    opts: ["✈️ Dunyo bo'ylab sayohat qiladi", "📚 Yangi kasb o'rganadi", "🏢 Biznes boshlaydi", "🏡 Oilasi bilan vaqt o'tkazadi"],
    oo: ["✈️ Dunyo bo'ylab sayohat qilaman", "📚 Yangi kasb o'rganaman", "🏢 Biznes boshlayman", "🏡 Oilam bilan vaqt o'tkazaman"] }, // #245
];
