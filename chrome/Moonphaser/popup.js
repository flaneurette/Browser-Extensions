
const mooncanvas = document.getElementById('moon');
const moonctx = mooncanvas.getContext('2d');
const phases = ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];
const zodiac = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const centerX = 100, centerY = 100, radius = 100;

let baseDate = new Date();
let manualDays = 0;

mooncanvas.addEventListener('click', () => {
	baseDate.setDate(baseDate.getDate() + 1);
	updateMoon();
});

function julianDate(date) {
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth() + 1;
	const day = date.getUTCDate() + date.getUTCHours()/24 + date.getUTCMinutes()/(24*60);
	let A = Math.floor(year/100);
	let B = 2 - A + Math.floor(A/4);
	return Math.floor(365.25*(year + 4716)) + Math.floor(30.6001*(month + 1)) + day + B - 1524.5;
}

// Compute moon age in days
function getMoonAge() {
	const now = new Date(baseDate.getTime());
	now.setDate(now.getDate() + manualDays);

	const jd = julianDate(now);
	const jd0 = 2451550.1; // Reference New Moon
	const lunarCycle = 29.53058867;

	let age = (jd - jd0) % lunarCycle;
	if (age < 0) age += lunarCycle;

	return age;
}

function getPhaseIndex(age) {
	age = age.toFixed(1);
	const lunarCycle = 29.5;
	if (age < 0.5 || age >= lunarCycle - 1) return 0; // New Moon
	if (age < 5.936) return 1; // Waxing Crescent
	if (age < 9.228) return 2; // First Quarter
	if (age < 14) return 3; // Waxing Gibbous
	if (age < 16) return 4; // Full Moon
	if (age < 22) return 5; // Waning Gibbous
	if (age < 23.1) return 6; // Last Quarter
	if (age < lunarCycle) return 7; // Waning Crescent
	return 0;
}

function moonLongitude(jd) {
const deg2rad = Math.PI / 180;
	const D = jd - 2451545.0;

	// Mean longitude
	let L0 = (218.316 + 13.176396 * D) % 360;

	// Moon's mean elongation
	let Dm = (297.8501921 + 12.19074912 * D) % 360;

	// Sun's mean anomaly
	let M = (357.5291092 + 0.98560028 * D) % 360;

	// Moon's mean anomaly
	let Mm = (134.9633964 + 13.06499295 * D) % 360;

	// Longitude with main periodic corrections
	let lon = L0
		+ 6.289 * Math.sin(Mm * deg2rad)
		+ 1.274 * Math.sin((2*Dm - Mm) * deg2rad)
		+ 0.658 * Math.sin(2*Dm * deg2rad)
		+ 0.214 * Math.sin(2*Mm * deg2rad)
		- 0.186 * Math.sin(M * deg2rad);

	lon = lon % 360;
	if (lon < 0) lon += 360;
	return lon;
}

function getMoonSign(jd) {
	const L = moonLongitude(jd);
	return zodiac[Math.floor(L / 30)];
}


// Keep your original drawPhase
function drawPhase(index) {
	moonctx.clearRect(0, 0, mooncanvas.width, mooncanvas.height);

	switch (index) {
		case 0:
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#fdf5e6';
			moonctx.fill();
			moonctx.save();
			moonctx.beginPath();
			moonctx.ellipse(centerX, centerY, radius, radius, 0, 0, 2 * Math.PI);
			moonctx.clip();
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#000';
			moonctx.fill();
			moonctx.restore();
			break;
		case 1:
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#fdf5e6';
			moonctx.fill();
			moonctx.save();
			moonctx.beginPath();
			moonctx.ellipse(centerX - 28, centerY, radius, radius, 0, 0, 2 * Math.PI);
			moonctx.clip();
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#000';
			moonctx.fill();
			moonctx.restore();
			break;
		case 2:
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#000';
			moonctx.fill();
			moonctx.save();
			moonctx.beginPath();
			moonctx.ellipse(centerX, centerY, radius, radius, 0, 0, 2 * Math.PI);
			moonctx.clip();
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, -Math.PI/2, Math.PI/2, false);
			moonctx.fillStyle = '#fdf5e6';
			moonctx.fill();
			moonctx.restore();
			break;
		case 3:
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#000';
			moonctx.fill();
			moonctx.save();
			moonctx.beginPath();
			moonctx.ellipse(centerX + 12, centerY, radius*0.87, radius, 0, 0, 2 * Math.PI);
			moonctx.fillStyle = '#fdf5e6';
			moonctx.fill();
			moonctx.restore();
			break;
		case 4:
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#fdf5e6';
			moonctx.fill();
			moonctx.restore();
			break;
		case 5:
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#000';
			moonctx.fill();
			moonctx.save();
			moonctx.beginPath();
			moonctx.ellipse(centerX - 12, centerY, radius*0.87, radius, 0, 0, 2 * Math.PI);
			moonctx.fillStyle = '#fdf5e6';
			moonctx.fill();
			moonctx.restore();
			break;
		case 6:
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#000';
			moonctx.fill();
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, Math.PI/2, -Math.PI/2, false);
			moonctx.fillStyle = '#fdf5e6';
			moonctx.fill();
			moonctx.restore();
			break;
		case 7:
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#fdf5e6';
			moonctx.fill();
			moonctx.save();
			moonctx.beginPath();
			moonctx.ellipse(centerX + 28, centerY, radius, radius, 0, 0, 2 * Math.PI);
			moonctx.clip();
			moonctx.beginPath();
			moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			moonctx.fillStyle = '#000';
			moonctx.fill();
			moonctx.restore();
			break;
	}

	moonctx.beginPath();
	moonctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
	moonctx.lineWidth = 1;
	moonctx.strokeStyle = '#fdf5e6';
	moonctx.stroke();
}

function updateMoon() {
	const age = getMoonAge();
	const index = getPhaseIndex(age);
	drawPhase(index);

	let illumination = 50 * (1 - Math.cos((2 * Math.PI * age) / 29.53058867));
	if (illumination < 1) illumination = 0;   // Snap New Moon
	if (illumination > 99) illumination = 100; // Snap Full Moon

	const jd = julianDate(baseDate);
	const moonSign = getMoonSign(jd);

	document.getElementById('phase').textContent = `Phase: ${phases[index]}`;
	document.getElementById('age').textContent = `Age: ${age.toFixed(1)} days`;
	document.getElementById('illumination').textContent = `Illumination: ${Math.floor(illumination)}%`;
	document.getElementById('sign').textContent = `Moon Sign: ${moonSign}`;
}

updateMoon();

