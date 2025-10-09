document.addEventListener('DOMContentLoaded', function() {
    
    // Fungsi untuk mengambil data dari file JSON
    async function fetchData() {
        const response = await fetch('/assets/src/json/data.json');
        return await response.json();
    }

    // Fungsi utama
    async function init() {
        const data = await fetchData();

        // 1. Mengisi Teks Dinamis
        document.title = `Website ${data.namaKelas}`;
        document.querySelector('.nav-logo').innerText = data.namaKelas;
        document.getElementById('nama-kelas-hero').innerText = data.namaKelas;
        document.getElementById('nama-kelas-footer').innerText = data.namaKelas;

        // 2. Inisialisasi Efek Ketik (Typed.js)
        new Typed('#typed-text', {
            strings: ["Selamat Datang", `Di Website ${data.namaKelas}`],
            typeSpeed: 70, backSpeed: 50, loop: true, backDelay: 2000,
        });

        // 3. Membuat Konten Struktur Kelas dengan Ikon
        const strukturContainer = document.getElementById('struktur-kelas-container');
        // Icon untuk Wali Kelas
        strukturContainer.innerHTML += `
            <div class="card">
                <div class="card-icon"><i class="fas fa-chalkboard-teacher"></i></div>
                <h3 class="jabatan">Wali Kelas</h3>
                <p class="nama">${data.waliKelas}</p>
            </div>`;
        // Icon untuk Perangkat Kelas
        const icons = ['fa-user-tie', 'fa-user-graduate', 'fa-book-open', 'fa-coins'];
        data.strukturKelas.forEach((item, index) => {
            strukturContainer.innerHTML += `
                <div class="card">
                    <div class="card-icon"><i class="fas ${icons[index] || 'fa-user'}"></i></div>
                    <h3 class="jabatan">${item.jabatan}</h3>
                    <p class="nama">${item.nama}</p>
                </div>`;
        });
        
        // 4. Membuat Konten Jadwal Pelajaran
        const jadwalPelajaranContainer = document.getElementById('jadwal-pelajaran-container');
        data.jadwalPelajaran.forEach(hari => {
            const mapelList = hari.mapel.map(m => `<li>${m}</li>`).join('');
            jadwalPelajaranContainer.innerHTML += `
                <div class="schedule-item">
                    <h4>${hari.hari}</h4>
                    <ul>${mapelList}</ul>
                </div>`;
        });

        // 5. Membuat Konten Jadwal Piket
        const jadwalPiketContainer = document.getElementById('jadwal-piket-container');
        data.jadwalPiket.forEach(hari => {
            const anggotaList = hari.anggota.map(a => `<li>${a}</li>`).join('');
            jadwalPiketContainer.innerHTML += `
                <div class="schedule-item">
                    <h4>${hari.hari}</h4>
                    <ul>${anggotaList}</ul>
                </div>`;
        });

        // 6. Membuat Konten Galeri
        const galeriContainer = document.getElementById('galeri-container');
        data.galeri.forEach(foto => {
            galeriContainer.innerHTML += `<div class="swiper-slide"><img src="${foto}" alt="Foto ${data.namaKelas}"></div>`;
        });

        // 7. Inisialisasi Galeri (Swiper.js)
// Ganti seluruh blok inisialisasi Swiper Anda dengan ini:
const mySwiper = new Swiper(".mySwiper", { // <--- Tambahkan "const mySwiper ="
    // --- Konfigurasi Dasar ---
    loop: true,
    spaceBetween: 30,
    centeredSlides: true,

    // --- Konfigurasi Autoplay ---
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    // --- Konfigurasi Navigasi & Paginasi ---
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    // --- KONFIGURASI PENTING UNTUK PERBAIKAN BUG ---
    hashNavigation: false,
    roundLengths: true,
    observer: true,
    observeParents: true,
    a11y: { enabled: false },

    // --- TAMBAHAN BARU PALING PENTING ---
    preventClicks: true,
    preventClicksPropagation: true,
});

// KODE BARU: Tambahkan ini tepat di bawah blok "new Swiper" di atas

// Kode ini akan secara paksa menghilangkan fokus dari elemen apa pun
// tepat sebelum transisi slide dimulai. Ini adalah kunci untuk mencegah
// browser melakukan scroll otomatis.
mySwiper.on('transitionStart', function () {
  if (document.activeElement) {
    document.activeElement.blur();
  }
});

        // 8. Animasi Saat Scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
        
        // 9. Efek Sembunyi/Tampil Navbar saat scroll
        let lastScrollY = window.scrollY;
        window.addEventListener("scroll", () => {
            if (lastScrollY < window.scrollY) {
                document.querySelector('.navbar').style.top = "0px";
            } else {
                document.querySelector('.navbar').style.top = "0";
            }
            lastScrollY = window.scrollY;
        });
    }

    init(); // Panggil fungsi utama
});