// VIBE FM - Rádio
// ==============================

// Usar apenas o <audio id="audio"> do HTML (evita conflito de 2 players)
let playerEl;

window.addEventListener("DOMContentLoaded", () => {
  playerEl = document.getElementById("audio");
});

let tocando = false;
let pastaAtual = "";
let filaAtual = [];
let idxAtual = 0;
let audioLiberado = false;

// ==============================
// STREAM CENTRAL (Worker)
// ==============================

const STREAM_STATE_URL = "https://radio-sync.vibefmbr.workers.dev/now";

async function syncFromServer({ forcePlay = false } = {}) {
  if (!playerEl) return;

  const res = await fetch(STREAM_STATE_URL, { cache: "no-store" });
  const data = await res.json();
  if (!data || !data.track) return;

  // troca track se mudou
  if (playerEl.dataset.track !== data.track) {
    playerEl.dataset.track = data.track;
    playerEl.src = data.track;
  }

  // tenta manter mesma posição
  const offsetSec = Math.max(0, (Date.now() - data.startedAt) / 1000);

  if (forcePlay) {
    try { await playerEl.play(); } catch (e) {}
  }

  // currentTime pode falhar em alguns browsers; mesmo assim tentamos
  try {
    if (!Number.isNaN(playerEl.duration) && playerEl.duration > 0) {
      playerEl.currentTime = offsetSec % playerEl.duration;
    } else {
      playerEl.currentTime = offsetSec;
    }
  } catch (e) {}
}

let streamStarted = false;

function startStreamLoop() {
  if (streamStarted) return;
  streamStarted = true;

  // sincroniza já e depois em intervalos
  syncFromServer({ forcePlay: true });
  setInterval(() => syncFromServer(), 10000);
}

// ==============================
// (mantém PASTAS locais para fallback)
// ==============================

const PASTAS = {


  lofi: {
    arquivos: [
    {
      url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",
      duration: 320
    },
    {
     url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",
        duration: 240
    },
    {
      url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica49_yoxbjc.mp3",
      duration: 300
    },
    {
      url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115430/musica123_uhyzyp.mp3",
      duration: 220
    },
    {
      url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115462/musica101_eldtz1.mp3",
      duration: 260
    },
    {
      url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287784/musica1565_f7wcsy.mp3",
      duration: 300
    },
    {
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115427/musica108_d2nkzz.mp3",
  duration: 240
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115427/musica108_d2nkzz.mp3",
  duration: 240
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287770/musica1554_on2ugf.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115438/musica20_yim2xd.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287758/musica1547_h4ueip.mp3",
  duration: 240
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115433/musica9_lnnccr.mp3",
  duration: 240
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287756/musica1538_kfmrtu.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115429/musica118_kmy7iu.mp3",
  duration: 200
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115442/musica56_zxgswj.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115433/musica122_uzfybx.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115430/musica2_r985ip.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115430/musica123_uhyzyp.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115427/musica113_qc9hqa.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115434/musica11_x75y6i.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica116_vqpcpf.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115460/musica91_pxbyvh.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115451/musica85_vu8fno.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115431/musica120_q3yssr.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115447/musica79_qknod1.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115436/musica22_ioxkds.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115450/musica66_ibpn4p.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115436/musica12_igkfdh.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115458/musica99_juqnfw.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115438/musica23_zuvk5p.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115435/musica13_mumbfk.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica60_whrq1i.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica102_o2f91u.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115434/musica4_aw1vbm.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932740/musica29_jy22qr.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica97_pacsjm.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115452/musica94_jj16yp.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115462/musica100_ujiumi.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115453/musica95_aizpxd.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115450/musica87_yjzsre.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115449/musica73_uhmt5d.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115444/musica63_vqcqw8.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica104_orp1za.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115449/musica83_s2dtxb.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica49_yoxbjc.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115439/musica36_nvimic.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115435/musica15_njcaog.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica49_yoxbjc.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica117_oo6er0.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115454/musica88_wftkjl.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115440/musica27_yivplp.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115441/musica19_adakv0.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115434/musica14_u9gq1h.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115446/musica65_yzh0dj.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115451/musica89_ve0xgz.mp3",
  duration: 300
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115432/musica5_hnqppl.mp3",
  duration: 300
},

    ]
  },

  hitsvibe: {
    arquivos: [
      {
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932734/musica10_canhmr.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932771/musica70_slnbr4.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932739/musica24_rehlhm.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778886665/musica1113_zbztuf.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287765/musica1552_y0hf3x.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932776/musica74_j7vyix.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287763/musica1551_lbv33u.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932758/musica55_avwhjt.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778886663/musica1115_ycfwhl.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778886662/musica1116_zppj89.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778886662/musica1101_oovujo.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778886662/musica1112_z2fmni.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778886654/musica1114_tpik4f.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287763/musica1555_bmfnsr.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932730/musica6_hybjkn.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287761/musica1549_iy0qvr.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932774/musica77_x3r74a.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287760/musica1550_gv1m2w.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932768/musica67_leroag.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287758/musica1545_tff1cp.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932749/musica40_wqge80.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287758/musica1543_ezkc8j.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932739/musica24_rehlhm.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287757/musica1546_i3ikz5.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932751/musica41_zde17j.mp3",
  duration: 333
},
 
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287752/musica1540_rjcv9v.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932750/musica44_o7pxdx.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287751/musica1541_hx2d78.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932746/musica37_w1s4zr.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287751/musica1542_cqpd27.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287749/musica1537_ahl9tn.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932736/musica17_xioldy.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287746/musica1534_phcsxj.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932726/musica2_v5klda.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287746/musica1536_r9q5yf.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932747/musica39_ooiubn.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287735/musica1526_zllyrz.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932740/musica25_ijfrvg.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287733/musica1528_hon2q9.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932757/musica52_qvuodc.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287730/musica1525_ilqhhh.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932755/musica48_mirjpq.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287730/musica1527_a90jyl.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932728/musica4_sosrv0.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287730/musica1524_c6mcy1.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932726/musica12_lduxli.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287728/musica1519_gwgnws.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932754/musica50_gmm3fv.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287728/musica1523_a8clmj.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932740/musica28_n1vmjz.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287724/musica1518_g4is1o.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932763/musica62_b7sy5d.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287721/musica1516_ezkt6y.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932759/musica56_okdgsb.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287722/musica1517_fibjr7.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932744/musica32_lgiwrv.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287720/musica1512_s3qxsi.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932732/musica16_yvxrbq.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287719/musica1514_bgvmxy.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932725/qv65scjsfldixfcjvzf6.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932773/musica73_ldue2a.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287718/musica1513_xgofed.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932734/musica20_h1f70y.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287714/musica1567_dfngaz.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932731/musica9_e0en3x.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287708/musica1561_mfpuxm.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932770/musica64_s2uehd.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287708/musica1566_fazscl.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932755/musica47_lp6trp.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287707/musica1506_muf1jb.mp3",
  duration: 333
},

{
  url:    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932747/musica35_qe4vix.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287707/musica1562_xiagfd.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932770/musica72_jdya60.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287705/musica1563_vtohu6.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932760/musica49_m4kaqz.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287701/musica1560_lmi6or.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932747/musica34_ei1cdg.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287701/musica1504_ijsvq8.mp3",
  duration: 333
},

{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932730/musica8_ddcwbe.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287700/musica1502_bwpwpv.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932769/musica61_tym5bw.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287699/musica1503_j4afex.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932766/musica65_vmpnqr.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779290225/musica1599_jepto7.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932752/musica38_qiarcc.mp3",
  duration: 333
},
 
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932731/musica14_afrfr5.mp3",
  duration: 333
},
 
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932760/musica58_nxe7no.mp3",
  duration: 333
},
 
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932736/musica22_t5gyl3.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932733/musica18_pf16df.mp3",
  duration: 333
},
 {
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932775/musica78_xrjftu.mp3",
  duration: 333
},
 
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932759/musica54_n416ug.mp3",
  duration: 333
},
 {
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932752/musica45_jhesn6.mp3",
  duration: 333
},
 
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932734/musica19_vcr1cq.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932764/musica60_gghhhr.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932766/musica66_i8kbrc.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932760/musica53_wfpgbs.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932765/musica63_m6bpa1.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168688/musica11_gz4g0p.mp3",
  duration: 333
},
{
  url:"https://res.cloudinary.com/dmodpbtae/video/upload/v1778168680/musica9_zgayef.mp3",
  duration: 333
},
{
  url:"https://res.cloudinary.com/dmodpbtae/video/upload/v1778168673/musica8_uylvfb.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168664/musica7_h1rieq.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168657/musica6_bfnvp7.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168650/musica5_rgcmma.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168642/musica4_uvflqa.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168635/musica3_rpn0gh.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168628/musica2_e0n25c.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168591/musica56_zzrssq.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168570/musica51_dkivbm.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168564/musica50_heyvpr.mp3",
  duration: 333
},
{
  url:"https://res.cloudinary.com/dmodpbtae/video/upload/v1778168549/musica48_x8txde.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168541/musica47_lyj9ds.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168534/musica46_x4ipvh.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168527/musica45_bjushz.mp3",
  duration: 333
},
{
  url:"https://res.cloudinary.com/dmodpbtae/video/upload/v1778168521/musica44_ov9tdy.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168505/musica41_zeodpr.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168498/musica40_nv8onu.mp3",

  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168470/musica34_uj4qqk.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168464/musica32_rz63zi.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168455/musica31_ouir1j.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168449/musica30_elszpz.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168441/musica29_wuryjg.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168434/musica28_lw1izl.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168426/musica27_hmaehr.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168419/musica26_jjdxv4.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168413/musica25_fnlpgw.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168405/musica24_pdvjxa.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168398/musica23_th1upb.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168385/musica20_mndfpo.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168376/musica18_qk2wrd.mp3",

  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168368/musica17_bwp8xv.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168355/musica15_ptpjuv.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168347/musica14_sbgmhm.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168334/musica12_zjpiom.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176977/musica87_cwjl8p.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176958/musica82_slbeoz.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176947/musica81_ojx6md.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176927/musica79_joga82.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176909/musica77_tez7pp.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176897/musica76_axlz4x.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176887/musica75_jdmni4.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176350/musica63_efmbgv.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176331/musica102_zgfabr.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176320/musica101_swd1fd.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176302/musica98_gxfhm3.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174937/musica95_kxhvsy.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174920/musica94_bu2oad.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174908/musica92_dzztgs.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174869/musica89_hysmbk.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778178487/musica222_wtaacz.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287726/musica1515_qu9wlm.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287725/musica1520_wnf1n7.mp3",
  duration: 333
},

    
    ]
  },

  fundaovibe: {
    arquivos: [      
   {
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341199/musica47_ww86hb.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341195/musica45_dmmzrg.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341190/musica44_dj6xun.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341188/musica43_zsfaze.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341184/musica41_tluppn.mp3",
  duration: 333
},
{
  url:"https://res.cloudinary.com/dmodpbtae/video/upload/v1778341183/musica40_ez6lcv.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341179/musica38_wodvqr.mp3",
  duration: 333
},
{
  url:"https://res.cloudinary.com/dmodpbtae/video/upload/v1778341176/musica36_owo7gp.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341176/musica35_kkxhrf.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341170/musica32_fad3by.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341152/musica15_hrj00d.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341149/musica13_cuqpfw.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341148/musica10_dfzbde.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341144/musica11_m6s1jh.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341138/musica9_dxqqdg.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341136/musica8_neyujt.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341132/musica5_iqjngy.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341129/musica4_dfumqd.mp3",
  duration: 333
},
{
  url:    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341126/musica109_th3xop.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341124/musica108_weukef.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341119/musica98_zzqnzb.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341170/musica34_fvu7lc.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341165/musica29_yo0p7p.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341164/musica30_tizyll.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341160/musica28_uxolsk.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341159/musica27_piauie.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341155/musica17_v8z0wv.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341116/musica97_ickcvr.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341111/musica95_b6brgq.mp3",
  duration: 333
},
{
  url:    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341108/musica91_b2rgga.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341107/musica90_yfnkjs.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341106/musica87_fdn5ek.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341100/musica84_ajaxl8.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341097/musica81_q7crt1.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341095/musica80_kreqfa.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341092/musica76_pzpjbm.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341085/musica73_nhwgvi.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341083/musica72_qdmyoq.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341080/musica68_rktiop.mp3",
  duration: 333
},
{
  url:    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341078/musica64_anfxht.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341074/musica63_gynbgb.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341071/musica61_mpckmg.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341069/musica55_r8nbm7.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341065/musica54_r0halu.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341063/musica49_pfdoon.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341062/musica51_ba8utk.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1778335625/musica87_t0dr5l.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287770/musica1558_q6kh0n.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287768/musica1559_ifo3gv.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287768/musica1557_c17ll6.mp3",
  duration: 333
},
{
  url:  "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287764/v1556_etddmz.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287756/musica1544_zc3bgl.mp3",
  duration: 333
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1779287712/musica1507_sf1oir.mp3",
  duration: 333
},


    ]
  },

  chilldrive: {
    arquivos: [
      {
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345961/musica11_ozii3j.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345952/musica6_ppsesg.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345943/musica2_korjuu.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345931/musica1_btgtrk.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345918/musica10_g2wmmy.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345909/musica7_yoorrp.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345907/musica5_lvmmqh.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345904/musica8_tbe4m1.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345887/musica3_n4ft9o.mp3",
  duration: 3800
},
    
   

    ]
  },

  grove: {
    arquivos: [
      {
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329906/musica24_unepzg.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329906/musica24_unepzg.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329901/musica9_shx3zx.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329888/musica36_zmhxza.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329878/musica30_dsxonw.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329849/musica1_y6zvwy.mp3",
  duration: 420
},
      
    
    
    
   
    ]
  },

  night: {
    arquivos: [
      {
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331304/musica19_b896ns.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331301/musica21_g5aruq.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331301/musica21_g5aruq.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331274/musica5_bgsobh.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331273/musica8_pqoazn.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331272/musica4_lno4ei.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331271/musica7_b2nb1g.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331271/musica7_b2nb1g.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331268/musica23_rzbcmc.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331266/musica3_h9x1qd.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331263/musica1_vztl9k.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331258/musica22_jfd7ek.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331255/musica16_ptvcaa.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331255/musica15_ffa4lr.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331255/musica14_phr43s.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331254/musica17_hbaqxd.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331254/musica18_rseser.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331252/musica9_b58qg0.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331248/musica10_vpmua5.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331249/musica11_re2itx.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331248/musica13_bskgk8.mp3",
  duration: 480
},
      

    
   ]
  },

  forest: {
    arquivos: [
      {
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333154/musica5_uine2m.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333148/musica16_m9p18d.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333029/musica6_shea6q.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333030/musica15_x1eijg.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333035/musica7_ec9k0y.mp3",
  duration: 3800
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333109/musica17_c8h8yn.mp3",
  duration: 480
},
{
  url: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333050/musica14_gpbgcg.mp3",
  duration: 3800
},
    
    
    ]
  }

};

// ==============================
// ALEATORIEDADE SINCRONIZADA (determinística mas “embaralhada”)
// ==============================
// Mantém a mesma sequência para todos (sem Math.random), mas a ordem dentro da pasta
// não fica na ordem do array.

// FNV-1a 32-bit
function hashStringToInt(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

// Mulberry32 PRNG determinístico (gera “aleatoriedade” igual em todos)
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleDeterministico(array, seed) {
  const arr = array.slice();
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getFaseKey() {
  // Usamos (pasta + data/hora) no timezone da rádio para manter sincronização por faixa/horário.
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Belem" })
  );
  // chave por hora (ajuste se quiser granulação diferente)
  return `${now.getDay()}-${now.getHours()}-${now.getDate()}`;
}

function pickAleatorioSemRepeticao(pasta, arquivos, indexGlobal) {
  const n = arquivos.length;
  if (n === 0) return null;
  if (n === 1) return arquivos[0];

  // embaralha uma vez por “fase de horário” e pega o indexGlobal na ordem embaralhada.
  const faseKey = getFaseKey();
  const seed = hashStringToInt(`${pasta}|${faseKey}`);
  const filaEmbaralhada = shuffleDeterministico(arquivos, seed);

  return filaEmbaralhada[indexGlobal % n];
}


// ==============================
// PROGRAMADOR AUTOMÁTICO
// ==============================

function getPastaInicialPorHorario() {
  const now = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Belem"
    })
  );

  const day = now.getDay(); // 0=Dom, 6=Sáb
  const h = now.getHours();

  // =========================================
  // SÁBADO (mantém como está)
  // =========================================
  if (day === 6) {
    // 18h até 21h
    if (h >= 18 && h < 21) {
      return "grove";
    }

    // 21h até 23:59
    if (h >= 21 && h <= 23) {
      return "night";
    }
  }

  // =========================================
  // DOMINGO (00h até 06h mantêm como está)
  // =========================================
  if (day === 0) {
    // 00h até 05h = forest
    if (h >= 0 && h < 5) {
      return "forest";
    }

    // 05h até 06h = grove
    if (h >= 5 && h < 6) {
      return "grove";
    }
  }

  // =========================================
  // SEG-SEX e DOM (após 06h): grade nova
  // =========================================
  // 02h até 04h
  if (h >= 2 && h < 4) {
    return "lofi";
  }

  // 04h até 06h
  if (h >= 4 && h < 6) {
    return "chilldrive";
  }

  // 06h até 09h
  if (h >= 6 && h < 9) {
    return "fundaovibe";
  }

  // 09h até 12h
  if (h >= 9 && h < 12) {
    return "hitsvibe";
  }

  // 12h até 14h
  if (h >= 12 && h < 14) {
    return "lofi";
  }

  // 14h até 17h
  if (h >= 14 && h < 17) {
    return "hitsvibe";
  }

  // 17h até 19h
  if (h >= 17 && h < 19) {
    return "fundaovibe";
  }
  
  // 19h até 02h
  // 19h-24h => hitsvibe
  // 00h-02h => hitsvibe
  if (h >= 19 || h < 2) {
    return "hitsvibe";
  }

  // se não entrou em nenhum bloco acima, é 02h-04h => lofi
  // (demais regras já cobrem o resto do dia)
  return "lofi";
}

// ==============================
// ESTADO DA RÁDIO (por fase)
// ==============================
let indexMusicaNaFase = 0; // incrementa quando uma música termina

function getArquivosDaPasta(nomePasta) {
  return PASTAS[nomePasta]?.arquivos || [];
}

function getMusicaSrc(musica) {
  // compat: aceita string (legacy) ou objeto {url, duration}
  if (typeof musica === 'string') return musica;
  return musica?.url || null;
}


function avancarParaNovaFaseSePreciso() {
  const fase = getPastaInicialPorHorario();
  if (fase !== pastaAtual) {
    pastaAtual = fase;
    indexMusicaNaFase = 0; // reseta “deck” ao mudar fase/horário
    return true;
  }
  return false;
}

// ==============================
// TOCAR MÚSICA
// ==============================

async function tocarMusica(src) {
  if (!src) {
    console.warn("Nenhuma música encontrada");
    return;
  }
  if (!playerEl) return;

  playerEl.src = src;

  try {
    await playerEl.play();
    tocando = true;
    console.log("🎵 Tocando:", pastaAtual);
  } catch (e) {
    console.log("Erro ao tocar:", e);
    tocando = false;
  }
}

// ==============================
// PRÓXIMA MÚSICA
// ==============================

function proximaMusica() {

  // fase atual pelo horário
  const pastaHorario = getPastaInicialPorHorario();
  if (pastaHorario !== pastaAtual) {
    pastaAtual = pastaHorario;
    indexMusicaNaFase = 0;
    console.log("📅 Mudando programação para:", pastaAtual);
  }

  const arquivos = getArquivosDaPasta(pastaAtual);
  if (!arquivos.length) return;

  // escolha determinística para todos (sem embaralhar por dispositivo)
  const musica = pickAleatorioSemRepeticao(pastaAtual, arquivos, indexMusicaNaFase);
  indexMusicaNaFase++;

  tocarMusica(getMusicaSrc(musica));
}

// ==============================
// BOTÃO PLAY
// ==============================

async function tocarRadio() {

  const btn = document.getElementById("btnRadio");
  const bars = document.querySelectorAll(".bar");

  function setEqualizerState(running) {
    const box = document.getElementById('equalizerBox');
    if (box) box.classList.toggle('is-playing', running);

    bars.forEach(b => {
      b.style.animationPlayState = running ? "running" : "paused";
    });
  }

  // Alterna PAUSE/PLAY
  if (tocando) {
    playerEl.pause();
    tocando = false;
    setEqualizerState(false);
    if (btn) btn.innerHTML = "▶ OUVIR AGORA";
    return;
  }

  // Começa
  setEqualizerState(true);

  pastaAtual = getPastaInicialPorHorario();
  indexMusicaNaFase = 0;

  // troca botão para PAUSE
  if (btn) btn.innerHTML = "⏸ PARAR";

 startStreamLoop();// define src e chama play na tocarMusica()
}

// ==============================
// EVENTOS DO ÁUDIO
// ==============================

function setupAudioEvents() {
  if (!playerEl) return;

  playerEl.addEventListener("ended", () => {
    if (tocando) startStreamLoop();
  });

  playerEl.addEventListener("error", () => {
    console.log("⚠️ Erro na música, pulando para próxima...");
    setTimeout(() => proximaMusica(), 1000);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupAudioEvents();
});
