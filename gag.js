class PembagiTanaman {
  constructor(targetMin = 10, targetMax = 11) {
    this.targetMin = targetMin;
    this.targetMax = targetMax;
    this.targetIdeal = (targetMin + targetMax) / 2;
  }
  bagi(beratTanaman) {
    const validBerat = beratTanaman.filter(
      (berat) => typeof berat === "number" && berat > 0
    );
    const tanamanDenganIndex = validBerat.map((berat, index) => ({
      berat: berat,
      index: index + 1,
      urutan: index + 1,
    }));
    const strategi1 = this.strategiGreedy(tanamanDenganIndex);
    const strategi2 = this.strategiOptimal(tanamanDenganIndex);
    const strategi3 = this.strategiMinimalHoneyCombpressor(tanamanDenganIndex);

    const strategiTerbaik = this.pilihStrategiTerbaik([
      { nama: "Greedy", hasil: strategi1 },
      { nama: "Optimal", hasil: strategi2 },
      { nama: "Minimal HoneyCombpressor", hasil: strategi3 },
    ]);
    this.tampilkanHasil(strategiTerbaik);
    return {
      input: {
        beratTanaman: validBerat,
        jumlahTanaman: validBerat.length,
        totalBerat: validBerat.reduce((a, b) => a + b, 0),
      },
      target: {
        minimum: this.targetMin,
        maksimum: this.targetMax,
        ideal: this.targetIdeal,
      },
      hasil: strategiTerbaik.hasil,
      statistik: this.hitungStatistik(strategiTerbaik.hasil),
      strategiTerpilih: strategiTerbaik.nama,
    };
  }
  strategiGreedy(tanamanArray) {
    const honeycombpressor = [];
    const tanamanSisa = [...tanamanArray];
    while (tanamanSisa.length > 0) {
      const honeycombpressorBaru = [];
      let beratHoneyCombpressor = 0;
      tanamanSisa.sort((a, b) => b.berat - a.berat);
      if (tanamanSisa.length > 0) {
        honeycombpressorBaru.push(tanamanSisa[0]);
        beratHoneyCombpressor = tanamanSisa[0].berat;
        tanamanSisa.splice(0, 1);
      }
      let found = true;
      while (found && tanamanSisa.length > 0) {
        found = false;
        let bestIndex = -1;
        let bestScore = -1;
        for (let i = 0; i < tanamanSisa.length; i++) {
          const beratBaru = beratHoneyCombpressor + tanamanSisa[i].berat;
          if (beratBaru <= this.targetMax) {
            let score = 0;
            if (beratBaru >= this.targetMin && beratBaru <= this.targetMax) {
              score = 1000 - Math.abs(beratBaru - this.targetIdeal);
            } else {
              score = beratBaru;
            }
            if (score > bestScore) {
              bestScore = score;
              bestIndex = i;
            }
          }
        }
        if (bestIndex >= 0) {
          honeycombpressorBaru.push(tanamanSisa[bestIndex]);
          beratHoneyCombpressor += tanamanSisa[bestIndex].berat;
          tanamanSisa.splice(bestIndex, 1);
          found = true;
        }
      }
      honeycombpressor.push({
        tanaman: honeycombpressorBaru,
        totalBerat: beratHoneyCombpressor,
      });
    }
    return honeycombpressor;
  }
  strategiOptimal(tanamanArray) {
    const totalBerat = tanamanArray.reduce(
      (sum, tanaman) => sum + tanaman.berat,
      0
    );
    const targetHoneyCombpressor = Math.round(totalBerat / this.targetIdeal);
    const honeycombpressor = [];
    const tanamanSisa = [...tanamanArray].sort((a, b) => b.berat - a.barat);
    for (let i = 0; i < targetHoneyCombpressor; i++) {
      honeycombpressor.push({ tanaman: [], totalBerat: 0 });
    }
    tanamanSisa.forEach((tanaman) => {
      let targetHoneyCombpressorIdx = -1;
      let minBerat = Infinity;
      for (let i = 0; i < honeycombpressor.length; i++) {
        const beratBaru = honeycombpressor[i].totalBerat + tanaman.berat;
        if (
          beratBaru <= this.targetMax &&
          honeycombpressor[i].totalBerat < minBerat
        ) {
          minBerat = honeycombpressor[i].totalBerat;
          targetHoneyCombpressorIdx = i;
        }
      }
      if (targetHoneyCombpressorIdx === -1) {
        targetHoneyCombpressorIdx = 0;
        for (let i = 1; i < honeycombpressor.length; i++) {
          if (
            honeycombpressor[i].totalBerat <
            honeycombpressor[targetHoneyCombpressorIdx].totalBerat
          ) {
            targetHoneyCombpressorIdx = i;
          }
        }
      }
      honeycombpressor[targetHoneyCombpressorIdx].tanaman.push(tanaman);
      honeycombpressor[targetHoneyCombpressorIdx].totalBerat += tanaman.berat;
    });
    return honeycombpressor.filter((k) => k.tanaman.length > 0);
  }
  strategiMinimalHoneyCombpressor(tanamanArray) {
    const honeycombpressor = [];
    const tanamanSisa = [...tanamanArray].sort((a, b) => b.berat - a.berat);
    while (tanamanSisa.length > 0) {
      const honeycombpressorBaru = [];
      let beratHoneyCombpressor = 0;
      let i = 0;
      while (i < tanamanSisa.length) {
        if (beratHoneyCombpressor + tanamanSisa[i].berat <= this.targetMax) {
          honeycombpressorBaru.push(tanamanSisa[i]);
          beratHoneyCombpressor += tanamanSisa[i].berat;
          tanamanSisa.splice(i, 1);
        } else {
          i++;
        }
      }
      if (honeycombpressorBaru.length === 0 && tanamanSisa.length > 0) {
        honeycombpressorBaru.push(tanamanSisa[0]);
        beratHoneyCombpressor = tanamanSisa[0].berat;
        tanamanSisa.splice(0, 1);
      }
      if (honeycombpressorBaru.length > 0) {
        honeycombpressor.push({
          tanaman: honeycombpressorBaru,
          totalBerat: beratHoneyCombpressor,
        });
      }
    }
    return honeycombpressor;
  }
  pilihStrategiTerbaik(daftarStrategi) {
    let strategiTerbaik = daftarStrategi[0];
    let scoreTerbaik = this.hitungScore(strategiTerbaik.hasil);
    for (let i = 1; i < daftarStrategi.length; i++) {
      const score = this.hitungScore(daftarStrategi[i].hasil);
      if (score > scoreTerbaik) {
        scoreTerbaik = score;
        strategiTerbaik = daftarStrategi[i];
      }
    }
    return strategiTerbaik;
  }
  hitungScore(honeycombpressor) {
    let score = 0;
    honeycombpressor.forEach((k) => {
      if (k.totalBerat >= this.targetMin && k.totalBerat <= this.targetMax) {
        score += 100;
        score += 10 - Math.abs(k.totalBerat - this.targetIdeal);
      } else if (k.totalBerat >= this.targetMin * 0.9) {
        score += 50 - Math.abs(k.totalBerat - this.targetMin);
      }
    });
    score -= honeycombpressor.length * 5;
    return score;
  }
  hitungStatistik(honeycombpressor) {
    const sesuaiTarget = honeycombpressor.filter(
      (k) => k.totalBerat >= this.targetMin && k.totalBerat <= this.targetMax
    ).length;
    const mendekatiTarget = honeycombpressor.filter(
      (k) =>
        k.totalBerat >= this.targetMin * 0.9 && k.totalBerat < this.targetMin
    ).length;
    const totalBerat = honeycombpressor.reduce(
      (sum, k) => sum + k.totalBerat,
      0
    );
    const efisiensi =
      ((sesuaiTarget + mendekatiTarget * 0.5) / honeycombpressor.length) * 100;
    return {
      jumlahHoneyCombpressor: honeycombpressor.length,
      sesuaiTarget,
      mendekatiTarget,
      totalBerat: totalBerat.toFixed(2),
      efisiensi: efisiensi.toFixed(1) + "%",
    };
  }
  tampilkanHasil(strategiTerpilih) {
    strategiTerpilih.hasil.forEach((honeycombpressor, index) => {
      console.log(`\nHoney Combpressor ${index + 1}:`);
      honeycombpressor.tanaman.forEach((tanaman) => {
        console.log(`  - Tanaman ${tanaman.berat} kg`);
      });
      console.log(`  Total: ${honeycombpressor.totalBerat.toFixed(2)} kg`);
    });
    const stats = this.hitungStatistik(strategiTerpilih.hasil);
  }
}

const pembagi = new PembagiTanaman(10, 11);
const beratTanamanContoh = [
  1.86, 1.73, 1.66, 1.49, 1.77, 1.76, 1.48, 4.69, 4.54,
];
const hasil = pembagi.bagi(beratTanamanContoh);
function bagiTanamanCepat(beratTanaman, targetMin = 10, targetMax = 11) {
  const pembagi = new PembagiTanaman(targetMin, targetMax);
  return pembagi.bagi(beratTanaman);
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PembagiTanaman, bagiTanamanCepat };
}
