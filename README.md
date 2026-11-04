# Portfolio

## Jalankan lokal
npm install && npm run dev

## Publish ke GitHub Pages (tanpa hosting)
1. Buat repo di GitHub, lalu push project ini ke branch `main`.
2. Repo > Settings > Pages > Source: **GitHub Actions**.
3. Repo > Settings > Secrets and variables > Actions > tambahkan secret:
   VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
4. Push ke `main`. Situs tayang di https://USERNAME.github.io/NAMA-REPO/
(Beri nama repo `USERNAME.github.io` untuk alamat https://USERNAME.github.io/)

Taruh CV di `public/cv.pdf`.
