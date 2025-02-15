// Mahallelere ait sentetik veriler
const mahalleler = {
    'Karakaş Mahallesi': {
        nufus_yogunlugu: 14200,      // Yaklaşık nüfus
        ulasim_altyapisi: 4,         // 1-10 arası subjektif altyapı puanı
        cevresel_etki: 5,           // 1-10 arası çevresel etki puanı
        sosyal_fayda: 8,            // 1-10 arası sosyal fayda puanı
        maliyet: 950000             // Örnek maliyet (TL)
    },
    'Bademlik Mahallesi': {
        nufus_yogunlugu: 12750,
        ulasim_altyapisi: 3,
        cevresel_etki: 6,
        sosyal_fayda: 7,
        maliyet: 850000
    },
    'Karahıdır Mahallesi': {
        nufus_yogunlugu: 13600,
        ulasim_altyapisi: 5,
        cevresel_etki: 4,
        sosyal_fayda: 9,
        maliyet: 1100000
    }
};

// Ağırlıklar
const agirliklar = {
    nufus_yogunlugu: 0.4,
    ulasim_altyapisi: 0.3,
    cevresel_etki: 0.2,
    sosyal_fayda: 0.1
};

// Normalizasyon fonksiyonu
function normalize(data) {
    const maxVal = Math.max(...data);
    return data.map(x => x / maxVal);
}

// Softmax fonksiyonu
function softmax(values) {
    const eValues = values.map(x => Math.exp(x));
    const sum = eValues.reduce((acc, val) => acc + val, 0);
    return eValues.map(x => x / sum);
}

// Ağırlıklı skorları hesapla
function calculateScores(mahalleler, agirliklar) {
    const scores = {};
    const nufus_yogunlugu_values = Object.values(mahalleler).map(m => m.nufus_yogunlugu);
    const ulasim_altyapisi_values = Object.values(mahalleler).map(m => m.ulasim_altyapisi);
    const cevresel_etki_values = Object.values(mahalleler).map(m => m.cevresel_etki);
    const sosyal_fayda_values = Object.values(mahalleler).map(m => m.sosyal_fayda);
    
    const nufus_yogunlugu_norm = normalize(nufus_yogunlugu_values);
    const ulasim_altyapisi_norm = normalize(ulasim_altyapisi_values);
    const cevresel_etki_norm = normalize(cevresel_etki_values);
    const sosyal_fayda_norm = normalize(sosyal_fayda_values);

    Object.keys(mahalleler).forEach((mahalle, index) => {
        const score = (
            agirliklar.nufus_yogunlugu * nufus_yogunlugu_norm[index] +
            agirliklar.ulasim_altyapisi * ulasim_altyapisi_norm[index] +
            agirliklar.cevresel_etki * cevresel_etki_norm[index] +
            agirliklar.sosyal_fayda * sosyal_fayda_norm[index]
        );
        scores[mahalle] = score;
    });

    return scores;
}

// Softmax sonuçları
const scores = calculateScores(mahalleler, agirliklar);
console.log('Mahallelere ait ağırlıklı skorlar:', scores);
const softmaxScores = softmax(Object.values(scores));
console.log('Softmax sonuçları:', softmaxScores);

// En uygun güzergahı bul
const mahallelerListesi = Object.keys(mahalleler);
const highestScoreIndex = softmaxScores.indexOf(Math.max(...softmaxScores));
const bestRoute = mahallelerListesi[highestScoreIndex];

console.log('Softmax ile en uygun güzergah:', bestRoute);

// Leaflet Harita Başlatma
const map = L.map('map').setView([41.7351, 27.2252], 13);

// OpenStreetMap Katmanı
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Mahalle Konumları (örnek koordinatlar)
const mahalleKonumlari = {
    'Karakaş Mahallesi': [41.7338317207823, 27.21992166358032],
    'Bademlik Mahallesi': [41.73971651199775,  27.213700300177628],
    'Karahıdır Mahallesi': [41.71607480083008, 27.19879577555018]
};

// Mahalleleri Haritada Göster
Object.keys(mahalleKonumlari).forEach(mahalle => {
    L.marker(mahalleKonumlari[mahalle])
        .addTo(map)
        .bindPopup(`<b>${mahalle}</b>`);
});

// En Uygun Güzergahı İşaretle
L.circle(mahalleKonumlari[bestRoute], {
    color: 'green',
    fillColor: '#32CD32',
    fillOpacity: 0.5,
    radius: 300
}).addTo(map).bindPopup(`<b>En Uygun Güzergah:</b> ${bestRoute}`);
