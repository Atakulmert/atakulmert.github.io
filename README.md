# Pocket Portfolio

Mert Atakul'un interaktif 3D özgeçmişi. Ekranda kodla modellenmiş bir telefon duruyor. Telefonun ekranı gerçek HTML'den oluşan küçük bir "OS" ve CV'nin her bölümü bu OS'ta bir uygulama.

**Stack:** React 19 · Vite · React Three Fiber · drei · Zustand

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ klasörüne üretim çıktısı
```

Aynı ağdaki telefondan test etmek için `npm run dev -- --host` komutunu çalıştırıp telefonda gösterilen IP adresini aç.

## İçeriği güncelleme

Tüm CV içeriği tek bir dosyada: `src/data/cv.ts` (TR ve EN birlikte).

- `profile.status`: Dynamic Island'da görünen durum mesajı
- `profile.showPhone`: telefon numarasını göstermek için `true` yap
- `notifications`: kilit ekranında ve ana ekranda düşen bildirimler
- `chat`: Mesajlar uygulamasındaki hazır sorular ve cevaplar
- Profil fotoğrafı: `public/me.jpg`

Arayüz metinleri `src/i18n.ts` dosyasında.

## Yapı

```
src/
  data/cv.ts          CV içeriği
  os/                 Telefon ekranının içi (390×844 px DOM)
    PhoneOS.tsx       Status bar, Dynamic Island, kilit ekranı, bildirimler
    HomeScreen.tsx    Widget'lar, ikonlar, dock
    AppHost.tsx       Uygulama açma/kapama animasyonu, NavBar
    apps/             Hakkımda, Kariyer (Wallet), Ayarlar (yetenekler), Eğitim, Mesajlar, Terminal, Web (mini tarayıcı)
  three/
    Scene.tsx         Canvas, ışıklar, kamera/telefon hareketi
    Phone.tsx         Prosedürel telefon modeli + arka kapak çıkartmaları + <Html> ekran
    controls.ts       Sürükleyerek döndürme, ön/arka yüze oturma
    gyro.ts           Mobilde jiroskopla eğme
```

## Davranışlar

- **Masaüstü:** Telefonu sürükleyerek döndür (bırakınca ön ya da arka yüze oturur). Fareyle hafif parallax var. Uygulama açılınca kamera yaklaşır. `Esc` uygulamayı kapatır.
- **Mobil:** Kilit açılınca kamera yaklaşır ve sanal ekran gerçek ekranı doldurur. Jiroskop (iOS'ta izin ister) ile eğim ve Android'de titreşim var.
- **WebGL yoksa:** Aynı arayüz düz bir CSS telefon çerçevesinde gösterilir.

## Yayınlama

Vercel veya Netlify'da framework olarak "Vite" seçmek yeterli (build: `npm run build`, çıktı: `dist`).

Bu repo GitHub Actions ile yayınlanıyor: `main`'e her push'ta `.github/workflows/deploy.yml` siteyi derleyip https://atakulmert.github.io adresine koyar. (Repo ayarlarında Pages → Source: **GitHub Actions** olmalı.)
