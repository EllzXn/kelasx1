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

        // --- 1. SETUP INFO UMUM ---
        document.title = `${data.namaKelas} | Official Website`;
        document.getElementById('nama-kelas-hero').innerText = data.namaKelas;
        document.getElementById('nama-kelas-footer').innerText = data.namaKelas;

        new Typed('#typed-text', {
            strings: ["Selamat Datang.", `Ini Kelas ${data.namaKelas}.`, "We create memories."],
            typeSpeed: 50, backSpeed: 30, loop: true, showCursor: true, cursorChar: '|'
        });

        // --- 2. RENDER STRUKTUR (Card Style) ---
        const strukturContainer = document.getElementById('struktur-kelas-container');
        const createCard = (jabatan, nama, icon) => `
            <div class="group p-6 bg-neutral-900 border border-white/5 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                <div class="w-12 h-12 bg-black rounded-full flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                    <i class="fas ${icon} text-xl"></i>
                </div>
                <h3 class="text-white font-medium text-lg mb-1">${jabatan}</h3>
                <p class="text-gray-400 text-sm">${nama}</p>
            </div>
        `;

        strukturContainer.innerHTML += createCard("Wali Kelas", data.waliKelas, "fa-chalkboard-user");
        const icons = ['fa-crown', 'fa-pen-nib', 'fa-book-open', 'fa-wallet'];
        data.strukturKelas.forEach((item, index) => {
            strukturContainer.innerHTML += createCard(item.jabatan, item.nama, icons[index] || 'fa-user');
        });

        // --- 3. SMART JADWAL SYSTEM (NEW) ---
        const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const todayIndex = new Date().getDay(); 
        let activeDayIndex = todayIndex; 

        const jadwalContent = document.getElementById('jadwal-content');
        const dayLabel = document.getElementById('current-day-name');
        const statusLabel = document.getElementById('current-date-status');

        const renderDailySchedule = (dayIndex) => {
            const currentDayName = dayNames[dayIndex];
            
            // Animasi Fade Out
            jadwalContent.style.opacity = '0';
            jadwalContent.style.transform = 'translateY(10px)';

            setTimeout(() => {
                // Update Label
                dayLabel.innerText = currentDayName;
                
                // Logic Label Status
                if (dayIndex === todayIndex) {
                    statusLabel.innerText = "Hari Ini";
                    statusLabel.className = "block text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1";
                } else if (dayIndex === (todayIndex + 1) % 7) {
                    statusLabel.innerText = "Besok";
                    statusLabel.className = "block text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1";
                } else if (dayIndex === (todayIndex - 1 + 7) % 7) {
                    statusLabel.innerText = "Kemarin";
                    statusLabel.className = "block text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1";
                } else {
                    statusLabel.innerText = "Lihat Jadwal";
                    statusLabel.className = "block text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1";
                }

                // Ambil Data dari JSON
                const dataMapel = data.jadwalPelajaran.find(d => d.hari === currentDayName);
                const dataPiket = data.jadwalPiket.find(d => d.hari === currentDayName);

                // Cek apakah Libur (Data undefined)
                if (!dataMapel && !dataPiket) {
                    jadwalContent.innerHTML = `
                        <div class="flex flex-col items-center justify-center py-12 text-center bg-neutral-900/30 border border-white/5 rounded-3xl animate-fade-in">
                            <div class="w-16 h-16 bg-gradient-to-tr from-blue-900/20 to-transparent rounded-full flex items-center justify-center mb-4 text-blue-400">
                                <i class="fas fa-mug-hot text-2xl"></i>
                            </div>
                            <h3 class="text-lg text-white font-medium mb-1">Tidak Ada Jadwal</h3>
                            <p class="text-gray-500 text-sm">Selamat beristirahat atau menikmati hari libur!</p>
                        </div>
                    `;
                } else {
                    // Render Mapel & Piket jika ada datanya
                    const listMapel = dataMapel 
                        ? dataMapel.mapel.map(m => `
                            <div class="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>
                                <span class="text-gray-300 text-sm font-medium">${m}</span>
                            </div>`).join('') 
                        : '<p class="text-gray-600 italic text-sm">Tidak ada pelajaran.</p>';

                    const listPiket = dataPiket 
                        ? dataPiket.anggota.map(a => `
                            <span class="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">${a}</span>
                        `).join('') 
                        : '<p class="text-gray-600 italic text-sm">Tidak ada piket.</p>';

                    jadwalContent.innerHTML = `
                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="bg-neutral-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/20 transition-all">
                                <div class="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/20 transition-all"></div>
                                <h3 class="text-white font-medium mb-4 flex items-center gap-2 text-lg">
                                    <i class="far fa-clock text-blue-400"></i> Mata Pelajaran
                                </h3>
                                <div class="space-y-2 relative z-10">${listMapel}</div>
                            </div>

                            <div class="bg-neutral-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/20 transition-all">
                                <h3 class="text-white font-medium mb-4 flex items-center gap-2 text-lg">
                                    <i class="fas fa-broom text-blue-400"></i> Petugas Piket
                                </h3>
                                <div class="flex flex-wrap gap-2 relative z-10">${listPiket}</div>
                            </div>
                        </div>
                    `;
                }

                // Animasi Fade In Kembali
                jadwalContent.style.opacity = '1';
                jadwalContent.style.transform = 'translateY(0)';
            }, 300); // Delay sesuai durasi CSS transition
        };

        // Render Awal
        renderDailySchedule(activeDayIndex);

        // Event Listeners Navigasi
        document.getElementById('btn-prev').addEventListener('click', () => {
            activeDayIndex = (activeDayIndex - 1 + 7) % 7; 
            renderDailySchedule(activeDayIndex);
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            activeDayIndex = (activeDayIndex + 1) % 7; 
            renderDailySchedule(activeDayIndex);
        });

        // --- 4. RENDER GALERI & PLUGINS ---
        const galeriContainer = document.getElementById('galeri-container');
        data.galeri.forEach(item => {
            const isVideo = item.type === 'video';
            const playIcon = isVideo ? `<div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10"><i class="fas fa-play text-white text-4xl drop-shadow-lg opacity-80"></i></div>` : '';
            
            galeriContainer.innerHTML += `
                <div class="swiper-slide h-[300px] md:h-[400px] rounded-xl overflow-hidden relative group">
                    <a href="${item.source}" class="glightbox block w-full h-full relative" data-gallery="kelas-gallery">
                        ${playIcon}
                        <img src="${item.thumbnail}" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt="Galeri">
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                    </a>
                </div>`;
        });

        new Swiper(".mySwiper", {
            slidesPerView: 1, spaceBetween: 20, loop: true, centeredSlides: true,
            autoplay: { delay: 3500, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
            }
        });

        GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });

        // Scroll Observer
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
