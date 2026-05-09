// ==============================
// VIBE FM - Rádio
// ==============================

 const player = new Audio();

let tocando = false;
let pastaAtual = "";
let filaAtual = [];
let idxAtual = 0;
let audioLiberado = false;

// ==============================
// PASTAS
// ==============================

const PASTAS = {

  lofi: {
    arquivos: [
      "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica49_yoxbjc.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115430/musica123_uhyzyp.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115462/musica101_eldtz1.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115427/musica108_d2nkzz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115438/musica20_yim2xd.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115433/musica9_lnnccr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115429/musica118_kmy7iu.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115442/musica56_zxgswj.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115433/musica122_uzfybx.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115430/musica2_r985ip.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115430/musica123_uhyzyp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115427/musica113_qc9hqa.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115434/musica11_x75y6i.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica116_vqpcpf.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115460/musica91_pxbyvh.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115451/musica85_vu8fno.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115431/musica120_q3yssr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115447/musica79_qknod1.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115436/musica22_ioxkds.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115450/musica66_ibpn4p.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115436/musica12_igkfdh.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115458/musica99_juqnfw.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115438/musica23_zuvk5p.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115435/musica13_mumbfk.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica60_whrq1i.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica102_o2f91u.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115434/musica4_aw1vbm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932740/musica29_jy22qr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica97_pacsjm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115452/musica94_jj16yp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115462/musica100_ujiumi.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115453/musica95_aizpxd.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115450/musica87_yjzsre.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115449/musica73_uhmt5d.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115444/musica63_vqcqw8.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica104_orp1za.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115449/musica83_s2dtxb.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica49_yoxbjc.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115439/musica36_nvimic.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115435/musica15_njcaog.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115432/musica5_hnqppl.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115451/musica89_ve0xgz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115446/musica65_yzh0dj.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115434/musica14_u9gq1h.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115441/musica19_adakv0.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115440/musica27_yivplp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115454/musica88_wftkjl.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica117_oo6er0.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica49_yoxbjc.mp3",
    ]
  },

  hitsnoite: {
    arquivos: [
      "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932734/musica10_canhmr.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932771/musica70_slnbr4.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932739/musica24_rehlhm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932776/musica74_j7vyix.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932758/musica55_avwhjt.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932730/musica6_hybjkn.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932774/musica77_x3r74a.mp3",
    
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932768/musica67_leroag.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932749/musica40_wqge80.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932739/musica24_rehlhm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932751/musica41_zde17j.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932750/musica44_o7pxdx.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932746/musica37_w1s4zr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932755/musica51_dxgrm3.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932736/musica17_xioldy.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932726/musica2_v5klda.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932747/musica39_ooiubn.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932740/musica25_ijfrvg.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932757/musica52_qvuodc.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932755/musica48_mirjpq.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932728/musica4_sosrv0.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932726/musica12_lduxli.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932754/musica50_gmm3fv.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932740/musica28_n1vmjz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932763/musica62_b7sy5d.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932759/musica56_okdgsb.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932744/musica32_lgiwrv.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932732/musica16_yvxrbq.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932725/qv65scjsfldixfcjvzf6.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932773/musica73_ldue2a.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932734/musica20_h1f70y.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932731/musica9_e0en3x.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932770/musica64_s2uehd.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932755/musica47_lp6trp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932747/musica35_qe4vix.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932770/musica72_jdya60.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932760/musica49_m4kaqz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932747/musica34_ei1cdg.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932730/musica8_ddcwbe.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932769/musica61_tym5bw.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932766/musica65_vmpnqr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932752/musica38_qiarcc.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932731/musica14_afrfr5.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932760/musica58_nxe7no.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932736/musica22_t5gyl3.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932733/musica18_pf16df.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932775/musica78_xrjftu.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932759/musica54_n416ug.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932752/musica45_jhesn6.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932734/musica19_vcr1cq.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932764/musica60_gghhhr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932766/musica66_i8kbrc.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932760/musica53_wfpgbs.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932765/musica63_m6bpa1.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168688/musica11_gz4g0p.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168680/musica9_zgayef.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168673/musica8_uylvfb.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168664/musica7_h1rieq.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168657/musica6_bfnvp7.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168650/musica5_rgcmma.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168642/musica4_uvflqa.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168635/musica3_rpn0gh.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168628/musica2_e0n25c.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168591/musica56_zzrssq.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168570/musica105_dkivbm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168570/musica51_dkivbm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168564/musica50_heyvpr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168549/musica48_x8txde.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168541/musica47_lyj9ds.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168534/musica46_x4ipvh.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168527/musica45_bjushz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168521/musica44_ov9tdy.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168505/musica41_zeodpr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168498/musica40_nv8onu.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168470/musica34_uj4qqk.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168464/musica32_rz63zi.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168455/musica31_ouir1j.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168449/musica30_elszpz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168441/musica29_wuryjg.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168434/musica28_lw1izl.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168426/musica27_hmaehr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168419/musica26_jjdxv4.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168413/musica25_fnlpgw.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168405/musica24_pdvjxa.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168398/musica23_th1upb.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168385/musica20_mndfpo.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168376/musica18_qk2wrd.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168368/musica17_bwp8xv.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168355/musica15_ptpjuv.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168347/musica14_sbgmhm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168334/musica12_zjpiom.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176977/musica87_cwjl8p.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176958/musica82_slbeoz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176947/musica81_ojx6md.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176927/musica79_joga82.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176909/musica77_tez7pp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176897/musica76_axlz4x.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176887/musica75_jdmni4.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176350/musica63_efmbgv.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176331/musica102_zgfabr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176320/musica101_swd1fd.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176302/musica98_gxfhm3.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174937/musica95_kxhvsy.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174920/musica94_bu2oad.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174908/musica92_dzztgs.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174869/musica89_hysmbk.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778178487/musica222_wtaacz.mp3",
    ]
  },

  fundaovibe: {
    arquivos: [
      "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341199/musica47_ww86hb.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341195/musica45_dmmzrg.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341190/musica44_dj6xun.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341188/musica43_zsfaze.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341184/musica41_tluppn.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341183/musica40_ez6lcv.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341179/musica38_wodvqr.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341176/musica36_owo7gp.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341176/musica35_kkxhrf.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341170/musica32_fad3by.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341170/musica34_fvu7lc.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341165/musica29_yo0p7p.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341164/musica30_tizyll.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341160/musica28_uxolsk.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341159/musica27_piauie.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341155/musica17_v8z0wv.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341152/musica15_hrj00d.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341149/musica13_cuqpfw.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341148/musica10_dfzbde.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341146/musica12_pfc7is.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341144/musica11_m6s1jh.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341138/musica9_dxqqdg.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341136/musica8_neyujt.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341132/musica5_iqjngy.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341129/musica4_dfumqd.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341128/musica99_rmwqlp.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341126/musica109_th3xop.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341124/musica108_weukef.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341119/musica98_zzqnzb.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341116/musica97_ickcvr.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341111/musica95_b6brgq.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341108/musica91_b2rgga.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341107/musica90_yfnkjs.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341106/musica87_fdn5ek.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341100/musica84_ajaxl8.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341097/musica81_q7crt1.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341095/musica80_kreqfa.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341092/musica76_pzpjbm.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341089/musica75_mqed4p.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341085/musica73_nhwgvi.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341083/musica72_qdmyoq.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341080/musica68_rktiop.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341078/musica64_anfxht.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341074/musica63_gynbgb.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341071/musica61_mpckmg.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341069/musica55_r8nbm7.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341065/musica54_r0halu.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341063/musica49_pfdoon.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341062/musica51_ba8utk.mp3",
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778335625/musica87_t0dr5l.mp3",
    ]
  },

  chilldrive: {
    arquivos: [
      "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345961/musica11_ozii3j.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345952/musica6_ppsesg.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345943/musica2_korjuu.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345931/musica1_btgtrk.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345918/musica10_g2wmmy.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345909/musica7_yoorrp.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345907/musica5_lvmmqh.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345904/musica8_tbe4m1.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345887/musica3_n4ft9o.mp3",
    ]
  },

  grove: {
    arquivos: [
      "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329906/musica24_unepzg.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329901/musica9_shx3zx.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329888/musica36_zmhxza.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329878/musica30_dsxonw.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329849/musica1_y6zvwy.mp3",
    ]
  },

  night: {
    arquivos: [
      "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331304/musica19_b896ns.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331301/musica21_g5aruq.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331274/musica5_bgsobh.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331273/musica8_pqoazn.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331272/musica4_lno4ei.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331271/musica7_b2nb1g.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331268/musica23_rzbcmc.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331266/musica3_h9x1qd.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331263/musica1_vztl9k.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331258/musica22_jfd7ek.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331255/musica16_ptvcaa.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331255/musica15_ffa4lr.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331255/musica14_phr43s.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331254/musica17_hbaqxd.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331254/musica18_rseser.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331252/musica9_b58qg0.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331248/musica10_vpmua5.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331249/musica11_re2itx.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331248/musica13_bskgk8.mp3",
    
    ]
  },

  forest: {
    arquivos: [
      "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333154/musica5_uine2m.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333148/musica16_m9p18d.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333109/musica17_c8h8yn.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333050/musica14_gpbgcg.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333035/musica7_ec9k0y.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333030/musica15_x1eijg.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333029/musica6_shea6q.mp3",
    ]
  }

};

// ==============================
// EMBARALHAR
// ==============================

function embaralhar(array) {

  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
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

const day = now.getDay();
const h = now.getHours();

console.log("DIA:", day);
console.log("HORA:", h);


  // =========================================
  // SÁBADO
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
  // DOMINGO
  // =========================================

  if (day === 0) {

  // madrugada continua o evento

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
  // PROGRAMAÇÃO NORMAL
  // =========================================

  const diaUtil = day >= 1 && day <= 5;

  // 00h até 04h
  if (h >= 0 && h < 4) {
    return "lofi";
  }

  // 04h até 06h
  if (h >= 4 && h < 6) {
    return diaUtil ? "chilldrive" : "lofi";
  }

  // 06h até 08h
  if (h >= 6 && h < 8) {
    return "fundaovibe";
  }

  // 08h até 12h
  if (h >= 8 && h < 12) {
    return "hitsnoite";
  }

  // 12h até 17h
  if (h >= 12 && h < 17) {
    return "lofi";
  }

  // 17h até 19h
  if (h >= 17 && h < 19) {
    return diaUtil ? "fundaovibe" : "hitsnoite";
  }

  // 19h até 00h
  return "hitsnoite";
}

// ==============================
// PREPARAR FILA
// ==============================

function prepararFila(nomePasta) {

  const lista = PASTAS[nomePasta]?.arquivos || [];

  return {
    fila: embaralhar(lista),
    indice: 0
  };
}

// ==============================
// TOCAR MÚSICA
// ==============================

async function tocarMusica(src) {

  if (!src) {
    console.warn("Nenhuma música encontrada");
    return;
  }

  player.src = src;

  try {

    await player.play();

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

  const pastaHorario = getPastaInicialPorHorario();

  // troca automática de programação
  if (
    pastaHorario !== pastaAtual ||
    idxAtual >= filaAtual.length
  ) {

    pastaAtual = pastaHorario;

    const prep = prepararFila(pastaAtual);

    filaAtual = prep.fila;

    idxAtual = 0;

    console.log("📻 Mudando programação para:", pastaAtual);
  }

  const musica = filaAtual[idxAtual];

  idxAtual++;

  tocarMusica(musica);
}

// ==============================
// BOTÃO PLAY
// ==============================

async function tocarRadio() {

  const btn = document.getElementById("btnRadio");

  if (tocando) {

    player.pause();

    tocando = false;

    if (btn) {
      btn.innerHTML = "▶ PLAY";
    }

    return;
  }

  if (filaAtual.length === 0) {

    pastaAtual = getPastaInicialPorHorario();

    const prep = prepararFila(pastaAtual);

    filaAtual = prep.fila;

    idxAtual = 0;

    player.onended = () => {

      if (tocando) {
        proximaMusica();
      }
    };

    proximaMusica();

  } else {

    try {

      await player.play();

      tocando = true;

    } catch (e) {

      console.log(e);
    }
  }

  if (btn) {
    btn.innerHTML = "⏸ PAUSAR";
  }
}