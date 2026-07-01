# Klasifikasi Aksara Nusantara

Proyek ini adalah implementasi *Deep Learning* berbasis EfficientNet untuk mengklasifikasi gambar Aksara Nusantara (Aksara Jawa, Bali, dan Sunda). Proyek ini dilengkapi dengan *Backend* API menggunakan FastAPI dan antarmuka *Frontend* menggunakan React (Vite).

## Struktur Proyek

- `/backend`: Berisi API menggunakan FastAPI dan spesifikasi `requirements.txt`.
- `/frontend`: Berisi antarmuka web (React + Vite) untuk mencoba klasifikasi.
- `Klasifikasi_Aksara_Nusantara.ipynb`: Notebook eksperimen penelitian untuk melatih model.
- `best_model_efficientnet.keras`: File model *Deep Learning* terbaik hasil dari pelatihan.

## Prasyarat

Sebelum menjalankan proyek, pastikan telah terinstal:
1. [Python](https://www.python.org/downloads/) (Disarankan versi 3.8 - 3.10)
2. [Node.js & NPM](https://nodejs.org/)

### PENTING: Mengunduh Dataset
Folder **`Dataset`** sengaja **tidak disertakan** di repositori ini karena ukurannya yang besar. Dataset diwajibkan untuk diunduh secara manual melalui tautan berikut:

**[Download Dataset (Google Drive)](https://drive.google.com/file/d/19lESWyNDyieuLTmRoW5epsa1dSdocWbi/view?usp=drive_link)**

**Instruksi Pemasangan Dataset:**
1. Unduh *file* berformat zip dari tautan di atas.
2. Ekstrak *file* tersebut langsung ke *root* direktori proyek ini.
3. Pastikan struktur foldernya bernama `Dataset` (huruf 'D' kapital) dan berisi sub-folder seperti ini:
   ```
   Dataset/
   ├── Aksara Bali/
   ├── Aksara Jawa/
   └── Aksara Sunda/
   ```

## Cara Menjalankan Aplikasi

### 1. Kloning Repositori
Clone repositori ini ke komputer lalu masuk ke direktori proyek:
```bash
git clone https://github.com/rizkimauln/Klasifikasi-Aksara-Nusantara.git
cd Klasifikasi-Aksara-Nusantara
```
*(Catatan: Jangan lupa menempatkan folder `Dataset` hasil unduhan ke dalam folder proyek ini).*

### 2. Menjalankan Backend (FastAPI)
Buka terminal dan navigasikan ke folder backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Server API akan berjalan secara lokal di `http://127.0.0.1:8000`.

### 3. Menjalankan Frontend (React)
Buka tab terminal **baru** dan navigasikan ke folder frontend:
```bash
cd frontend

# Salin file environment contoh (Windows CMD/Powershell)
copy .env.example .env
# (Atau gunakan 'cp .env.example .env' jika menggunakan bash/Mac/Linux)

npm install
npm run dev
```
Buka *browser* dan kunjungi URL yang diberikan (umumnya `http://localhost:5173`). Aplikasi siap untuk diuji coba.

## Melatih Ulang Model (Retraining)

Karena kode di dalam notebook saat ini sudah disesuaikan khusus untuk lingkungan Google Colab (terdapat *path* `/content/`), silakan perhatikan perbedaan cara menjalankannya di bawah ini:

### Opsi A: Melatih di Komputer Lokal
1. Pastikan folder `Dataset/` sudah diekstrak dan diletakkan di *root* direktori proyek sesuai instruksi di atas.
2. Buka file `Klasifikasi_Aksara_Nusantara.ipynb` menggunakan Jupyter Notebook atau VSCode.
3. **Penyesuaian Kode (Wajib)**: Cari *Cell* ke-2, lalu sesuaikan agar bisa berjalan di Windows/Lokal:
   - Hapus atau beri komentar pada baris eksekusi zip: `# !unzip -q /content/Dataset.zip -d /content`
   - Ubah variabel path dataset dari: `dataset_dir = '/content/Dataset'` menjadi `dataset_dir = 'Dataset'`
4. Jalankan seluruh sel (*Run All*) secara berurutan. File `best_model_efficientnet.keras` akan diperbarui secara otomatis ketika akurasi membaik.
5. Jika backend FastAPI sedang menyala, *restart* server backend tersebut agar memuat model versi terbaru.

### Opsi B: Melatih di Google Colab (Sangat Disarankan)
1. Buka [Google Colab](https://colab.research.google.com/) dan unggah (*upload*) file `Klasifikasi_Aksara_Nusantara.ipynb`.
2. Unggah file **`Dataset.zip`** (tanpa perlu diekstrak terlebih dahulu) langsung ke direktori bawaan Colab (yaitu folder `/content/`).
3. Ubah *runtime* ke GPU untuk mempercepat proses (Pilih menu **Runtime** > **Change runtime type** > Pilih **T4 GPU**).
4. Jalankan semua *cell* secara berurutan. Kode `!unzip` di dalam notebook sudah diatur agar otomatis mengekstrak dataset tersebut.
5. Setelah *training* selesai, unduh file hasil yaitu `best_model_efficientnet.keras` dari panel *Files* di sebelah kiri antarmuka Colab.
6. Pindahkan file yang baru diunduh tersebut ke komputer lokal (timpa file model lama yang ada di *root* proyek ini).
