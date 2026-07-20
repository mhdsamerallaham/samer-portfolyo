# OmniRoute Deploy Rehberi

OmniRoute, OpenAI-uyumlu tek bir endpoint arkasında 250+ AI sağlayıcısını
otomatik fallback ile yöneten, self-hosted, MIT lisanslı bir gateway.

Bu rehber, OmniRoute'u **Oracle Cloud Always Free** üzerinde deploy
etmenizi adım adım açıklar.

> **Not:** OmniRoute serverless ortamlarda (Vercel Functions, Cloudflare Workers)
> çalışmaz — kalıcı bir Node.js süreci gerektirir. Render.com/Koyeb gibi
> free tier'lar 512MB RAM ile sınırlıdır ve OmniRoute için **yetersizdir**.

---

## Oracle Cloud Always Free (Önerilen — 24GB RAM, Sonsuza Kadar Ücretsiz)

Oracle Cloud, "Always Free" tier'da **4 ARM çekirdek + 24GB RAM** VM sunuyor.
Bu, OmniRoute'u rahatça çalıştırır. Kredi kartı gerektirir ama **ücret kesilmez**
(Always Free kaynaklar hiçbir zaman faturalandırılmaz).

### Adım 1: Oracle Cloud Hesabı Aç

1. [cloud.oracle.com/free](https://cloud.oracle.com/free) → **"Start for Free"**
2. E-posta, telefon ve kredi kartı bilgilerini gir
3. **Home Region** olarak yakın bir bölge seç (ör. `eu-frankfurt-1` veya `eu-amsterdam-1`)
4. Hesap aktifleşmesini bekle (genelde 5-15 dakika)

> ⚠️ Kredi kartından doğrulama için ~$1 çekilip iade edilir. Always Free
> kaynaklar için asla ücret kesilmez.

### Adım 2: ARM VM (Compute Instance) Oluştur

1. Oracle Cloud Console → **"Create a VM Instance"**
2. Ayarlar:

| Ayar | Değer |
|------|-------|
| **Name** | `omniroute` |
| **Image** | **Oracle Linux 9** (veya Ubuntu 22.04) |
| **Shape** | **VM.Standard.A1.Flex** (Always Free) |
| **OCPUs** | `2` (max 4, ama 2 yeterli) |
| **RAM** | `12 GB` (max 24, ama 12 yeterli) |
| **Boot volume** | 50 GB (Always Free dahilinde) |

3. **SSH key** ekle (mevcut key'ini yükle veya yeni oluştur — `.pem` dosyasını indir)
4. **"Create"** butonuna tıkla

### Adım 3: Firewall (Security List) Aç

1. VM detay sayfası → **"Subnet"** linkine tıkla
2. **"Security Lists"** → **"Default Security List"** → **"Add Ingress Rules"**:

| Ayar | Değer |
|------|-------|
| **Source CIDR** | `0.0.0.0/0` |
| **Destination Port** | `20128` |
| **Protocol** | TCP |

3. **"Add Ingress Rules"** kaydet

### Adım 4: SSH ile Bağlan ve Docker Kur

```bash
# SSH ile bağlan
ssh -i ~/path/to/your-key.pem opc@<VM_PUBLIC_IP>

# Docker kur (Oracle Linux 9)
sudo dnf install -y dnf-utils
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

# Çıkış yap ve tekrar bağlan (group değişikliği için)
exit
ssh -i ~/path/to/your-key.pem opc@<VM_PUBLIC_IP>
```

Ubuntu kullanıyorsan:
```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
exit
ssh -i ~/path/to/your-key.pem ubuntu@<VM_PUBLIC_IP>
```

### Adım 5: OS Firewall'u Aç

Oracle Linux'ta iptables de açılmalı:
```bash
sudo firewall-cmd --permanent --add-port=20128/tcp
sudo firewall-cmd --reload
```

Ubuntu'da:
```bash
sudo iptables -I INPUT -p tcp --dport 20128 -j ACCEPT
sudo netfilter-persistent save
```

### Adım 6: OmniRoute'u Docker ile Çalıştır

```bash
docker run -d \
  --name omniroute \
  --restart unless-stopped \
  -p 20128:20128 \
  -e PORT=20128 \
  diegosouzapw/omniroute
```

İlk çalıştırma image'ı çekeceği için 2-5 dakika sürebilir.

### Adım 7: Test Et

```bash
# VM üzerinde lokal test
curl http://localhost:20128/v1/models

# Kendi bilgisayarınızdan
curl http://<VM_PUBLIC_IP>:20128/v1/models
```

200 OK dönüyorsa gateway hazır! 🎉

### Adım 8: OmniRoute Dashboard'da Provider Key'leri Ekle

1. Tarayıcıda aç:
   ```
   http://<VM_PUBLIC_IP>:20128
   ```
2. Dashboard'da **"Connections"** / **"Providers"** bölümüne git
3. Mevcut API key'lerini ekle:

| Sağlayıcı  | Eklenecek Key                      |
|-------------|-------------------------------------|
| Gemini      | Mevcut Gemini API Key'iniz          |
| Groq        | Mevcut Groq API Key'iniz            |
| Mistral     | Mevcut Mistral API Key'iniz         |
| OpenRouter  | Mevcut OpenRouter API Key'iniz      |

---

## Projenizde Yapılacak Son Ayar

`.env` dosyalarında `OMNIROUTE_BASE_URL`'i güncelleyin:

```env
OMNIROUTE_BASE_URL=http://<VM_PUBLIC_IP>:20128/v1
OMNIROUTE_API_KEY=omniroute
```

Vercel'e deploy ediyorsanız, aynı değişkenleri Vercel Dashboard →
Settings → Environment Variables'a da ekleyin.

---

## (Opsiyonel) HTTPS ile Güvenli Hale Getirme

Ücretsiz SSL sertifikası için Caddy reverse proxy kullanabilirsiniz:

```bash
# Caddy kur
sudo dnf install -y caddy   # Oracle Linux
# veya
sudo apt install -y caddy   # Ubuntu

# Caddyfile oluştur
sudo tee /etc/caddy/Caddyfile << 'EOF'
omniroute.yourdomain.com {
    reverse_proxy localhost:20128
}
EOF

# Caddy başlat
sudo systemctl enable --now caddy
```

Bu durumda URL'iniz şöyle olur:
```env
OMNIROUTE_BASE_URL=https://omniroute.yourdomain.com/v1
```

---

## Oracle Cloud Always Free Limitleri

| Kaynak | Always Free Limit |
|--------|-------------------|
| ARM VM | 4 OCPU + 24GB RAM (toplam) |
| Boot Volume | 200 GB (toplam) |
| Network | 10 TB/ay outbound |
| Süre | **Sonsuza kadar** (süresi dolmaz) |

> OmniRoute genelde ~300-500MB RAM kullanır. 12GB ayırdığınızda
> aynı VM'de başka servisler de çalıştırabilirsiniz.

---

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| SSH bağlanamıyor | Security list'te 22 portu açık mı kontrol et |
| curl timeout | OS firewall (firewall-cmd/iptables) + OCI security list'i kontrol et |
| Container crash | `docker logs omniroute` ile logları kontrol et |
| Yavaş başlangıç | ARM image ilk çekimde yavaş olabilir, 5 dk bekle |
| "Out of capacity" | Farklı availability domain dene veya birkaç saat sonra tekrar dene |
