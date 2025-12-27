document.addEventListener('DOMContentLoaded', function() {

    // Fungsi untuk mengambil data JSON
    async function fetchData() {
        try {
            const response = await fetch('/assets/src/json/data.json');
            return await response.json();
        } catch (error) {
            console.error("Gagal memuat data:", error);
        }
    }

    async function init() {
        const data = await fetchData();
        if (!data) return;

        // 1. Setup Teks
        document.title = `Website ${data.namaKelas} | Athenaeon`;
        // Jangan ubah logo nav jika ingin mempertahankan "Athenaeon" hardcoded, 
        // atau gunakan: document.querySelector('.nav-logo').innerText = data.namaKelas;
        document.getElementById('nama-kelas-hero').innerText = data.namaKelas;
        document.getElementById('nama-kelas-footer').innerText = data.namaKelas;

        // 2. Typed.js (Setting Lebih Lambat & Elegan)
        new Typed('#typed-text', {
            strings: ["Welcome.", "Selamat Datang.", "Bienvenue."],
            typeSpeed: 100,
            backSpeed: 50,
            startDelay: 500,
            backDelay: 3000,
            loop: true,
            showCursor: false // Hilangkan kursor kedip biar lebih clean
        });

        // 3. Render Struktur Kelas
        const strukturContainer = document.getElementById('struktur-kelas-container');
        
        // Wali Kelas
        strukturContainer.innerHTML += `
            <div class="card animate__animated">
                <div class="card-icon"><i class="fas fa-crown"></i></div>
                <h3 class="jabatan">Guardian (Wali Kelas)</h3>
                <p class="nama">${data.waliKelas}</p>
            </div>`;
            
        // Siswa/Struktur Lain
        const icons = ['fa-user-tie', 'fa-pen-fancy', 'fa-book', 'fa-wallet'];
        data.strukturKelas.forEach((item, index) => {
            strukturContainer.innerHTML += `
                <div class="card">
                    <div class="card-icon"><i class="fas ${icons[index] || 'fa-user'}"></i></div>
                    <h3 class="jabatan">${item.jabatan}</h3>
                    <p class="nama">${item.nama}</p>
                </div>`;
        });

        // 4. Render Jadwal
        const jadwalPelajaranContainer = document.getElementById('jadwal-pelajaran-container');
        data.jadwalPelajaran.forEach(hari => {
            const mapelList = hari.mapel.map(m => `<li>${m}</li>`).join('');
            jadwalPelajaranContainer.innerHTML += `
                <div class="schedule-item">
                    <h4>${hari.hari}</h4>
                    <ul>${mapelList}</ul>
                </div>`;
        });

        const jadwalPiketContainer = document.getElementById('jadwal-piket-container');
        data.jadwalPiket.forEach(hari => {
            const anggotaList = hari.anggota.map(a => `<li>${a}</li>`).join('');
            jadwalPiketContainer.innerHTML += `
                <div class="schedule-item">
                    <h4>${hari.hari}</h4>
                    <ul>${anggotaList}</ul>
                </div>`;
        });

        // 5. Render Galeri
        const galeriContainer = document.getElementById('galeri-container');
        data.galeri.forEach(item => {
            const videoClass = item.type === 'video' ? 'video-thumbnail' : '';
            const linkElement = `
                <a href="${item.source}" class="glightbox ${videoClass}" data-gallery="kelas-gallery">
                    <img src="${item.thumbnail}" alt="Media Kelas">
                </a>
            `;
            galeriContainer.innerHTML += `<div class="swiper-slide">${linkElement}</div>`;
        });

        // 6. Inisialisasi Swiper (Mode "Coverflow" untuk efek mewah)
        const mySwiper = new Swiper(".mySwiper", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows: true,
            },
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            observer: true,
            observeParents: true,
        });

        // 7. GLightbox
        const lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            autoplayVideos: true
        });

        // 8. Scroll Animation Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
    }

    init();
});
