/**
 * Sincronização global da rádio via Firebase Realtime Database.
 */

export const VINHETAS = [
  "https://audio.jukehost.co.uk/019f0fd0-a97a-701d-a343-12a965bab062",
  "https://audio.jukehost.co.uk/019f0fd0-a9b3-719b-970a-66edb84cfa50",
];

export const PROGRAMAS = {
  fundaovibe: "🔥 Fundão da Vibe 🔥",
  hitsvibe: "⭐ Hits Vibe ⭐",
  lofi: "🎧 Lo-Fi Vibe 🎧",
  chilldrive: "☕ Chill Vibe ☕",
  grove: "🌀 PSY Vibe 🌀",
  night: "🌙 PSY Vibe 🌙",
  forest: "🌲 PSY Vibe 🌲",
  rootsvibe: "☀️ Reggae Roots ☀️",
  baladavibe: "💫 inVibe 💫",
  frequêncianight: "🎶 Frequência Night 🎶",

 
};

function computeLeader(listeners) {
  const list = Object.entries(listeners || {})
    .filter(([, v]) => v && v.isListening)
    .sort((a, b) => (a[1].joinedAt || 0) - (b[1].joinedAt || 0));
  if (!list.length) return null;
  const [id, data] = list[0];
  return { id, nome: data.nome || "Ouvinte", isAdmin: !!data.isAdmin };
}

/** Painel admin */
export function initAdminRadioSync(db, fb, auth) {
  const { ref, set, onValue, get, onDisconnect } = fb;
  let cmdSeq = 0;
  let vinhetaIdx = 0;
  let lastAdminCmd = -1;
  let unsubscribers = [];
  let adminListenerUid = null;

  const radioAudio = document.getElementById("audio");
  const vinhetaAudio = document.getElementById("admVinhetaAudio");
  const volSlider = document.getElementById("admMusicVolume");

  function cleanup() {
    unsubscribers.forEach((fn) => { try { fn(); } catch (_) {} });
    unsubscribers = [];
  }

  async function publishStateFromEngine() {
    const eng = window.VibeRadioEngine;
    if (!eng) return;
    const st = eng.getSyncState();
    const snap = await get(ref(db, "radioSync/state"));
    const cur = snap.val() || {};
    await set(ref(db, "radioSync/state"), {
      ...cur,
      src: st.src,
      pasta: st.pasta,
      isPlaying: st.isPlaying,
      history: st.history || [],
      seq: (cur.seq || 0) + 1,
      updatedAt: Date.now(),
      updatedBy: "admin"
    });
  }

  async function sendCommand(action) {
    cmdSeq += 1;
    await set(ref(db, "radioSync/command"), {
      action,
      seq: cmdSeq,
      at: Date.now(),
      by: "admin"
    });
    return cmdSeq;
  }

  async function processAdminCommand(cmd) {
    const eng = window.VibeRadioEngine;
    if (!eng || !cmd) return;
    if ((cmd.seq || 0) <= lastAdminCmd) return;
    lastAdminCmd = cmd.seq;

    switch (cmd.action) {
      case "play":
        await eng.playFromSync();
        await setAdminListening(true);
        break;
      case "pause":
        eng.pauseFromSync();
        await setAdminListening(false);
        break;
      case "next":
        await eng.nextFromSync();
        break;
      case "prev":
        await eng.prevFromSync();
        break;
      default:
        return;
    }
    await publishStateFromEngine();
  }

  function updateProgramUI(state) {
    const prog = document.getElementById("admProgramaAtual");
    const arq = document.getElementById("admArquivoAtual");
    if (prog) prog.textContent = PROGRAMAS[state?.pasta] || state?.pasta || "—";
    if (arq) {
      const nome = state?.src ? decodeURIComponent(state.src.split("/").pop().split("?")[0]) : "—";
      arq.textContent = nome;
    }
  }

  async function setAdminListening(listening) {
    if (!adminListenerUid) return;
    await set(ref(db, `radioSync/listeners/${adminListenerUid}/isListening`), !!listening);
  }

  async function registerAdminListener() {
    adminListenerUid = "adm_" + (auth.currentUser?.uid || "panel");
    const listenerRef = ref(db, `radioSync/listeners/${adminListenerUid}`);
    await set(listenerRef, {
      joinedAt: Date.now(),
      nome: "ADM",
      isAdmin: true,
      isListening: false
    });
    onDisconnect(listenerRef).remove();
  }

  function updateLeaderUI(leader) {
    const el = document.getElementById("leaderBadge");
    if (!el) return;
    if (!leader) {
      el.innerHTML = '<span class="leader-none">👑 Sem líder ativo</span>';
      return;
    }
    const icon = leader.isAdmin ? "🎧 ADM" : "👤 Ouvinte";
    el.innerHTML = `<span class="leader-crown">👑</span> Líder: <strong>${leader.nome}</strong> <span class="leader-type">(${icon})</span>`;
  }

  async function start() {
    cleanup();
    await registerAdminListener();

    unsubscribers.push(
      onValue(ref(db, "radioSync/state"), (snap) => {
        updateProgramUI(snap.val());
      })
    );

    unsubscribers.push(
      onValue(ref(db, "radioSync/listeners"), (snap) => {
        updateLeaderUI(computeLeader(snap.val()));
      })
    );

    unsubscribers.push(
      onValue(ref(db, "radioSync/command"), (snap) => {
        const cmd = snap.val();
        if (!cmd || cmd.by !== "admin") return;
        processAdminCommand(cmd);
      })
    );

    unsubscribers.push(
      onValue(ref(db, "radioSync/musicVolume"), (snap) => {
        const vol = snap.val();
        if (typeof vol === "number" && radioAudio) {
          radioAudio.volume = Math.max(0, Math.min(1, vol));
        }
      })
    );

    if (window.VibeRadioEngine) {
      const eng = window.VibeRadioEngine;
      eng.setSyncEnabled(true);
      eng.onTrackEnded = async () => {
        await eng.nextFromSync();
        await publishStateFromEngine();
      };
    }

    if (vinhetaAudio) {
      vinhetaAudio.addEventListener("ended", async () => {
        await set(ref(db, "radioSync/vinheta"), { active: false });
        await set(ref(db, "radioSync/musicVolume"), 1);
        if (radioAudio) radioAudio.volume = 1;
      });
    }
  }

  window.admRadioPlay = async function () {
    // play do ADM deve funcionar sempre (mesmo que ele não seja líder),
    // porque o ouvinte segue via radioSync/state.
    await sendCommand("play");

    // Atualiza estado imediatamente com segurança.
    await publishStateFromEngine().catch(() => {});
  };

  window.admRadioPause = async function () {
    await sendCommand("pause");
  };

  window.admRadioNext = async function () {
    await sendCommand("next");
  };

  window.admRadioPrev = async function () {
    await sendCommand("prev");
  };

  window.admVinhetaPlay = async function () {
    const src = VINHETAS[vinhetaIdx % VINHETAS.length];
    vinhetaIdx += 1;
    const duckVol = volSlider ? parseFloat(volSlider.value) : 0.25;

    await set(ref(db, "radioSync/musicVolume"), duckVol);
    if (radioAudio) radioAudio.volume = duckVol;
    await set(ref(db, "radioSync/vinheta"), { active: true, src, at: Date.now() });

    if (vinhetaAudio) {
      vinhetaAudio.src = src;
      try { await vinhetaAudio.play(); } catch (_) {}
    }
  };

  window.admSetMusicVolume = async function (val) {
    const v = Math.max(0.05, Math.min(1, parseFloat(val) || 1));
    await set(ref(db, "radioSync/musicVolume"), v);
    if (radioAudio) radioAudio.volume = v;
  };

  window.admRestoreMusicVolume = async function () {
    await window.admSetMusicVolume(1);
  };

  return { start, cleanup };
}

/** Site principal — ouvintes */
export function initListenerRadioSync(db, fb, engine) {
  const { ref, set, onValue, get, onDisconnect } = fb;

  const listenerId =
    localStorage.getItem("vibe_uid") ||
    crypto.randomUUID();
  localStorage.setItem("vibe_uid", listenerId);

  let applying = false;
  let lastSeq = -1;
  let lastCmdSeq = -1;
  let isLeader = false;
  let unsubscribers = [];
  let registered = false;

  function cleanup() {
    unsubscribers.forEach((fn) => { try { fn(); } catch (_) {} });
    unsubscribers = [];
  }

  function getNome() {
    return localStorage.getItem("vibe_nome") || ("Visitante-" + Math.floor(Math.random() * 9999));
  }

  async function registerListener(listening) {
    const listenerRef = ref(db, `radioSync/listeners/${listenerId}`);
    const snap = await get(listenerRef);
    const joinedAt = snap.val()?.joinedAt || Date.now();
    await set(listenerRef, {
      joinedAt,
      nome: getNome(),
      isAdmin: false,
      isListening: !!listening
    });
    onDisconnect(listenerRef).remove();
    registered = true;
  }

  async function setListening(listening) {
    if (!registered) await registerListener(listening);
    else await set(ref(db, `radioSync/listeners/${listenerId}/isListening`), !!listening);
  }

  async function publishLocalState() {
    const st = engine.getSyncState();
    const snap = await get(ref(db, "radioSync/state"));
    const cur = snap.val() || {};
    await set(ref(db, "radioSync/state"), {
      ...cur,
      src: st.src,
      pasta: st.pasta,
      isPlaying: st.isPlaying,
      history: st.history || [],
      seq: (cur.seq || 0) + 1,
      updatedAt: Date.now(),
      updatedBy: listenerId
    });
  }

  async function applyRemoteState(state) {
    if (!state || applying) return;
    if ((state.seq || 0) === lastSeq) return;
    lastSeq = state.seq || 0;
    applying = true;
    try {
      await engine.applyRemoteState(state);
    } finally {
      applying = false;
    }
  }

  async function handleCommand(cmd) {
    if (!cmd || (cmd.seq || 0) <= lastCmdSeq) return;
    lastCmdSeq = cmd.seq;

    if (cmd.action === "play") {
      await engine.playFromSync();
      await setListening(true);
      return;
    }
    if (cmd.action === "pause") {
      engine.pauseFromSync();
      await setListening(false);
    }
    // next/prev: processados no painel ADM → state atualizado → ouvintes seguem via radioSync/state
  }

  async function start() {
    cleanup();
    engine.setSyncEnabled(true);

    engine.onTrackEnded = async () => {
      if (!isLeader) return;
      await engine.nextFromSync();
      await publishLocalState();
    };

    engine.onStartedListening = async () => {
      await registerListener(true);
      const snap = await get(ref(db, "radioSync/state"));
      const state = snap.val();
      if (state && state.src) {
        await applyRemoteState(state);
        if (!state.isPlaying) await engine.playFromSync();
      } else {
        isLeader = true;
        engine.setIsLeader(true);
        await engine.playFromSync();
        await publishLocalState();
      }
    };

    engine.onStoppedListening = async () => {
      await setListening(false);
    };

    unsubscribers.push(onValue(ref(db, "radioSync/state"), (snap) => {
      applyRemoteState(snap.val());
    }));

    unsubscribers.push(onValue(ref(db, "radioSync/command"), (snap) => {
      handleCommand(snap.val());
    }));

    unsubscribers.push(onValue(ref(db, "radioSync/listeners"), (snap) => {
      const leader = computeLeader(snap.val());
      isLeader = leader?.id === listenerId;
      engine.setIsLeader(isLeader);
    }));

    unsubscribers.push(onValue(ref(db, "radioSync/musicVolume"), (snap) => {
      const vol = snap.val();
      if (typeof vol === "number") engine.setMusicVolume(vol);
    }));

    unsubscribers.push(onValue(ref(db, "radioSync/vinheta"), (snap) => {
      engine.playVinheta(snap.val());
    }));
  }

  return { start, cleanup, listenerId };
}
