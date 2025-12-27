document.addEventListener('DOMContentLoaded', function() {

    async function fetchData() {
        try {
            const response = await fetch('/assets/src/json/data.json');
            return await response.json();
        } catch (error) {
            console.error("Error loading JSON:", error);
        }
    }

    async function init() {
        const data = await fetchData();
        if (!data) return;

        // 1. Set Info Dasar
        document.title = `${data.namaKelas} | Official Website`;
        document.getElementById('nama-kelas-hero').innerText = data.namaKelas;
        document.getElementById('nama-kelas-footer').innerText = data.namaKelas;

        // 2. Typed.js (Efek ketik simpel)
        new Typed('#typed-text', {
            strings: ["Selamat Datang.", `Ini Kelas ${data.namaKelas}.`, "We create memories."],
            typeSpeed: 60,
            backSpeed: 40,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });

        // 3. Render Struktur (Menggunakan Class Tailwind)
        const strukturContainer = document.getElementById('struktur-kelas-container');
        
        // Template kartu yang clean & soft (Neutral-900 dengan border tipis)
        const createCard = (jabatan, nama, icon) => `
            <div class="group p-6 bg-neutral-900 border border-white/5 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                <div class="w-12 h-12 bg-black rounded-full flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                    <i class="fas ${icon} text-xl"></i>
                </div>
                <h3 class="text-white font-medium text-lg mb-1">${jabatan}</h3>
                <p class="text-gray-400 text-sm">${nama}</p>
            </div>
        `;

        // Wali Kelas
        strukturContainer.innerHTML += createCard("Wali Kelas", data.waliKelas, "fa-chalkboard-user");
        
        // Perangkat Kelas
        const icons = ['fa-crown', 'fa-pen-nib', 'fa-book-open', 'fa-wallet'];
        data.strukturKelas.forEach((item, index) => {
            strukturContainer.innerHTML += createCard(item.jabatan, item.nama, icons[index] || 'fa-user');
        });

        // 4. Render Jadwal (Grid simpel)
        const renderSchedule = (containerId, scheduleData, isMapel) => {
            const container = document.getElementById(containerId);
            scheduleData.forEach(item => {
                const listItems = isMapel 
                    ? item.mapel.map(m => `<span class="block text-gray-400 text-sm py-0.5 border-l-2 border-transparent hover:border-blue-500 hover:text-white hover:pl-2 transition-all cursor-default">${m}</span>`).join('')
                    : item.anggota.map(a => `<span class="inline-block bg-black px-3 py-1 rounded-full text-xs text-gray-400 border border-white/5 mr-1 mb-1">${a}</span>`).join('');

                container.innerHTML += `
                    <div class="flex flex-col sm:flex-row gap-4 border-b border-white/5 pb-4 last:border-0">
                        <div class="sm:w-24 shrink-0">
                            <span class="text-white font-medium bg-blue-600/10 text-blue-400 px-3 py-1 rounded-lg text-sm">${item.hari}</span>
                        </div>
                        <div class="flex-grow ${isMapel ? '' : 'flex flex-wrap'}">
                            ${listItems}
                        </div>
                    </div>`;
            });
        };

        renderSchedule('jadwal-pelajaran-container', data.jadwalPelajaran, true);
        renderSchedule('jadwal-piket-container', data.jadwalPiket, false);

        // 5. Render Galeri (Swiper Slide)
        const galeriContainer = document.getElementById('galeri-container');
        data.galeri.forEach(item => {
            const isVideo = item.type === 'video';
            // Icon play overlay jika video
            const playIcon = isVideo ? 
                `<div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10"><i class="fas fa-play text-white text-4xl drop-shadow-lg opacity-80"></i></div>` : '';
            
            galeriContainer.innerHTML += `
                <div class="swiper-slide h-[300px] md:h-[400px] rounded-xl overflow-hidden relative group">
                    <a href="${item.source}" class="glightbox block w-full h-full relative" data-gallery="kelas-gallery">
                        ${playIcon}
                        <img src="${item.thumbnail}" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt="Galeri">
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                    </a>
                </div>`;
        });

        // 6. Init Plugins
        new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            centeredSlides: true,
            autoplay: { delay: 3500, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
            }
        });

        GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });

        // 7. Observer Animasi Scroll (Fade Up)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-observe]').forEach(el => observer.observe(el));
    }

    init();
});
