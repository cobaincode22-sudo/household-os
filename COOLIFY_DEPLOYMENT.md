# Panduan Deployment Household OS ke Coolify (Hostinger VPS)

Repositori GitHub: **https://github.com/cobaincode22-sudo/household-os**

---

## 1. Hubungkan Aplikasi ke Coolify
1. Buka dashboard **Coolify** di browser Anda (misalnya `http://YOUR_VPS_IP:8000`).
2. Masuk ke menu **Projects** > Pilih atau buat project baru (misal: `Household`).
3. Klik **+ New Resource** > Pilih **Public Repository** (atau Private jika terhubung GitHub App).
4. Masukkan URL repositori GitHub:
   ```text
   https://github.com/cobaincode22-sudo/household-os
   ```
5. Pada pengaturan aplikasi di Coolify:
   - **Build Pack**: Pilih `Dockerfile`
   - **Base Directory**: `/server`
   - **Dockerfile Location**: `/Dockerfile`
   - **Ports Exposes**: `4000`

---

## 2. Hubungkan ke Shared MongoDB di VPS Hostinger
Di dashboard Coolify pada menu **Environment Variables** aplikasi Anda, tambahkan:

```env
PORT=4000
MONGODB_URI=mongodb://USER_MONGODB:PASSWORD_MONGODB@INTERNAL_IP_ATAU_CONTAINER:27017/household_os?authSource=admin
```

> **Tips Shared MongoDB di Coolify/VPS:**
> - Jika MongoDB Anda dijalankan di Coolify pada VPS yang sama, gunakan nama service/container internal Coolify atau `172.17.0.1:27017` / IP internal VPS.
> - Jika MongoDB Anda berjalan di host VPS langsung (native `systemd`), gunakan IP docker gateway `172.17.0.1:27017` atau IP publik VPS.

---

## 3. Atur Domain / Subdomain di Coolify
Di kolom **Domains** aplikasi di Coolify:
- Masukkan subdomain Anda, misalnya: `https://api-household.domainanda.com`
- Coolify dan Traefik akan otomatis menghasilkan **SSL HTTPS gratis (Let's Encrypt)**.

Klik tombol **Deploy** di Coolify.

---

## 4. Hubungkan Mobile App ke API Coolify
Setelah backend Anda aktif di Coolify (misal `https://api-household.domainanda.com`), konfigurasi `EXPO_PUBLIC_API_URL` pada mobile app:

Buat file `.env` di root project mobile `household-os`:
```env
EXPO_PUBLIC_API_URL=https://api-household.domainanda.com
```

Layanan mobile app akan langsung melakukan request sinkronisasi ke MongoDB melalui Coolify API tersebut.
