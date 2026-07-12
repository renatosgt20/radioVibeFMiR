// VIBE FM - Rádio
// ==============================

// Usar apenas o <audio id="audio"> do HTML (evita conflito de 2 players)
// Obter diretamente para garantir que esteja disponível
let playerEl = document.getElementById("audio");

let tocando = false;
let pastaAtual = "";
let filaAtual = [];
let idxAtual = 0;
let audioLiberado = false;

// anti-repetição imediata (evita ended escolher a mesma faixa)
let ultimaMusicaSrc = null;
let proximoPending = false;

// ==============================
// VINHETAS (tocar 1x antes da primeira música ao trocar programação)
// ==============================
let vinhetaPendente = false; // setado quando a programação/pasta muda fora do período PSY

// ==============================
// VINHETA VIBEZONEFM A CADA 1H (somente entre músicas)
// ==============================
let ultimaVinhetaHoraTs = 0; // timestamp (ms) da última vinheta executada
let ultimaVinhetaHoraPasta = ""; // evita disparos em troca de pasta (mantém contagem por “programa ativo”)





// ==============================
// LOCKS/FLAGS anti-concorrência (evita AbortError, play/pause simultâneos e loops)
// ==============================
let playPending = false;        // existe um playerEl.play() pendente (await em andamento)
let pauseRequested = false;    // pedido de pause enquanto playPending estiver true
let lastPlayToken = 0;         // identifica a última tentativa de play (evita corrida)
let clickDebounceTimer = 0;    // debounce do clique no botão
let playClickLocked = false;   // bloqueio de clique duplo
let audioErrorPending = false; // evita múltiplos handlers de error disparando proximaMusica em loop
let connectionRecoveryTimer = null;


// ==============================
// PASTAS
// ==============================

const PASTAS = {

  vibezonefm: {
    arquivos: [
    "https://audio.jukehost.co.uk/019f0fd0-a97a-701d-a343-12a965bab062",
    "https://audio.jukehost.co.uk/019f0fd0-a9b3-719b-970a-66edb84cfa50",

    ]
  },

    frequêncianight: {
    arquivos: [
    "https://audio.jukehost.co.uk/019f494f-d8b3-725e-b0bd-1020ec0d3cf9",
 
    ]
  },

  rootsvibe: {
    arquivos: [
    "https://audio.jukehost.co.uk/019ef6b6-39ec-7149-bef0-9482ff7eb400",
    "https://audio.jukehost.co.uk/019ef6b6-3e9c-7384-9485-04384746d3a4",
    "https://audio.jukehost.co.uk/019ef6b6-458a-72be-a316-71b38aed0ae2",
    "https://audio.jukehost.co.uk/019ef6b6-3b2f-71b1-8005-c99355a4cef6",
    "https://audio.jukehost.co.uk/019ef6b6-3b83-7349-8597-0980022e5bf4",
    "https://audio.jukehost.co.uk/019ef6b6-4666-70bf-8c8c-120845e3b4bd",
    "https://audio.jukehost.co.uk/019ef6b6-3bc8-73fb-8eea-0f320050b7e1",
    "https://audio.jukehost.co.uk/019ef6b6-3c1c-734a-b017-1f96cab84be9",
    "https://audio.jukehost.co.uk/019ef6b6-3efc-71f3-81f5-aa3b140d0078",
    "https://audio.jukehost.co.uk/019ef6b6-3cc6-7193-b7a0-bff5ca10558a",
    "https://audio.jukehost.co.uk/019ef6b6-453c-7042-8ce9-d2e647d0c7cc",
    "https://audio.jukehost.co.uk/019ef6b6-52fe-70a8-8a2e-fa80785a10b1",
    "https://audio.jukehost.co.uk/019ef6b6-3c69-7297-89eb-f2e980f8e485",
    "https://audio.jukehost.co.uk/019ef6b6-3f62-730e-83b0-b18a82d9105d",
    "https://audio.jukehost.co.uk/019ef6b6-4a12-7372-a7f1-aa97faa6f16a",
    "https://audio.jukehost.co.uk/019ef6b6-381b-7216-8de9-8a9ce2e16280",
    "https://audio.jukehost.co.uk/019ef6b6-3d10-7158-8c19-a83d6c2112a3",
    "https://audio.jukehost.co.uk/019ef6b6-381b-736f-934c-a8af8c038d62",
    "https://audio.jukehost.co.uk/019ef6b6-417e-724e-b448-4fa6d1025686",
    "https://audio.jukehost.co.uk/019ef6b6-5502-713c-86d0-83fe3ca81b44",
    "https://audio.jukehost.co.uk/019ef6b6-5502-713c-86d0-83fe3ca81b44",
    "https://audio.jukehost.co.uk/019ef6b6-5502-713c-86d0-83fe3ca81b44",
    "https://audio.jukehost.co.uk/019ef6b6-3822-7347-a7ea-5bb4d13eedc5",
    "https://audio.jukehost.co.uk/019ef6b6-389b-72d3-968b-6888f9dd25b5",
    "https://audio.jukehost.co.uk/019ef6b6-5425-700e-9a51-dc24a6bb0930",
    "https://audio.jukehost.co.uk/019ef6b6-52db-730a-b7ac-77b852e381ee",
    "https://audio.jukehost.co.uk/019ef6b6-52ad-7002-9710-26bc49a0ef66",
    "https://audio.jukehost.co.uk/019ef6b6-38e3-730c-8fc4-45e44397b115",
    "https://audio.jukehost.co.uk/019ef6b6-5342-72da-abb6-5bcc3f3b2a9c",
    "https://audio.jukehost.co.uk/019ef6b6-3921-71f9-9e85-48a139a6f6ef",
    "https://audio.jukehost.co.uk/019ef6b6-406a-736c-a24c-c4f446689332",
    "https://audio.jukehost.co.uk/019ef6b6-396c-73e5-8d51-602d6e02cd7a",
    "https://audio.jukehost.co.uk/019ef6b6-382d-7115-a6da-6dc95e96f53b",
    "https://audio.jukehost.co.uk/019ef6b6-39fe-715d-9d20-604c850fd05e",
    "https://audio.jukehost.co.uk/019ef6b6-53ba-732f-95e0-0d33b627532f",
    "https://audio.jukehost.co.uk/019ef6b6-5487-722c-9052-c6848535a44e",
    "https://audio.jukehost.co.uk/019ef6b6-39bf-719c-ad2e-018ba79c01a4",
    "https://audio.jukehost.co.uk/019ef6b6-55f4-71d0-9f8e-e998e3197312",
    "https://audio.jukehost.co.uk/019ef6b6-39fe-739e-b0a4-94f2d1a6c28d",
    "https://audio.jukehost.co.uk/019ef6b6-400a-71a7-9fbb-e10b4aeda09d",
    "https://audio.jukehost.co.uk/019ef6b6-41ec-72a5-a139-1a46dc47043d",
    "https://audio.jukehost.co.uk/019ef6b6-3a5f-70bd-ac75-3544368b290c",
    "https://audio.jukehost.co.uk/019ef6b6-3944-7117-bf88-c6cfb5aa825d",
    "https://audio.jukehost.co.uk/019ef6b6-3a44-73af-b935-70dc53074ba4",
    "https://audio.jukehost.co.uk/019ef6b6-3de9-700d-bd4c-29b6bd9e435b",
    "https://audio.jukehost.co.uk/019ef6b6-3a8c-710a-8b15-5f243014b428",
    "https://audio.jukehost.co.uk/019ef6b6-3ad7-703f-8772-79c5ba5497a3",
    "https://audio.jukehost.co.uk/019ef6b6-3e33-7333-9182-a841ce0e9cf8",



    ]
  },

  baladavibe: {
    arquivos: [
    "https://audio.jukehost.co.uk/019ef1b8-4a6a-7202-8eb7-4ac302a5ad27",
    "https://audio.jukehost.co.uk/019ef4e1-21fb-7289-a9ad-7db845e0070f",
    "https://audio.jukehost.co.uk/019f0e4a-0422-732b-bbcc-b72a4a84d959",
    "https://audio.jukehost.co.uk/019ef1b8-5bb5-730d-8da5-187ad7408311",
    "https://audio.jukehost.co.uk/019ef1b8-b19c-72fd-b912-cdc57cf6acd7",
    "https://audio.jukehost.co.uk/019ef4db-de2d-7154-84e3-ab0d01ecd0df",
    "https://audio.jukehost.co.uk/019ef472-e4f4-71b4-925a-403c7647a414",
    "https://audio.jukehost.co.uk/019ef1b8-7e80-7092-b9b4-09d22efc7dfa",
    "https://audio.jukehost.co.uk/019ef1b8-c3b2-704d-9e51-d3a76c07a72d",
    "https://audio.jukehost.co.uk/019ef1b8-cf8d-708f-b24e-00e83268fcda",
    "https://audio.jukehost.co.uk/019ef1b8-cd2f-73e8-bced-94dc10f09ff1",
    "https://audio.jukehost.co.uk/019ef4e7-4bf4-7300-8795-bb8bda46e7d6",
    "https://audio.jukehost.co.uk/019ef472-952b-73b8-8cbd-033c6ad09c3f",
    "https://audio.jukehost.co.uk/019ef472-a5c1-722b-9400-56b9758203c4",
    "https://audio.jukehost.co.uk/019ef1b8-b0fb-70bb-b6f5-8aa3c1e4441f",
    "https://audio.jukehost.co.uk/019ef1b8-a5b7-7317-bbaa-46aab4a64d59",
    "https://audio.jukehost.co.uk/019ef1b8-aa22-7056-8527-e4062381fa33",
    "https://audio.jukehost.co.uk/019ef4e1-2174-736b-8738-85387165f9a0",
    "https://audio.jukehost.co.uk/019ef473-2155-71a8-b663-3acb92a60db5",
    "https://audio.jukehost.co.uk/019ef1b8-b1ee-718e-8407-bfd7f06d9625",
    "https://audio.jukehost.co.uk/019ef1b8-4b0f-70c8-93b9-c3f573e08180",
    "https://audio.jukehost.co.uk/019ef1b8-7fbb-70e7-8811-83296c4055b5",
    "https://audio.jukehost.co.uk/019ef1b8-ceb4-7160-9fae-2b33cec7c0ef",
    "https://audio.jukehost.co.uk/019ef1b8-cb4e-705c-bfe6-380e37f989f6",
    "https://audio.jukehost.co.uk/019ef472-855e-7363-bec9-2904c8fe7b9e",
    "https://audio.jukehost.co.uk/019ef473-3000-713d-be8b-6231ebed44e9",
    "https://audio.jukehost.co.uk/019ef473-2968-71e7-8dfe-a7aeabba456f",
    "https://audio.jukehost.co.uk/019ef1b8-c48f-7384-affe-222c2a2447cf",
    "https://audio.jukehost.co.uk/019ef1b8-c801-7131-a40d-6e363b0207cd",
    "https://audio.jukehost.co.uk/019ef1b8-c5d7-729e-8367-f6626d627588",
    "https://audio.jukehost.co.uk/019ef1b8-d652-7367-aaa9-d89148a21037",
    "https://audio.jukehost.co.uk/019ef1b8-77ce-72e5-9ec3-9a71451d80b5",
    "https://audio.jukehost.co.uk/019ef1b8-8845-714a-b3e2-2bed9abc82f6",
    "https://audio.jukehost.co.uk/019ef1b8-c408-7316-8450-80d32ab4f1cb",
    "https://audio.jukehost.co.uk/019ef1b8-4ba7-7206-8337-3b54a0388c71",
    "https://audio.jukehost.co.uk/019ef1b8-d998-73aa-8696-ff26a7ccd7e1",
    "https://audio.jukehost.co.uk/019ef1b8-b13a-7391-aa83-766dc467429a",
    "https://audio.jukehost.co.uk/019ef1b8-c4d6-7103-86f5-177093904993",
    "https://audio.jukehost.co.uk/019ef1b8-7c45-73c4-a5bc-e15eef35dfe2",
    "https://audio.jukehost.co.uk/019ef1b8-d013-72e3-bd74-b61e46fcf3e5",
    "https://audio.jukehost.co.uk/019ef1b8-cf10-70de-87d6-318723337dd7",
    "https://audio.jukehost.co.uk/019ef4dc-437a-727a-8757-fb7f047b9009",
    "https://audio.jukehost.co.uk/019ef4db-f7a8-72f2-9497-b85cbc3e1f00",
    "https://audio.jukehost.co.uk/019ef1b8-c44b-7231-a5f4-8dc759757123",
    "https://audio.jukehost.co.uk/019ef1b8-d6dc-73ed-994d-53f498352f82",
    "https://audio.jukehost.co.uk/019ef1b8-c51a-738f-b69a-9ad96506c672",
    "https://audio.jukehost.co.uk/019ef1b8-cf50-712c-903b-75b716f3d353",
    "https://audio.jukehost.co.uk/019ef1b8-4c71-7319-a80d-9c62b8c72685",
    "https://audio.jukehost.co.uk/019ef1b8-cdbb-70d5-893f-07249fda4f3e",
    "https://audio.jukehost.co.uk/019ef1b8-85c3-706e-95bd-5f71b1c31902",
    "https://audio.jukehost.co.uk/019ef1b8-cb03-71ff-8e41-9cb8b6562609",
    "https://audio.jukehost.co.uk/019ef1b8-8391-728d-950b-a342c42a7c3b",
    "https://audio.jukehost.co.uk/019ef1b8-cc24-7178-bd49-10c2575e3e9c",
    "https://audio.jukehost.co.uk/019ef1b8-ca69-72ae-9167-a19bd4988701",
    "https://audio.jukehost.co.uk/019ef1b8-ce03-7075-be06-a41c5f5400a3",
    "https://audio.jukehost.co.uk/019ef1b8-8bc5-719b-8fc1-681e2f3a0379",
    "https://audio.jukehost.co.uk/019ef1b8-cc93-73ff-8112-84cab3287110",
    "https://audio.jukehost.co.uk/019ef1b8-d05e-73f7-b0dc-e3efdc9d8354",
    "https://audio.jukehost.co.uk/019ef1b8-4b0f-7164-92ea-d75c2d0e5186",
    "https://audio.jukehost.co.uk/019ef1b8-c366-73dd-9332-5f39ee72f51d",
    "https://audio.jukehost.co.uk/019ef1b8-7921-71ac-a95f-6e32818a152f",
    "https://audio.jukehost.co.uk/019ef1b8-c325-7258-808d-b16f83d9baab",
    "https://audio.jukehost.co.uk/019ef1b8-c8e1-704a-8109-fd446c6c634a",
    "https://audio.jukehost.co.uk/019ef1b8-cb90-7328-b493-25c7a6acfde6",
    "https://audio.jukehost.co.uk/019ef1b8-7f45-714b-a6a8-c5dcffc4ee22",
    "https://audio.jukehost.co.uk/019ef1b8-a8e1-7281-a00a-ca977dd0a49c",
    "https://audio.jukehost.co.uk/019ef1b8-c2e0-7051-83d3-68cd2fdf4b45",
    "https://audio.jukehost.co.uk/019ef1b8-c28e-716d-9601-c5b47c87d054",
    "https://audio.jukehost.co.uk/019ef1b8-cabf-71fa-97f3-f575f2f62940",
    "https://audio.jukehost.co.uk/019ef1b8-4957-70ec-af0a-eab74623c7ad",
    "https://audio.jukehost.co.uk/019ef1b8-c561-7343-b69e-b599836f330f",
    "https://audio.jukehost.co.uk/019ef1b8-ca1b-70f2-9f74-7057d7538238",
    "https://audio.jukehost.co.uk/019ef1b8-a934-735c-8bd3-3307c058a2c9",
    "https://audio.jukehost.co.uk/019ef1b8-d0d2-7334-a74e-c1d820a27281",
    "https://audio.jukehost.co.uk/019ef1b8-83f0-7075-8268-185a26b867f9",
    "https://audio.jukehost.co.uk/019ef1b8-a9dd-7121-85a9-7b7c746458be",
    "https://audio.jukehost.co.uk/019ef1b8-797f-72cc-ab7d-969f21c8924d",
    "https://audio.jukehost.co.uk/019ef1b8-ce58-7133-91f8-0b767518672c",
    "https://audio.jukehost.co.uk/019ef1b8-c736-71b7-b6ce-5ff863d73e0b",
    "https://audio.jukehost.co.uk/019ef1b8-cbd1-7368-840a-c8c38e456eee",
    "https://audio.jukehost.co.uk/019ef1b8-4b3f-72b2-92e1-7671701a4199",
    "https://audio.jukehost.co.uk/019ef1b8-c247-710b-8d77-850c6d610468",
    "https://audio.jukehost.co.uk/019ef1b8-c61d-7107-965c-52f0b8b64a89",
    "https://audio.jukehost.co.uk/019ef1b8-c8aa-7307-9001-6201035689dd",
    "https://audio.jukehost.co.uk/019ef1b8-c1e8-70b6-b97f-998ffbbaed1e",
    "https://audio.jukehost.co.uk/019ef1b8-897c-72e4-91d6-8746207bc3c0",
    "https://audio.jukehost.co.uk/019ef1b8-87e7-71b1-9cfb-fa41695eef90",
    "https://audio.jukehost.co.uk/019ef1b8-cd72-73dd-895f-275ad4ed4000",
    "https://audio.jukehost.co.uk/019ef1b8-cce7-73c5-8c57-22fd597ec1eb",
    "https://audio.jukehost.co.uk/019ef1b8-cdb9-73dc-a504-244a32cd8cc9",
    "https://audio.jukehost.co.uk/019ef1b8-4998-7028-9e22-26b5ff09f2e8",
    "https://audio.jukehost.co.uk/019ef1b8-49d1-70c2-952b-be081fcc37a1",
    "https://audio.jukehost.co.uk/019ef43e-02f6-71fa-953b-a4233cf48e9a",
    "https://audio.jukehost.co.uk/019ef43d-cbf0-7195-beb8-0aee861ab801",
    "https://audio.jukehost.co.uk/019ef43d-a85d-713d-b44b-112c32881ec8",
    "https://audio.jukehost.co.uk/019ef43d-d10a-72ed-a933-8f13aab6ea86",
    "https://audio.jukehost.co.uk/019ef4dc-93e8-73a3-94a0-0d4e7a40674b",
    "https://audio.jukehost.co.uk/019ef43d-a36c-7171-a8a9-4ed2094aff5f",
    "https://audio.jukehost.co.uk/019ef472-dc5c-7349-98bb-abf6ba393cd2",
    "https://audio.jukehost.co.uk/019ef47e-0a0d-7215-a0f2-f16d8ef62722",
    "https://audio.jukehost.co.uk/019ef473-71b8-738c-9283-250e99b54aba",
    "https://audio.jukehost.co.uk/019ef473-3d1e-714f-9908-6a50c9a2fbbe",
    "https://audio.jukehost.co.uk/019ef47c-c06e-7191-a2b6-18ba19198ce0",
    "https://audio.jukehost.co.uk/019ef473-4a83-708d-b6fa-c95632d05550",
    "https://audio.jukehost.co.uk/019ef473-485d-70cb-b971-c8c8e39ff146",
    "https://audio.jukehost.co.uk/019ef473-4262-7341-8b4b-58f9443e5b2e",
    "https://audio.jukehost.co.uk/019ef473-2870-72c8-a9b2-bef1b5d2ee0c",
    "https://audio.jukehost.co.uk/019ef473-3b41-713b-9d06-ad0d2247b233",
    "https://audio.jukehost.co.uk/019ef47b-93f0-7075-8338-673a3c1c9cca",
    "https://audio.jukehost.co.uk/019ef47b-94ca-72b0-9272-3d5835e91925",
    "https://audio.jukehost.co.uk/019ef47b-941c-73b6-8349-7b23a86544e0",
    "https://audio.jukehost.co.uk/019ef47b-93cc-717c-b9b0-54a75ee54332",
    "https://audio.jukehost.co.uk/019ef47b-93bd-7336-9649-fa5dbbf6a6cb",
    "https://audio.jukehost.co.uk/019ef47b-93bd-7115-ab97-9676bc9a9bf2",
    "https://audio.jukehost.co.uk/019ef473-42aa-715c-aeb0-688f2b0331c9",
    "https://audio.jukehost.co.uk/019ef473-28f4-7354-8df5-9bbf2e683f76",
    "https://audio.jukehost.co.uk/019ef473-4b03-73bf-b46a-ee811200244a",
    "https://audio.jukehost.co.uk/019ef472-d985-7308-9131-5ccca2d56c73",
    "https://audio.jukehost.co.uk/019ef47e-d204-7268-b903-f91087ae0ce5",
    "https://audio.jukehost.co.uk/019ef473-3b8d-7298-aa4b-d328bc188ab1",
    "https://audio.jukehost.co.uk/019ef478-47b1-7371-b388-f3595630a116",
    "https://audio.jukehost.co.uk/019ef473-4656-72a6-b342-dc203f352af7",
    "https://audio.jukehost.co.uk/019ef478-45de-724c-b35a-ce5795faa1ff",
    "https://audio.jukehost.co.uk/019ef47e-d21f-737e-89e8-4a5bb9da1f13",
    "https://audio.jukehost.co.uk/019ef4dc-3c3b-72b9-8f46-9c68e6a0177c",
    "https://audio.jukehost.co.uk/019ef473-7010-7386-bd4f-78ac4e0da9d2",
    "https://audio.jukehost.co.uk/019ef473-3000-713d-be8b-6231ebed44e9",
    "https://audio.jukehost.co.uk/019ef473-66f1-7097-80ee-075f9cba17d5",
    "https://audio.jukehost.co.uk/019ef473-37b1-72a5-b418-3a8bdc3b831e",
    "https://audio.jukehost.co.uk/019ef472-b809-7383-bb5f-88f2e02e8bd8",
    "https://audio.jukehost.co.uk/019ef4dc-47c8-72f1-a207-309ce6cc2381",
    "https://audio.jukehost.co.uk/019ef473-121d-70e7-8b45-b368fe6788aa",
    "https://audio.jukehost.co.uk/019ef473-0154-7377-a2f5-b86f0ee62f83",
    "https://audio.jukehost.co.uk/019ef473-1aba-72c2-9efe-dfb9c09ea474",
    "https://audio.jukehost.co.uk/019ef472-e3cc-705d-9853-1f34d8d8dcc7",
    "https://audio.jukehost.co.uk/019ef473-2e66-738c-a003-89e32b9ace5d",
    "https://audio.jukehost.co.uk/019ef472-bb11-71b8-8e7f-73aab5560178",
    "https://audio.jukehost.co.uk/019ef472-e6db-73e1-8c22-d5f0e78c0814",
    "https://audio.jukehost.co.uk/019ef473-0dc1-73dd-96fc-e0966590fff3",
    "https://audio.jukehost.co.uk/019ef472-a779-738a-869c-5c0615aa15e7",
    "https://audio.jukehost.co.uk/019ef473-1f64-739b-9f3b-bbfe8ceda09b",
    "https://audio.jukehost.co.uk/019ef472-c00f-7319-a20e-0e2a5f91a5ce",
    "https://audio.jukehost.co.uk/019ef472-cc65-70f6-a17c-79017e5eeece",
    "https://audio.jukehost.co.uk/019ef473-053b-736f-9b3f-a4228057195b",
    "https://audio.jukehost.co.uk/019ef472-c504-70a2-ac72-865d12575584",
    "https://audio.jukehost.co.uk/019ef472-dd0b-72c0-a1c5-65160441c557",
    "https://audio.jukehost.co.uk/019ef472-abbc-710e-aa40-eee96933d7c4",
    "https://audio.jukehost.co.uk/019ef472-d1c1-72cc-9606-6e1321ce912a",
    "https://audio.jukehost.co.uk/019ef472-c920-719e-ab94-3561c46bd74a",
    "https://audio.jukehost.co.uk/019ef4dc-4878-727f-ac23-3b9c18705bf4",
    "https://audio.jukehost.co.uk/019ef472-7b9b-7332-91e8-5e710820a23e",
    "https://audio.jukehost.co.uk/019ef472-f02f-7346-b736-325b9bc5cf3c",
    "https://audio.jukehost.co.uk/019ef472-952b-73b8-8cbd-033c6ad09c3f",
    "https://audio.jukehost.co.uk/019ef472-e0c3-739f-982d-fb8f84f84e8b",
    "https://audio.jukehost.co.uk/019ef472-c1b8-71f8-97e1-098ca7f8a0f6",
    "https://audio.jukehost.co.uk/019ef473-0ecb-71c9-9ab9-a7ca10463393",
    "https://audio.jukehost.co.uk/019ef472-be61-70bd-b36b-00d572a0bf3e",
    "https://audio.jukehost.co.uk/019ef473-3000-713d-be8b-6231ebed44e9",
    "https://audio.jukehost.co.uk/019ef473-00cc-718b-b033-de7ca9398d78",
    "https://audio.jukehost.co.uk/019ef4dc-92cd-73f1-ac4b-e97d0ca4fc19",
    "https://audio.jukehost.co.uk/019ef472-d936-732b-bb67-669190771161",
    "https://audio.jukehost.co.uk/019ef472-f632-7314-a2d0-eded89159dfb",
    "https://audio.jukehost.co.uk/019ef472-d0cc-70eb-b5df-84cb9283d9b3",
    "https://audio.jukehost.co.uk/019ef472-ebf8-72e4-94d1-5c7ad1699904",
    "https://audio.jukehost.co.uk/019ef472-bd81-7313-9836-ff7ff5d9e24f",
    "https://audio.jukehost.co.uk/019ef472-a5c1-722b-9400-56b9758203c4",
    "https://audio.jukehost.co.uk/019ef472-f92e-71bc-afd6-2f2baf4d9aad",
    "https://audio.jukehost.co.uk/019ef472-efc9-72c9-9a59-cf777fb8fc08",
    "https://audio.jukehost.co.uk/019ef472-c1f1-70f6-8733-c4782ddd3d8b",
    "https://audio.jukehost.co.uk/019ef472-ea52-7303-af8d-6d68f5236c96",
    "https://audio.jukehost.co.uk/019ef473-0a6f-711b-848c-731ea1692c9f",
    "https://audio.jukehost.co.uk/019ef472-b208-70df-9a5f-fab166d86563",
    "https://audio.jukehost.co.uk/019ef473-24da-7027-8f4e-f6965bd78980",
    "https://audio.jukehost.co.uk/019ef472-c551-72dc-95f4-18c2b2d19e26",
    "https://audio.jukehost.co.uk/019ef472-f424-70c2-bd50-e13915851f2e",
    "https://audio.jukehost.co.uk/019ef472-855e-7363-bec9-2904c8fe7b9e",
    "https://audio.jukehost.co.uk/019ef472-f1ed-730e-9826-4dc95f27c7c1",
    "https://audio.jukehost.co.uk/019ef472-aed4-70d1-84fe-9a046daffe60",
    "https://audio.jukehost.co.uk/019ef473-2968-71e7-8dfe-a7aeabba456f",
    "https://audio.jukehost.co.uk/019ef472-d82a-73d5-a97f-283cbe506218",
    "https://audio.jukehost.co.uk/019ef472-ba7f-708d-bd34-1b38d056ffe6",
    "https://audio.jukehost.co.uk/019ef4dc-418c-70f9-89c6-6d37d28297ae",
    "https://audio.jukehost.co.uk/019ef473-1daa-712d-ae50-4a462bae8e6d",
    "https://audio.jukehost.co.uk/019ef473-0583-73f7-aae9-ad6275a3f1dd",
    "https://audio.jukehost.co.uk/019ef473-0f1a-70a4-bef2-2938cea6723b",
    "https://audio.jukehost.co.uk/019ef472-ce53-71d1-9bb9-fc9385b31be7",
    "https://audio.jukehost.co.uk/019ef472-b24a-715e-ac00-de95b23eb7d8",
    "https://audio.jukehost.co.uk/019ef473-2155-71a8-b663-3acb92a60db5",
    "https://audio.jukehost.co.uk/019ef473-25a7-70cd-9713-8390495360de",
    "https://audio.jukehost.co.uk/019ef4e1-21fb-7289-a9ad-7db845e0070f",
    "https://audio.jukehost.co.uk/019ef4e7-4bf4-7300-8795-bb8bda46e7d6",
    "https://audio.jukehost.co.uk/019ef4dc-c3ef-72e3-9bbb-3d96c99a4c1a",
    "https://audio.jukehost.co.uk/019ef4dc-40a0-702a-bf8a-bbe0b8162c3d",
    "https://audio.jukehost.co.uk/019ef4dc-3ecf-7383-a272-7bde07263a63",
    "https://audio.jukehost.co.uk/019ef4db-ac76-70bc-9dcb-16d8e713af32",
    "https://audio.jukehost.co.uk/019ef4dc-0b64-7141-a6b0-dd272f5532ca",
    "https://audio.jukehost.co.uk/019ef4dc-47c8-72f1-a207-309ce6cc2381",
    "https://audio.jukehost.co.uk/019ef4dc-93e8-73a3-94a0-0d4e7a40674b",
    "https://audio.jukehost.co.uk/019ef4dc-40f0-73ba-bd1c-08fc2dfb3a3b",
    "https://audio.jukehost.co.uk/019ef4dc-6baf-72ad-8e4d-537fa9046560",
    "https://audio.jukehost.co.uk/019ef4db-e6ce-716a-ba30-40678e25db6e",
    "https://audio.jukehost.co.uk/019ef4db-eba0-729b-892c-c5983aa4fba5",
    "https://audio.jukehost.co.uk/019ef4dc-033a-7376-8dfb-e6d0ee0cb596",
    "https://audio.jukehost.co.uk/019ef4db-de2d-7154-84e3-ab0d01ecd0df",
    "https://audio.jukehost.co.uk/019ef4db-ce56-71fa-8295-6e378afc7f8a",
    "https://audio.jukehost.co.uk/019ef4db-ff0a-7249-aac2-630c0d99a2da",
    "https://audio.jukehost.co.uk/019ef4dc-452f-70b9-81c8-e4f487d0bed1",
    "https://audio.jukehost.co.uk/019ef4db-f328-7398-aa67-f5fa1590f815",
    "https://audio.jukehost.co.uk/019ef4dc-33a4-70be-b428-b197a2cc1020",
    "https://audio.jukehost.co.uk/019ef4db-e786-7058-a111-1e7f7d46452b",
    "https://audio.jukehost.co.uk/019ef4dc-8f92-700d-9ff1-b1bbbcccdfdb",
    "https://audio.jukehost.co.uk/019ef4dc-6e00-7098-82e0-f32501a847ba",
    "https://audio.jukehost.co.uk/019ef4dc-458c-736b-8fe9-6c3a0670d253",
    "https://audio.jukehost.co.uk/019ef4dc-c136-723f-9283-a9ce4f2eac0c",
    "https://audio.jukehost.co.uk/019ef4dc-4481-7041-95ba-c955362ecaf5",
    "https://audio.jukehost.co.uk/019ef4dc-340d-7139-b252-96dcbd586dd5",
    "https://audio.jukehost.co.uk/019ef4dc-04b7-72e4-a1de-694daa053b9e",
    "https://audio.jukehost.co.uk/019ef4db-fab9-739c-a105-979d60a69c46",
    "https://audio.jukehost.co.uk/019ef4dc-38ef-711f-ba19-d9215a622a4b",
    "https://audio.jukehost.co.uk/019ef4dc-34f8-7065-bfc5-d3f14bad516f",
    "https://audio.jukehost.co.uk/019ef4db-f285-71c7-a4af-36cfa7b8b6ce",
    "https://audio.jukehost.co.uk/019ef4dc-540d-71c7-b062-a44ef29e204c",
    "https://audio.jukehost.co.uk/019ef4dc-92cd-73f1-ac4b-e97d0ca4fc19",
    "https://audio.jukehost.co.uk/019ef4dc-9597-711a-a830-95f4a476132d",
    "https://audio.jukehost.co.uk/019ef4dc-9322-73f0-9731-2c6e0f313ddf",
    "https://audio.jukehost.co.uk/019ef4dc-567f-71db-88d8-c5a15454b764",
    "https://audio.jukehost.co.uk/019ef4dc-0a2b-7010-9570-e051cf7eef72",
    "https://audio.jukehost.co.uk/019ef4dc-49b1-7392-b452-a860600e7a33",
    "https://audio.jukehost.co.uk/019ef4dc-3af8-719c-b429-53fb0108b65e",
    "https://audio.jukehost.co.uk/019ef4dc-3c91-7105-a4d3-6394dc04bdd4",
    "https://audio.jukehost.co.uk/019ef4dc-592a-7084-9da9-88a6d16a1042",
    "https://audio.jukehost.co.uk/019ef4dc-3f19-7085-bbda-4a82db812ada",
    "https://audio.jukehost.co.uk/019ef4dc-3f60-72b3-b2ef-2f3fd696c219",
    "https://audio.jukehost.co.uk/019ef4dc-41e6-72a5-a797-087e6b7e523d",
    "https://audio.jukehost.co.uk/019ef4dc-437a-727a-8757-fb7f047b9009",
    "https://audio.jukehost.co.uk/019ef4dc-3aa7-720a-be29-7a6b27930450",
    "https://audio.jukehost.co.uk/019ef4dc-3c3b-72b9-8f46-9c68e6a0177c",
    "https://audio.jukehost.co.uk/019ef4db-e4cf-70ff-be89-534ad51ba85e",
    "https://audio.jukehost.co.uk/019ef4db-f979-7365-9ecd-a3eb7e9dbd84",
    "https://audio.jukehost.co.uk/019ef4dc-4878-727f-ac23-3b9c18705bf4",
    "https://audio.jukehost.co.uk/019ef4db-ec43-7294-aafc-d1bd9511b77e",
    "https://audio.jukehost.co.uk/019ef4dc-0583-714e-b0cc-2a03c91882d8",
    "https://audio.jukehost.co.uk/019ef4db-d3c0-70ad-b79f-e493c4c54625",
    "https://audio.jukehost.co.uk/019ef4dc-04b7-72e4-a1de-694daa053b9e",



  

    ]
  },


  lofi: {
    arquivos: [
    "https://audio.jukehost.co.uk/019ef5d5-b08f-73c6-a2dc-1be905f02de4",
    "https://audio.jukehost.co.uk/019ef5d5-a61f-7113-82f9-acf63c70760a",
    "https://audio.jukehost.co.uk/019f0ed9-a411-7064-8252-364c12938b96",
    "https://audio.jukehost.co.uk/019f0ed9-9f11-71e6-8344-dc321ada4fb7",
    "https://audio.jukehost.co.uk/019ef5d5-60f8-7369-a685-ef03868777b3", 
    "https://audio.jukehost.co.uk/019ef4dc-9480-73d6-85e7-2dc9fe23e9c7",
    "https://audio.jukehost.co.uk/019ef5d5-a3f5-73e7-964d-cf9120801052",
    "https://audio.jukehost.co.uk/019ef5d5-a6f6-7046-8cc2-376a5164d4c5",
    "https://audio.jukehost.co.uk/019ef5d5-59c8-7161-bd48-049a993dbd0e",
    "https://audio.jukehost.co.uk/019ef5d5-a76a-7188-ab4d-bedc2b3ede22",
    "https://audio.jukehost.co.uk/019ef5d5-9f61-70cc-a295-e81f16fd2ab7",
    "https://audio.jukehost.co.uk/019ef5d5-7a7a-72d4-bd06-4734a2b9cef6",
    "https://audio.jukehost.co.uk/019ef5d5-a237-72f4-8f29-7682d24c00db",
    "https://audio.jukehost.co.uk/019ef5d5-b2ab-73f2-a2d3-f3b16bf1dfcc",
    "https://audio.jukehost.co.uk/019ef5d5-af74-72af-9a02-1705744beaac",
    "https://audio.jukehost.co.uk/019ef4dc-0183-739f-ba21-97467ef170e6",
    "https://audio.jukehost.co.uk/019ef4dc-4818-73d2-8afb-384d4a7dde58",
    "https://audio.jukehost.co.uk/019ef4dc-6b35-709c-b40b-dcc7874f2201",
    "https://audio.jukehost.co.uk/019ef4dc-a655-73e6-9aed-cef52cf3959c",
    "https://audio.jukehost.co.uk/019ef5d5-a55d-70af-aff3-79d5f6aa88f4",
    "https://audio.jukehost.co.uk/019ef5d5-a2c4-73d7-9bb6-8de04c960087",
    "https://audio.jukehost.co.uk/019f0ede-9dea-72f9-a3aa-e0ece808ff5a",
    "https://audio.jukehost.co.uk/019f0ede-6cf5-7210-b466-40c66a991e44",
    "https://audio.jukehost.co.uk/019ef5d5-a7c6-728b-a8c6-79bff1da30b0",
    "https://audio.jukehost.co.uk/019ef5d5-9ee8-73d9-9b26-f3a7d217b438",
    "https://audio.jukehost.co.uk/019ef5d5-7b3a-73e4-a804-255514299b45",
    "https://audio.jukehost.co.uk/019ef5d5-a5ac-72ee-be4f-dd1eb878e470",
    "https://audio.jukehost.co.uk/019ef5d5-a4bd-7070-89b4-aac61e3c3520",
    "https://audio.jukehost.co.uk/019ef5d5-6ba6-7112-abda-e6c5db2e918c",
    "https://audio.jukehost.co.uk/019ef5d5-a8a9-733e-ba92-1641727af039",
    "https://audio.jukehost.co.uk/019ef5d5-7778-736d-bf3b-b45307b39af4",
    "https://audio.jukehost.co.uk/019ef5d5-9040-7298-b303-19e4e5f8a951",
    "https://audio.jukehost.co.uk/019ef5d5-a457-7330-a321-c83137f34ceb",
    "https://audio.jukehost.co.uk/019ef5d5-a3f5-73e7-964d-cf9120801052",
    "https://audio.jukehost.co.uk/019ef5d5-62b2-7095-bef3-c35a0a251675",
    "https://audio.jukehost.co.uk/019ef5d5-5f3a-7162-8c21-e0389e52f53d",
    "https://audio.jukehost.co.uk/019ef5d5-60a1-73d4-9bf3-6d51adcb8e8e",
    "https://audio.jukehost.co.uk/019ef5d5-8fcf-718c-a3b7-e946eabca945",
    "https://audio.jukehost.co.uk/019ef5d5-b2ab-73f2-a2d3-f3b16bf1dfcc",
    "https://audio.jukehost.co.uk/019ef5d5-a237-72f4-8f29-7682d24c00db",
    "https://audio.jukehost.co.uk/019ef5d5-6b2c-7311-b98c-02b1a59dce60",
    "https://audio.jukehost.co.uk/019ef5d5-a68d-71b2-b0f5-81e7eeb29d27",
    "https://audio.jukehost.co.uk/019ef5d5-9f61-70cc-a295-e81f16fd2ab7",
    "https://audio.jukehost.co.uk/019ef5d5-7ad4-73c7-8a96-46409b4948dc",
    "https://audio.jukehost.co.uk/019ef5d5-5c81-7198-be22-bf4c7be54da3",
    "https://audio.jukehost.co.uk/019ef5d5-7985-71ea-a689-68cacc244c25",
    "https://audio.jukehost.co.uk/019ef5d5-af74-72af-9a02-1705744beaac",
    "https://audio.jukehost.co.uk/019ef5d5-8f67-7363-8bdf-731c0e1214ca",
    "https://audio.jukehost.co.uk/019ef5d5-b08f-73c6-a2dc-1be905f02de4",
    "https://audio.jukehost.co.uk/019ef5d5-b0e8-7054-88d4-d5d517307ee0",
    "https://audio.jukehost.co.uk/019ef5d5-7a7a-72d4-bd06-4734a2b9cef6",
    "https://audio.jukehost.co.uk/019ef5d5-a76a-7188-ab4d-bedc2b3ede22",
    "https://audio.jukehost.co.uk/019ef5d5-a76a-7188-ab4d-bedc2b3ede22",
    "https://audio.jukehost.co.uk/019ef5d5-59c8-7161-bd48-049a993dbd0e",
    "https://audio.jukehost.co.uk/019ef5d5-6ab8-70d1-becb-2968a62b852d",
    "https://audio.jukehost.co.uk/019ef5d5-a61f-7113-82f9-acf63c70760a",
    "https://audio.jukehost.co.uk/019ef5d5-a178-73eb-93ab-c26dc846184a",
    "https://audio.jukehost.co.uk/019ef5d5-a0f4-72d0-978a-ea94e05df21f",
    "https://audio.jukehost.co.uk/019ef5d5-aa84-73f2-bd6e-3a47103601d8",
    "https://audio.jukehost.co.uk/019ef5d5-6c79-7107-8f25-1832f9d3b3cf",
    "https://audio.jukehost.co.uk/019ef5d5-9fea-7076-9785-2ec5b817cfa9",
    "https://audio.jukehost.co.uk/019ef5d5-a6f6-7046-8cc2-376a5164d4c5",
    "https://audio.jukehost.co.uk/019ef5d5-7b62-7388-86ad-250472c6c02e",
    "https://audio.jukehost.co.uk/019ef5d5-a06e-71d6-a133-84a3abb154e2",
    "https://audio.jukehost.co.uk/019ef5d5-a1fe-73bf-85de-360dda0f7f39",
    "https://audio.jukehost.co.uk/019ef5d5-a50a-72ef-a572-579e61bf470e",
    "https://audio.jukehost.co.uk/019ef5d5-a832-73ee-8a12-71fb6e6ca45d",
    "https://audio.jukehost.co.uk/019ef5d5-8ec4-725b-adb3-1e897748db97",
    "https://audio.jukehost.co.uk/019ef5d5-60f8-7369-a685-ef03868777b3",
    "https://audio.jukehost.co.uk/019ef5d5-b025-72ef-b72b-8622637de5a8",
    "https://audio.jukehost.co.uk/019ef5d5-7893-7091-8c26-4f3f432c697a",


    

    ]
  },

  hitsvibe: {
    arquivos: [
    "https://audio.jukehost.co.uk/019ef43e-0ed4-7232-a4a2-103e7d26a211",
    "https://audio.jukehost.co.uk/019ef43d-8b68-7236-b1d4-22a679e1bd02",
    "https://audio.jukehost.co.uk/019ef472-abbc-710e-aa40-eee96933d7c4",
    "https://audio.jukehost.co.uk/019ef472-c1f1-70f6-8733-c4782ddd3d8b",
    "https://audio.jukehost.co.uk/019ef4dc-8f0d-7249-aa1e-89f3de8bbc53",
    "https://audio.jukehost.co.uk/019ef43e-02f6-71fa-953b-a4233cf48e9a",
    "https://audio.jukehost.co.uk/019f494f-8ac6-70cb-921d-fe3a46acd354",
    "https://audio.jukehost.co.uk/019ef4e1-2043-7129-b629-a84dc055ebde",
    "https://audio.jukehost.co.uk/019ef43e-09df-7270-9574-1efc8ec02f38",
    "https://audio.jukehost.co.uk/019ef472-e4f4-71b4-925a-403c7647a414",
    "https://audio.jukehost.co.uk/019f494f-8727-73f8-9790-645127311886",
    "https://audio.jukehost.co.uk/019ef473-7010-71e2-9c12-d8b20ad0f7e0",
    "https://audio.jukehost.co.uk/019f0e4a-0422-732b-bbcc-b72a4a84d959",
    "https://audio.jukehost.co.uk/019ef473-149c-71d8-a2e1-d491cd8bca9f",
    "https://audio.jukehost.co.uk/019ef4dc-3935-7065-84f6-170bd37418ff",
    "https://audio.jukehost.co.uk/019ef473-0583-73f7-aae9-ad6275a3f1dd",
    "https://audio.jukehost.co.uk/019ef4dc-07ea-7195-b5db-66e810d352ad",
    "https://audio.jukehost.co.uk/019ef43d-d166-71f8-b79b-53a302108bce",
    "https://audio.jukehost.co.uk/019ef4dc-3f60-72b3-b2ef-2f3fd696c219",
    "https://audio.jukehost.co.uk/019ef4dc-4a01-71dd-860f-66ebd29397e2",
    "https://audio.jukehost.co.uk/019ef4dc-4f16-7188-8aa8-cfc88b36133b",
    "https://audio.jukehost.co.uk/019ef43d-aeb5-71b1-a3d5-ae716694bd8c",
    "https://audio.jukehost.co.uk/019ef43d-b00d-7386-b74b-aca15f49ffee",
    "https://audio.jukehost.co.uk/019ef472-a5c1-722b-9400-56b9758203c4",
    "https://audio.jukehost.co.uk/019ef4dc-3ecf-7383-a272-7bde07263a63",
    "https://audio.jukehost.co.uk/019ef4dc-34f8-7065-bfc5-d3f14bad516f",
    "https://audio.jukehost.co.uk/019ef43e-0ad8-721c-87cc-08ca187e380a",
    "https://audio.jukehost.co.uk/019ef472-b208-70df-9a5f-fab166d86563",
    "https://audio.jukehost.co.uk/019ef4dc-4936-70be-be3c-5fb971066a7a",
    "https://audio.jukehost.co.uk/019ef4dc-0583-714e-b0cc-2a03c91882d8",
    "https://audio.jukehost.co.uk/019ef43d-b7c4-722a-b001-bfa68a73be02",
    "https://audio.jukehost.co.uk/019ef43e-0d1d-72e6-be31-a38457caf7fc",
    "https://audio.jukehost.co.uk/019ef4dc-94fd-721d-8b5c-de85f32558eb",
    "https://audio.jukehost.co.uk/019ef4dc-6349-71c3-a540-a16d2f6dddef",
    "https://audio.jukehost.co.uk/019ef4db-efea-737e-8a35-45fc8b79fa51",
    "https://audio.jukehost.co.uk/019ef473-01de-70b3-8baf-797f4da79a1c",
    "https://audio.jukehost.co.uk/019ef472-bcc5-708c-a0e9-c94546b8982a",
    "https://audio.jukehost.co.uk/019f494f-8968-7152-962a-0a4386fb9075",
    "https://audio.jukehost.co.uk/019f494f-8771-713d-8bbb-2e9bbe4f9bac",
    "https://audio.jukehost.co.uk/019ef473-3ef7-7274-8909-3612c46baa19",
    "https://audio.jukehost.co.uk/019ef472-c388-7340-b05f-74db5c191866",
    "https://audio.jukehost.co.uk/019ef472-e4f4-71b4-925a-403c7647a414",
    "https://audio.jukehost.co.uk/019ef4dc-9597-711a-a830-95f4a476132d",
    "https://audio.jukehost.co.uk/019ef4dc-3af8-719c-b429-53fb0108b65e",
    "https://audio.jukehost.co.uk/019ef4dc-702d-707f-a136-0e5c2e154047",
    "https://audio.jukehost.co.uk/019ef4dc-3b49-7288-9673-2fa8a921e5bb",
    "https://audio.jukehost.co.uk/019ef4db-dded-72e8-a8a8-50d9f56d0354",
    "https://audio.jukehost.co.uk/019ef4db-a375-7397-8fb8-939d4d71518e",
    "https://audio.jukehost.co.uk/019ef43d-f9d3-719b-bcd8-ab3d99e86f8d",
    "https://audio.jukehost.co.uk/019f494f-8734-7051-a6af-837e6c493bca",
    "https://audio.jukehost.co.uk/019ef4db-fab9-739c-a105-979d60a69c46",
    "https://audio.jukehost.co.uk/019ef473-0f1a-70a4-bef2-2938cea6723b",
    "https://audio.jukehost.co.uk/019ef4db-d161-703d-877d-e02dbc12e453",
    "https://audio.jukehost.co.uk/019ef43e-0537-72de-b24a-1e15daadf904",
    "https://audio.jukehost.co.uk/019ef43d-a519-73c0-bd2d-a228e42a6c8a",
    "https://audio.jukehost.co.uk/019ef472-ea52-7303-af8d-6d68f5236c96",
    "https://audio.jukehost.co.uk/019ef472-f92e-71bc-afd6-2f2baf4d9aad",
    "https://audio.jukehost.co.uk/019ef4dc-003e-7170-939a-1fad4100c3ff",
    "https://audio.jukehost.co.uk/019ef4dc-592a-7084-9da9-88a6d16a1042",
    "https://audio.jukehost.co.uk/019ef4db-ef81-71d2-945f-d147cb449f93",
    "https://audio.jukehost.co.uk/019ef4dc-3f19-7085-bbda-4a82db812ada",
    "https://audio.jukehost.co.uk/019ef4dc-329a-7364-ad13-711fd653f302",
    "https://audio.jukehost.co.uk/019ef43d-cbf0-7195-beb8-0aee861ab801",
    "https://audio.jukehost.co.uk/019ef43e-082c-7038-b10d-0a9b0ca4ae05",
    "https://audio.jukehost.co.uk/019ef4dc-70b9-700f-8355-772e7d0ac76a",
    "https://audio.jukehost.co.uk/019ef4dc-9615-73e5-b508-77956ccf25aa",
    "https://audio.jukehost.co.uk/019ef4dc-9322-73f0-9731-2c6e0f313ddf",
    "https://audio.jukehost.co.uk/019ef4db-f7a8-72f2-9497-b85cbc3e1f00",
    "https://audio.jukehost.co.uk/019ef4dc-33a4-70be-b428-b197a2cc1020",
    "https://audio.jukehost.co.uk/019ef43d-b8b7-738f-b4c8-1c42c82d6662",
    "https://audio.jukehost.co.uk/019ef43e-08f3-738d-8862-050e3d228f75",
    "https://audio.jukehost.co.uk/019ef43e-0582-717e-bee9-61df91aba528",
    "https://audio.jukehost.co.uk/019ef4db-e6ce-716a-ba30-40678e25db6e",
    "https://audio.jukehost.co.uk/019ef43d-af68-71c9-81fd-2821b8b7e660",
    "https://audio.jukehost.co.uk/019ef4dc-5e40-7346-b834-10e0b13d7222",
    "https://audio.jukehost.co.uk/019ef4dc-6435-73e9-a4b6-3ab55b23494d",
    "https://audio.jukehost.co.uk/019ef43d-f904-70e4-b6b5-202838b3ead6",
    "https://audio.jukehost.co.uk/019ef4dc-458c-736b-8fe9-6c3a0670d253",
    "https://audio.jukehost.co.uk/019ef43e-0b5f-7243-a444-bb13cb591e91",
    "https://audio.jukehost.co.uk/019ef43e-093e-7376-b079-99fe958eb5f5",
    "https://audio.jukehost.co.uk/019ef43e-0681-72f5-96a4-fda5ca83bdb8",
    "https://audio.jukehost.co.uk/019ef43e-01f8-729f-9dbc-a974361698da",
    "https://audio.jukehost.co.uk/019ef43d-a85d-713d-b44b-112c32881ec8",
    "https://audio.jukehost.co.uk/019ef43d-cf25-739d-bd79-1758664c2d33",
    "https://audio.jukehost.co.uk/019ef43d-d10a-72ed-a933-8f13aab6ea86",
    "https://audio.jukehost.co.uk/019ef472-855e-7363-bec9-2904c8fe7b9e",
    "https://audio.jukehost.co.uk/019ef43d-d03c-7134-b2bc-52dbc9af35f0",
    "https://audio.jukehost.co.uk/019ef43e-0bc4-72aa-b9a3-419d37991f0a",
    "https://audio.jukehost.co.uk/019ef4dc-52cf-73a6-a171-29bad33fd67f",
    "https://audio.jukehost.co.uk/019ef4dc-540d-71c7-b062-a44ef29e204c",
    "https://audio.jukehost.co.uk/019ef43d-d0b8-71e8-ac44-ed39775946d7",
    "https://audio.jukehost.co.uk/019ef43e-0610-71c6-b4bc-087e3028cf55",
    "https://audio.jukehost.co.uk/019ef4dc-c3ef-72e3-9bbb-3d96c99a4c1a",
    "https://audio.jukehost.co.uk/019ef4dc-4481-7041-95ba-c955362ecaf5",
    "https://audio.jukehost.co.uk/019ef43d-ccd8-73d7-ab0d-1290abaa7dea",
    "https://audio.jukehost.co.uk/019ef4dc-3de9-700b-8291-f10ce4a6b4a1",
    "https://audio.jukehost.co.uk/019ef4dc-3c91-7105-a4d3-6394dc04bdd4",
    "https://audio.jukehost.co.uk/019ef4dc-340d-7139-b252-96dcbd586dd5",
    "https://audio.jukehost.co.uk/019ef43d-aeb5-71b1-a3d5-ae716694bd8c",
    "https://audio.jukehost.co.uk/019ef43e-04a3-72ed-9c77-142c5551b776",
    "https://audio.jukehost.co.uk/019ef4dc-673f-7037-964d-061e39c8e06b",
    "https://audio.jukehost.co.uk/019ef43d-ce8b-7083-881c-e1f7d726ef3a",
    "https://audio.jukehost.co.uk/019ef4dc-5789-7120-80f4-9d87cf91c2ff",
    "https://audio.jukehost.co.uk/019ef472-f3e6-716a-a7a0-d432cdd9399e",
    "https://audio.jukehost.co.uk/019ef4dc-38ef-711f-ba19-d9215a622a4b",
    "https://audio.jukehost.co.uk/019ef4dc-40a0-702a-bf8a-bbe0b8162c3d",
    "https://audio.jukehost.co.uk/019ef4dc-93e8-73a3-94a0-0d4e7a40674b",
    "https://audio.jukehost.co.uk/019ef43d-88f1-7077-9a6c-902968e09824",
    "https://audio.jukehost.co.uk/019ef472-c651-737a-8184-b3a72a50d57f",
    "https://audio.jukehost.co.uk/019ef4dc-3e34-7016-90ba-724111556a2b",
    "https://audio.jukehost.co.uk/019ef43d-a36c-7171-a8a9-4ed2094aff5f",
    "https://audio.jukehost.co.uk/019ef4db-e786-7058-a111-1e7f7d46452b",
    "https://audio.jukehost.co.uk/019ef43d-b80d-735e-9392-189888457125",
    "https://audio.jukehost.co.uk/019ef43d-b9b8-72db-a23a-2b7ada9cb5b3",
    "https://audio.jukehost.co.uk/019ef43d-d20c-72d1-9f44-f3433e7608b5",
    "https://audio.jukehost.co.uk/019ef43e-0802-71ba-bbcd-d0d3a2f62a25",
    "https://audio.jukehost.co.uk/019ef43e-064b-7103-a36e-f6141a340c61",
    "https://audio.jukehost.co.uk/019ef43d-cf86-7379-bf6b-8681a1073d30",
    "https://audio.jukehost.co.uk/019ef43d-fae7-7175-8429-d6e9665dd917",
    "https://audio.jukehost.co.uk/019ef43e-07aa-73b6-81b4-a29a321e5025",
    "https://audio.jukehost.co.uk/019ef4dc-40f0-73ba-bd1c-08fc2dfb3a3b",
    "https://audio.jukehost.co.uk/019ef473-1daa-712d-ae50-4a462bae8e6d",
    "https://audio.jukehost.co.uk/019ef43d-a471-7048-a30b-e680c4118432",
    "https://audio.jukehost.co.uk/019ef4dc-0a2b-7010-9570-e051cf7eef72",
    "https://audio.jukehost.co.uk/019ef472-ce53-71d1-9bb9-fc9385b31be7",
    "https://audio.jukehost.co.uk/019ef43e-040f-73cc-b2f0-9be5c71ec8d9",
    "https://audio.jukehost.co.uk/019ef43e-029b-71dd-aa2a-34d8b84121fc",
    "https://audio.jukehost.co.uk/019ef43d-abea-7192-b759-5867a7117ee1",
    "https://audio.jukehost.co.uk/019ef43d-cfdf-70df-be2a-6bcab9107130",
    "https://audio.jukehost.co.uk/019ef4dc-c136-723f-9283-a9ce4f2eac0c",
    "https://audio.jukehost.co.uk/019ef43e-0d81-706e-86b8-40e085c0a6f5",
    "https://audio.jukehost.co.uk/019ef4dc-399d-72bc-8130-0cd209f732db",
    "https://audio.jukehost.co.uk/019ef43d-f946-738a-8012-75f811d8f031",
    "https://audio.jukehost.co.uk/019ef472-c551-72dc-95f4-18c2b2d19e26",
    "https://audio.jukehost.co.uk/019ef472-f424-70c2-bd50-e13915851f2e",
    "https://audio.jukehost.co.uk/019ef43d-ced1-7197-9a62-65e1b4d58103",
    "https://audio.jukehost.co.uk/019ef43e-0a9c-700b-bf8c-dfe16bfe4b59",
    "https://audio.jukehost.co.uk/019ef43e-0979-71b1-8a0e-ccc8875442bb",
    "https://audio.jukehost.co.uk/019ef43d-cd7e-7234-9cf8-1719fd3a9218",
    "https://audio.jukehost.co.uk/019ef43e-0192-709a-bfad-1812f217a79e",
    "https://audio.jukehost.co.uk/019ef4db-de2d-7154-84e3-ab0d01ecd0df",
    "https://audio.jukehost.co.uk/019ef43e-035c-738b-b3a9-6c4ee5d42896",
    "https://audio.jukehost.co.uk/019ef473-0a6f-711b-848c-731ea1692c9f",
    "https://audio.jukehost.co.uk/019ef43d-ae57-7340-9369-7fd375813881",
    "https://audio.jukehost.co.uk/019ef43e-0248-7231-8346-664bdc045055",
    "https://audio.jukehost.co.uk/019ef43d-ce32-7096-8b02-6462ba3784ff",
    "https://audio.jukehost.co.uk/019ef43d-972b-71d3-99a1-918efe9fdfdc",
    "https://audio.jukehost.co.uk/019ef43d-b8fc-7119-8408-b9027e9a66cf",
    "https://audio.jukehost.co.uk/019ef43e-04e4-72e6-bb0f-8a3ee5b8a20c",
    "https://audio.jukehost.co.uk/019ef43e-0e75-717f-9fe6-82fa3fefcba9",
    "https://audio.jukehost.co.uk/019ef43e-0148-70c4-a539-94f2e5cbf18f",
    "https://audio.jukehost.co.uk/019ef472-b24a-715e-ac00-de95b23eb7d8",
    "https://audio.jukehost.co.uk/019ef43e-0f72-7333-9d09-33180dbb4e6b",
    "https://audio.jukehost.co.uk/019ef43e-0b19-73ca-a542-9a0fa81f49d1",
    "https://audio.jukehost.co.uk/019ef4dc-8f92-700d-9ff1-b1bbbcccdfdb",
    "https://audio.jukehost.co.uk/019ef4dc-0b64-7141-a6b0-dd272f5532ca",
    "https://audio.jukehost.co.uk/019ef43e-070e-7023-8140-9c64489fdd97",
    "https://audio.jukehost.co.uk/019ef472-aed4-70d1-84fe-9a046daffe60",
    "https://audio.jukehost.co.uk/019ef43d-cd2b-728c-af12-3c25ded1df88",
    "https://audio.jukehost.co.uk/019ef43d-d166-71f8-b79b-53a302108bce",
    "https://audio.jukehost.co.uk/019ef473-19b1-707d-a1c6-2d19c796ef9e",
    "https://audio.jukehost.co.uk/019ef43d-cdd0-711a-9e21-3525862b6cf2",
    "https://audio.jukehost.co.uk/019ef4dc-452f-70b9-81c8-e4f487d0bed1",
    "https://audio.jukehost.co.uk/019ef43e-045e-73e0-9669-50863582e6ca",
    "https://audio.jukehost.co.uk/019ef43e-0754-72c1-8262-5bd95f8451ea",
    "https://audio.jukehost.co.uk/019ef43e-0a3c-70c2-acf1-2004a5b1dcb2",
    "https://audio.jukehost.co.uk/019ef43e-05ba-719e-b36c-49e3b01644e1",
    "https://audio.jukehost.co.uk/019ef43e-03ca-719f-829a-cd22655b96bd",
    "https://audio.jukehost.co.uk/019ef43d-a990-71b6-b5bf-284a5e5205f0",
    "https://audio.jukehost.co.uk/019ef43e-0f25-732e-bc2a-a0fe6a47d0c7",
    "https://audio.jukehost.co.uk/019ef43d-fa2f-73b5-b25f-6609ccf2ee12",
    "https://audio.jukehost.co.uk/019ef43d-d1c5-704b-a890-87a9fb6b425e",
    "https://audio.jukehost.co.uk/019ef43e-0e23-710f-aa39-275ed8b01977",
    "https://audio.jukehost.co.uk/019ef4dc-47c8-72f1-a207-309ce6cc2381",
    "https://audio.jukehost.co.uk/019ef43d-f9d3-719b-bcd8-ab3d99e86f8d",
    "https://audio.jukehost.co.uk/019ef43d-d078-7391-b980-4e6b925c1099",
    "https://audio.jukehost.co.uk/019ef43d-a7af-70da-b095-bd024a707fcc",
    "https://audio.jukehost.co.uk/019ef43d-fa86-73c3-bf76-d283464aac1a",
    "https://audio.jukehost.co.uk/019ef43e-0837-73a5-9544-bf299ad83d5f",
    "https://audio.jukehost.co.uk/019ef472-dc5c-7349-98bb-abf6ba393cd2",
    "https://audio.jukehost.co.uk/019ef4db-f328-7398-aa67-f5fa1590f815",
    "https://audio.jukehost.co.uk/019ef477-0023-7322-923c-9cbe017d0f4e",
    "https://audio.jukehost.co.uk/019ef47e-0a0d-7215-a0f2-f16d8ef62722",
    "https://audio.jukehost.co.uk/019ef473-323e-734e-b849-4cd3882003cd",
    "https://audio.jukehost.co.uk/019ef473-2d44-73b2-acd3-d2ca0f433945",
    "https://audio.jukehost.co.uk/019ef47c-c01d-715f-bfa5-59a499fb825a",
    "https://audio.jukehost.co.uk/019ef473-71b8-738c-9283-250e99b54aba",
    "https://audio.jukehost.co.uk/019ef473-3d1e-714f-9908-6a50c9a2fbbe",
    "https://audio.jukehost.co.uk/019ef472-fcd2-7377-820f-804cc9abfbdc",
    "https://audio.jukehost.co.uk/019ef47c-c06e-7191-a2b6-18ba19198ce0",
    "https://audio.jukehost.co.uk/019ef473-4a83-708d-b6fa-c95632d05550",
    "https://audio.jukehost.co.uk/019ef473-6790-72c8-bae0-6bd518dbbc48",
    "https://audio.jukehost.co.uk/019ef473-36a3-735d-8be0-e684e5babb56",
    "https://audio.jukehost.co.uk/019ef4dc-49b1-7392-b452-a860600e7a33",
    "https://audio.jukehost.co.uk/019ef473-485d-70cb-b971-c8c8e39ff146",
    "https://audio.jukehost.co.uk/019ef473-4262-7341-8b4b-58f9443e5b2e",
    "https://audio.jukehost.co.uk/019ef47c-3514-710a-a016-db954e4f8c7b",
    "https://audio.jukehost.co.uk/019ef47c-34e5-7276-9b54-1b2aecb6cdb5",
    "https://audio.jukehost.co.uk/019ef47c-34e5-7242-821e-9a6a09e5956e",
    "https://audio.jukehost.co.uk/019f494f-92cb-7384-8188-d50b0905cdc1",
    "https://audio.jukehost.co.uk/019ef473-2870-72c8-a9b2-bef1b5d2ee0c",
    "https://audio.jukehost.co.uk/019ef473-38f0-70fe-8389-f67051f896ce",
    "https://audio.jukehost.co.uk/019ef473-3b41-713b-9d06-ad0d2247b233",
    "https://audio.jukehost.co.uk/019ef473-7010-71e2-9c12-d8b20ad0f7e0",
    "https://audio.jukehost.co.uk/019ef473-469f-708e-95ee-63e2ab4dd5a1",
    "https://audio.jukehost.co.uk/019ef473-1104-7192-a73b-2f6a6edada9d",
    "https://audio.jukehost.co.uk/019ef473-34d3-7085-97c0-fe2c876d8cbb",
    "https://audio.jukehost.co.uk/019ef472-a5c1-722b-9400-56b9758203c4",
    "https://audio.jukehost.co.uk/019ef47b-93f0-7075-8338-673a3c1c9cca",
    "https://audio.jukehost.co.uk/019ef473-2155-71a8-b663-3acb92a60db5",
    "https://audio.jukehost.co.uk/019ef47b-93bd-7336-9649-fa5dbbf6a6cb",
    "https://audio.jukehost.co.uk/019ef47b-93bd-7115-ab97-9676bc9a9bf2",
    "https://audio.jukehost.co.uk/019ef473-42aa-715c-aeb0-688f2b0331c9",
    "https://audio.jukehost.co.uk/019ef473-28f4-7354-8df5-9bbf2e683f76",
    "https://audio.jukehost.co.uk/019ef472-ba7f-708d-bd34-1b38d056ffe6",
    "https://audio.jukehost.co.uk/019ef473-4b03-73bf-b46a-ee811200244a",
    "https://audio.jukehost.co.uk/019ef472-d985-7308-9131-5ccca2d56c73",
    "https://audio.jukehost.co.uk/019ef473-24da-7027-8f4e-f6965bd78980",
    "https://audio.jukehost.co.uk/019ef473-09b9-7345-8689-6d4afd927d7b",
    "https://audio.jukehost.co.uk/019ef47e-d204-7268-b903-f91087ae0ce5",
    "https://audio.jukehost.co.uk/019ef473-3b8d-7298-aa4b-d328bc188ab1",
    "https://audio.jukehost.co.uk/019ef478-47b1-7371-b388-f3595630a116",
    "https://audio.jukehost.co.uk/019ef473-4656-72a6-b342-dc203f352af7",
    "https://audio.jukehost.co.uk/019ef478-45de-724c-b35a-ce5795faa1ff",
    "https://audio.jukehost.co.uk/019ef47e-d21f-737e-89e8-4a5bb9da1f13",
    "https://audio.jukehost.co.uk/019ef473-7010-7386-bd4f-78ac4e0da9d2",
    "https://audio.jukehost.co.uk/019ef473-66f1-7097-80ee-075f9cba17d5",
    "https://audio.jukehost.co.uk/019ef473-37b1-72a5-b418-3a8bdc3b831e",
    "https://audio.jukehost.co.uk/019ef473-49fd-73e9-b3cf-88c58897304b",
    "https://audio.jukehost.co.uk/019ef472-fa61-7279-8da7-a1fe6ee81199",
    "https://audio.jukehost.co.uk/019ef472-b809-7383-bb5f-88f2e02e8bd8",
    "https://audio.jukehost.co.uk/019ef473-121d-70e7-8b45-b368fe6788aa",
    "https://audio.jukehost.co.uk/019ef473-0154-7377-a2f5-b86f0ee62f83",
    "https://audio.jukehost.co.uk/019ef47d-c4e3-7282-8890-9b1c3e18ef86",
    "https://audio.jukehost.co.uk/019ef473-1aba-72c2-9efe-dfb9c09ea474",
    "https://audio.jukehost.co.uk/019ef472-e3cc-705d-9853-1f34d8d8dcc7",
    "https://audio.jukehost.co.uk/019ef473-2e66-738c-a003-89e32b9ace5d",
    "https://audio.jukehost.co.uk/019ef472-bd81-7313-9836-ff7ff5d9e24f",
    "https://audio.jukehost.co.uk/019ef473-25a7-70cd-9713-8390495360de",
    "https://audio.jukehost.co.uk/019ef472-bb11-71b8-8e7f-73aab5560178",
    "https://audio.jukehost.co.uk/019ef472-e6db-73e1-8c22-d5f0e78c0814",
    "https://audio.jukehost.co.uk/019ef473-0dc1-73dd-96fc-e0966590fff3",
    "https://audio.jukehost.co.uk/019ef472-a779-738a-869c-5c0615aa15e7",
    "https://audio.jukehost.co.uk/019ef472-e472-72b1-8657-7108cefb6298",
    "https://audio.jukehost.co.uk/019ef473-1f64-739b-9f3b-bbfe8ceda09b",
    "https://audio.jukehost.co.uk/019ef472-c00f-7319-a20e-0e2a5f91a5ce",
    "https://audio.jukehost.co.uk/019ef472-cc65-70f6-a17c-79017e5eeece",
    "https://audio.jukehost.co.uk/019ef473-053b-736f-9b3f-a4228057195b",
    "https://audio.jukehost.co.uk/019ef472-c504-70a2-ac72-865d12575584",
    "https://audio.jukehost.co.uk/019ef472-debf-7148-8852-081b4679a5f7",
    "https://audio.jukehost.co.uk/019ef4dc-3aa7-720a-be29-7a6b27930450",
    "https://audio.jukehost.co.uk/019ef472-dd0b-72c0-a1c5-65160441c557",
    "https://audio.jukehost.co.uk/019ef472-b6f8-701b-ad13-bbb679d7331b",
    "https://audio.jukehost.co.uk/019ef473-0615-7386-a13e-a66a1fe1bd58",
    "https://audio.jukehost.co.uk/019ef472-e4f4-71b4-925a-403c7647a414",
    "https://audio.jukehost.co.uk/019ef473-0961-7335-9557-f54b8aa4872c",
    "https://audio.jukehost.co.uk/019ef473-0961-7335-9557-f54b8aa4872c",
    "https://audio.jukehost.co.uk/019ef472-d1c1-72cc-9606-6e1321ce912a",
    "https://audio.jukehost.co.uk/019ef472-c920-719e-ab94-3561c46bd74a",
    "https://audio.jukehost.co.uk/019ef472-e07b-7177-8ac2-a0b61a030bec",
    "https://audio.jukehost.co.uk/019ef473-3e8d-72a7-bd01-5923c8634aa2",
    "https://audio.jukehost.co.uk/019ef472-7b9b-7332-91e8-5e710820a23e",
    "https://audio.jukehost.co.uk/019ef472-e81d-7163-b8f3-3495fc2417b9",
    "https://audio.jukehost.co.uk/019ef4dc-4143-716c-9e7f-691eec6c567a",
    "https://audio.jukehost.co.uk/019ef472-d173-715f-b9b2-6c0e7630e2a4",
    "https://audio.jukehost.co.uk/019ef472-f02f-7346-b736-325b9bc5cf3c",
    "https://audio.jukehost.co.uk/019ef472-a747-7086-aa00-cc7a3fc2576a",
    "https://audio.jukehost.co.uk/019ef472-e864-70b5-9a40-7b5220129328",
    "https://audio.jukehost.co.uk/019ef472-e0c3-739f-982d-fb8f84f84e8b",
    "https://audio.jukehost.co.uk/019ef472-c1b8-71f8-97e1-098ca7f8a0f6",
    "https://audio.jukehost.co.uk/019ef47d-288e-71de-a2de-604d61014358",
    "https://audio.jukehost.co.uk/019ef473-0ecb-71c9-9ab9-a7ca10463393",
    "https://audio.jukehost.co.uk/019ef472-be61-70bd-b36b-00d572a0bf3e",
    "https://audio.jukehost.co.uk/019ef472-fcd2-7377-820f-804cc9abfbdc",
    "https://audio.jukehost.co.uk/019ef473-3000-713d-be8b-6231ebed44e9",
    "https://audio.jukehost.co.uk/019ef4db-f285-71c7-a4af-36cfa7b8b6ce",
    "https://audio.jukehost.co.uk/019ef473-2368-7304-a7c8-b17ae98168b6",
    "https://audio.jukehost.co.uk/019ef472-d433-707f-881d-1e22521b927c",
    "https://audio.jukehost.co.uk/019ef473-24a2-7269-8725-eaa54b2efb16",
    "https://audio.jukehost.co.uk/019ef472-db58-72ae-b9f3-d6333cfffbcc",
    "https://audio.jukehost.co.uk/019ef473-00cc-718b-b033-de7ca9398d78",
    "https://audio.jukehost.co.uk/019ef473-1cb3-71b6-8f00-45ee726d7c0e",
    "https://audio.jukehost.co.uk/019ef472-fdc4-71fa-a757-ccb491d9145f",
    "https://audio.jukehost.co.uk/019ef472-d936-732b-bb67-669190771161",
    "https://audio.jukehost.co.uk/019ef472-fe77-71cc-937e-88c35de08c5f",
    "https://audio.jukehost.co.uk/019ef472-f632-7314-a2d0-eded89159dfb",
    "https://audio.jukehost.co.uk/019ef472-d0cc-70eb-b5df-84cb9283d9b3",
    "https://audio.jukehost.co.uk/019ef472-f576-7133-8503-155e07c61f86",
    "https://audio.jukehost.co.uk/019ef657-5118-738d-8964-34ebc8310883",
    "https://audio.jukehost.co.uk/019ef472-ebf8-72e4-94d1-5c7ad1699904",
    "https://audio.jukehost.co.uk/019ef472-a5c1-722b-9400-56b9758203c4",
    "https://audio.jukehost.co.uk/019ef473-207e-72af-8439-763ee712a11c",
    "https://audio.jukehost.co.uk/019ef472-c7bd-739d-a5e4-59d06ec9dd9b",
    "https://audio.jukehost.co.uk/019ef472-efc9-72c9-9a59-cf777fb8fc08",
    "https://audio.jukehost.co.uk/019ef472-855e-7363-bec9-2904c8fe7b9e",
    "https://audio.jukehost.co.uk/019ef472-f1ed-730e-9826-4dc95f27c7c1",
    "https://audio.jukehost.co.uk/019ef472-d82a-73d5-a97f-283cbe506218",
    "https://audio.jukehost.co.uk/019ef473-2155-71a8-b663-3acb92a60db5",
    "https://audio.jukehost.co.uk/019ef4db-a375-7397-8fb8-939d4d71518e",
    "https://audio.jukehost.co.uk/019ef4db-ac76-70bc-9dcb-16d8e713af32",
    "https://audio.jukehost.co.uk/019ef4dc-404f-7339-a898-d65884c9fc54",
    "https://audio.jukehost.co.uk/019ef4dc-63f9-7190-b072-42985ff88f5e",
    "https://audio.jukehost.co.uk/019ef4db-ce56-71fa-8295-6e378afc7f8a",
    "https://audio.jukehost.co.uk/019ef4db-d161-703d-877d-e02dbc12e453",
    "https://audio.jukehost.co.uk/019ef4dc-6032-70a6-bc12-a3bff851c8ec",
    "https://audio.jukehost.co.uk/019ef4dc-3fb1-73c7-858f-8dd085100a15",
    "https://audio.jukehost.co.uk/019ef4dc-34b7-72c6-8004-8a4bb69e7575",
    "https://audio.jukehost.co.uk/019ef4db-ff0a-7249-aac2-630c0d99a2da",
    "https://audio.jukehost.co.uk/019ef4dc-3935-7065-84f6-170bd37418ff",
    "https://audio.jukehost.co.uk/019ef4dc-38a9-73de-83a5-fcfed7a56cb4",
    "https://audio.jukehost.co.uk/019ef4dc-3e82-730f-94f4-b7e01c65a66a",
    "https://audio.jukehost.co.uk/019ef4dc-3f60-72b3-b2ef-2f3fd696c219",
    "https://audio.jukehost.co.uk/019ef657-52a0-70b1-828a-a0b4afe829ab",
    "https://audio.jukehost.co.uk/019ef4dc-4143-716c-9e7f-691eec6c567a",
    "https://audio.jukehost.co.uk/019ef4db-ec43-7294-aafc-d1bd9511b77e",
    "https://audio.jukehost.co.uk/019ef657-9749-705d-b64b-357c7cadb7d1",
    "https://audio.jukehost.co.uk/019ef657-794d-713a-a088-98589afd49ad",

    
    ]
  },

  fundaovibe: {
    arquivos: [
   "https://audio.jukehost.co.uk/019ef4dc-35c5-7063-bb74-8799f1511a0c",
   "https://audio.jukehost.co.uk/019ef4dc-4d55-7061-abe3-27c470e10c29",
   "https://audio.jukehost.co.uk/019ef4dc-427f-709c-8c49-da8be7bf0d6b",
   "https://audio.jukehost.co.uk/019ef4db-e87f-7156-b72a-4d48b6cda26a",
   "https://audio.jukehost.co.uk/019ef4db-e44d-735f-bc74-8aab85c3a253",
   "https://audio.jukehost.co.uk/019ef4dc-c28d-736b-953f-51e11180eb39",
   "https://audio.jukehost.co.uk/019ef657-af74-7336-9a29-031c11c0658a",
   "https://audio.jukehost.co.uk/019ef657-9d3f-7355-b8ee-40cb10fe9895",
   "https://audio.jukehost.co.uk/019ef657-60f9-7130-a65a-6431bcb65662",
   "https://audio.jukehost.co.uk/019ef657-a4bd-7398-a465-0ad608cb7836",
   "https://audio.jukehost.co.uk/019ef657-9c0d-7135-a819-55ae96315d48",
   "https://audio.jukehost.co.uk/019ef657-9bb3-71cc-b5fc-81ec54e883dd",
   "https://audio.jukehost.co.uk/019ef657-9b0a-7326-a12c-9d57bd5b4480",
   "https://audio.jukehost.co.uk/019ef657-96fa-72eb-b9e3-d68b01a90e48",
   "https://audio.jukehost.co.uk/019ef657-5160-7299-a340-f6eb3e5c15d2",
   "https://audio.jukehost.co.uk/019ef65f-b214-734c-83b3-f28ac4680863",
   "https://audio.jukehost.co.uk/019ef657-54e0-71ce-a28a-49c8ea9bd543",
   "https://audio.jukehost.co.uk/019ef657-51a1-710f-b737-87a4433ed3b7",
   "https://audio.jukehost.co.uk/019ef657-5368-7332-b642-f055d06c11ba",
   "https://audio.jukehost.co.uk/019ef657-51d1-728f-a842-171c4de0f210",
   "https://audio.jukehost.co.uk/019ef661-0092-720c-9946-54584821b8ba",
   "https://audio.jukehost.co.uk/019ef657-52a0-70b1-828a-a0b4afe829ab",
   "https://audio.jukehost.co.uk/019ef661-0085-70bd-b6de-aaa6f0e6b424",
   "https://audio.jukehost.co.uk/019ef659-e578-7258-af3b-62e2d1b69b4d",
   "https://audio.jukehost.co.uk/019ef657-7a9d-715b-a997-ada46a453ae3",
   "https://audio.jukehost.co.uk/019ef661-0098-72b5-b7ac-7d4bec37afc5",
   "https://audio.jukehost.co.uk/019ef657-4e6d-7393-989d-e1437d8085ba",
   "https://audio.jukehost.co.uk/019ef657-4eb5-7263-9892-c3c662f92a3e",
   "https://audio.jukehost.co.uk/019ef657-4e36-73b8-9c2b-9d891e028c60",
   "https://audio.jukehost.co.uk/019ef657-4eee-7215-b6cf-92e120cfd58f",
   "https://audio.jukehost.co.uk/019ef657-53c4-7339-a071-f41df4ab442a",
   "https://audio.jukehost.co.uk/019ef657-4e3c-71cf-8a21-fb7c853390da",
   "https://audio.jukehost.co.uk/019ef657-4ead-71d4-8855-0a4b6cc36672",
   "https://audio.jukehost.co.uk/019ef657-4f2a-73c7-b131-074b7bfd93f9",
   "https://audio.jukehost.co.uk/019ef657-9995-7353-b84b-a5651823eabb",
   "https://audio.jukehost.co.uk/019ef657-4ee4-70e2-b72b-5a248d9b109d",
   "https://audio.jukehost.co.uk/019ef657-4f77-7299-b6e1-19f0aa85148e",
   "https://audio.jukehost.co.uk/019ef657-5cd2-71a9-bdfb-2841e8dbe4a8",
   "https://audio.jukehost.co.uk/019ef657-5008-7221-be42-f14573b2c2a3",
   "https://audio.jukehost.co.uk/019ef65a-7fd0-700d-b4ce-b0113c9031d7",
   "https://audio.jukehost.co.uk/019ef657-5428-7123-b51b-dcaf3fab548f",
   "https://audio.jukehost.co.uk/019ef65c-3dcd-73b8-befc-812cfd0b699c",
   "https://audio.jukehost.co.uk/019ef659-9f30-735b-b477-a1f065b2f9cd",
   "https://audio.jukehost.co.uk/019ef657-50d8-72e5-a436-94ca3079e07b",
   "https://audio.jukehost.co.uk/019ef657-4cf0-7308-82a9-3299ba9603ca",
   "https://audio.jukehost.co.uk/019ef657-9e76-731a-aee0-dfffc630a311",
   "https://audio.jukehost.co.uk/019ef657-7977-715b-84b8-0a8e0295d5bd",
   "https://audio.jukehost.co.uk/019ef657-a42f-70d3-8a82-f08e2b33c4ff",
   "https://audio.jukehost.co.uk/019ef657-9627-7170-b058-bfc568e74d64",
   "https://audio.jukehost.co.uk/019ef657-9b56-7211-9c5b-2eb47793c469",
   "https://audio.jukehost.co.uk/019ef657-9a55-71d0-a85d-a5a7482188ed",
   "https://audio.jukehost.co.uk/019ef657-a87a-7252-8f44-912f55640dec",
   "https://audio.jukehost.co.uk/019ef657-7a5d-73d8-af3b-c88420e0c1f8",
   "https://audio.jukehost.co.uk/019ef657-794d-713a-a088-98589afd49ad",
   "https://audio.jukehost.co.uk/019ef657-a696-7149-b7ed-d154dc8948e0",
   "https://audio.jukehost.co.uk/019ef657-7999-7319-b228-697ee5c2b34a",
   "https://audio.jukehost.co.uk/019ef657-9e10-72c3-838f-d52f696dce04",
   "https://audio.jukehost.co.uk/019ef657-97bf-70a9-bc20-5174d6830ecd",
   "https://audio.jukehost.co.uk/019ef657-70b5-7016-822b-f7ceacb14302",
   "https://audio.jukehost.co.uk/019ef657-62fb-716b-a06c-8e6359c57ff2",
   "https://audio.jukehost.co.uk/019ef657-7106-7361-9425-b4b063608372",
   "https://audio.jukehost.co.uk/019ef657-79f4-724c-8634-f2c878d388b9",
   "https://audio.jukehost.co.uk/019ef657-98b0-7359-a329-fe86e63e7867",
   "https://audio.jukehost.co.uk/019ef657-9f64-70c4-bed7-65e4454c6b4b",
   "https://audio.jukehost.co.uk/019ef657-95d1-7097-a4d0-83e08f68951c",
   "https://audio.jukehost.co.uk/019ef657-9cd7-71f0-bbb3-11d059c3850c",
   "https://audio.jukehost.co.uk/019ef657-9d3f-7355-b8ee-40cb10fe9895",
   "https://audio.jukehost.co.uk/019ef657-9a00-70a6-894c-a008965637d7",
   "https://audio.jukehost.co.uk/019ef657-9c78-720a-877c-223e54e31d28",
   "https://audio.jukehost.co.uk/019ef657-6263-7289-9765-fa2a26b66706",
   "https://audio.jukehost.co.uk/019ef657-9861-71d4-9313-600f6a925b19",
   "https://audio.jukehost.co.uk/019ef657-9909-73c7-a8ec-63d1f3426e80",
   "https://audio.jukehost.co.uk/019ef657-994f-73bf-9134-c5f85c3cfd90",
   "https://audio.jukehost.co.uk/019ef657-71dc-7236-b735-5749c12ca440",
   "https://audio.jukehost.co.uk/019ef657-9edb-73bb-baad-d1183500d05d",
   "https://audio.jukehost.co.uk/019ef657-a3db-71ec-845c-bf60cacb5d50",
   "https://audio.jukehost.co.uk/019ef657-6b74-734d-9107-32c8ae372d90",
   "https://audio.jukehost.co.uk/019ef657-6b74-734d-9107-32c8ae372d90",
   "https://audio.jukehost.co.uk/019ef657-9749-705d-b64b-357c7cadb7d1",
   ""


    ]
  },

    chilldrive: {
    arquivos: [
      "https://audio.jukehost.co.uk/019ef676-ce6f-711e-92b5-5532c93a9c65",
      "https://audio.jukehost.co.uk/019ef676-d220-71b9-aca9-4d49622252a8",
      "https://audio.jukehost.co.uk/019ef676-e559-7218-b067-4d202317822d",
      "https://audio.jukehost.co.uk/019ef676-e107-7203-acb7-9a21ac2db3b5",
      "https://audio.jukehost.co.uk/019ef676-e849-72e8-809b-7953114e4106",
      "https://audio.jukehost.co.uk/019ef676-d06a-728b-be80-504cf746248e",

 
    ]
  },

  grove: {
    arquivos: [
    "https://audio.jukehost.co.uk/019f005b-b633-7141-a0be-1d209ea8a850",
    "https://audio.jukehost.co.uk/019f005e-57c6-72ba-aa1c-24d04f3817ee",
    "https://audio.jukehost.co.uk/019f005f-15ea-7212-87fd-27ab975f8b41",
    "https://audio.jukehost.co.uk/019f005e-6efc-7227-8e05-2ac9f8764c13",
    "https://audio.jukehost.co.uk/019f005d-a12e-73e4-a180-99498a69acf6",
    "https://audio.jukehost.co.uk/019f005e-c286-7106-a6ef-0a924d43fb51",
    "https://audio.jukehost.co.uk/019f005c-92ab-71cf-9f32-b26eb24ece15",
    "https://audio.jukehost.co.uk/019f005c-6655-7121-9415-b1325eae2ad7",
    "https://audio.jukehost.co.uk/019f005e-18bf-7212-b371-378eee699109",
    "https://audio.jukehost.co.uk/019f005c-ee8c-72f5-97ff-ba964a51070e",
    "https://audio.jukehost.co.uk/019f005d-96a6-700d-ba19-40afe12e3a8e",
    "https://audio.jukehost.co.uk/019f005c-58b9-71e3-afd2-dbfb606e53b2",
    "https://audio.jukehost.co.uk/019f005e-029c-7033-912a-0936abc8e554",
    "https://audio.jukehost.co.uk/019f005d-bafd-712a-bc4f-6fc03a6093ac",
    "https://audio.jukehost.co.uk/019f005c-a1d5-70b7-a828-be4a6ee888ab",
    "https://audio.jukehost.co.uk/019f005c-a1d5-70b7-a828-be4a6ee888ab",
    "https://audio.jukehost.co.uk/019f005f-33f5-7078-8381-a26f26291b73",
    "https://audio.jukehost.co.uk/019f005e-47dc-7289-8f89-be5727cfff26",
    "https://audio.jukehost.co.uk/019f005c-55ec-735e-820c-e92c1db31c6f",
    "https://audio.jukehost.co.uk/019f005c-ec84-70a5-b6df-b0d8e3838061",
    "https://audio.jukehost.co.uk/019f005d-58d6-7036-a40b-e25d8ea54f59",
    "https://audio.jukehost.co.uk/019f005e-9b34-71ce-b23f-1c0e7f6932e1",
    "https://audio.jukehost.co.uk/019f005e-f7a5-72ba-87e5-f955719c8431",
    "https://audio.jukehost.co.uk/019f005d-eb48-73ed-8f12-d8c79ca055fa",
    "https://audio.jukehost.co.uk/019f005d-4636-7207-b4c5-fd570cbf22e4",
    "https://audio.jukehost.co.uk/019f005e-ce67-72e3-9e05-352e2bbf2159",
    "https://audio.jukehost.co.uk/019f005b-7d5f-710d-8cde-73def1c2413f",
    "https://audio.jukehost.co.uk/019f005b-779a-7392-886b-bd254fa64440",
    "https://audio.jukehost.co.uk/019f005b-dcdf-73c4-860c-63a6d78623a2",
    "https://audio.jukehost.co.uk/019f005b-865e-720f-9c62-aaa0042ec9ee",
    "https://audio.jukehost.co.uk/019f005b-e966-72cf-9a6c-15ad495bce89",
    "https://audio.jukehost.co.uk/019f005b-974f-70d4-9d44-46341ea1c8d8",
    "https://audio.jukehost.co.uk/019f005b-daa0-7003-926b-feb89d638ebb",
    "https://audio.jukehost.co.uk/019f005b-c735-70af-87a5-a1ec648555d9",

    ]
  },

  night: {
    arquivos: [
    "https://audio.jukehost.co.uk/019efed9-1074-7328-b2b5-f21d39b30684",
    "https://audio.jukehost.co.uk/019efed8-e011-7086-96d0-6c7dc473c5cb",
    "https://audio.jukehost.co.uk/019efed9-0b1b-72ea-95ca-ee11ca07b567",
    "https://audio.jukehost.co.uk/019efed9-0df4-73bd-9aad-1963789b566d",
    "https://audio.jukehost.co.uk/019efed9-0c29-725a-9cf4-16246b5b6b5f",
    "https://audio.jukehost.co.uk/019efed9-0cce-733a-9375-84a54136f7a8",
    "https://audio.jukehost.co.uk/019efed9-0ec9-7369-a55c-de27a4a32ed6",
    "https://audio.jukehost.co.uk/019efed9-0b8a-7125-b845-0c88941e051d",
    "https://audio.jukehost.co.uk/019efed9-0e64-7175-af99-fbeca419c95a",
    "https://audio.jukehost.co.uk/019efed9-0fa4-7126-93a0-33f6a5870a5a",
    "https://audio.jukehost.co.uk/019efed8-e339-714a-977e-3f88ee1aea5f",
    "https://audio.jukehost.co.uk/019efed9-0c6e-7251-ae1c-f37a90a40535",
    "https://audio.jukehost.co.uk/019efed9-100b-7338-9ed6-1a64fd2808d3",
    "https://audio.jukehost.co.uk/019efed9-0f39-7307-8590-33be4c4c04b3",
    "https://audio.jukehost.co.uk/019efed9-0911-717b-ace6-69cf6c5e2dd4",
    "https://audio.jukehost.co.uk/019efed9-0d72-711d-a0b2-b2b718ac9f38",
    "https://audio.jukehost.co.uk/019efed9-0a61-7347-82e8-924d9685f619",
    "https://audio.jukehost.co.uk/019efed9-38d2-7102-bd22-50e9977719cf",
    "https://audio.jukehost.co.uk/019efed8-dcb1-736e-ab33-bfc19b1d0021",
    "https://audio.jukehost.co.uk/019efed8-db99-7088-974e-5d342d7f50b7",
    "https://audio.jukehost.co.uk/019efed8-e5ed-73b0-bea7-77c4628b0a74",
    "https://audio.jukehost.co.uk/019efed9-0b1b-72ea-95ca-ee11ca07b567",
    "https://audio.jukehost.co.uk/019efed9-1142-72ee-a2dd-30d1ed6ee66c",
    "https://audio.jukehost.co.uk/019efed9-11b0-7024-b3b1-459adc95d30a",

    
    ]
  },

  forest: {
    arquivos: [
    "https://audio.jukehost.co.uk/019eff77-8afe-73f5-99f4-91c8d9fe5177",
    "https://audio.jukehost.co.uk/019eff77-796d-7297-9f36-295f573a5fcb",
    "https://audio.jukehost.co.uk/019eff77-2dfd-70c0-bf51-b753963cacb2",
    "https://audio.jukehost.co.uk/019eff77-7b63-715b-9b32-153034c9eeab",
    "https://audio.jukehost.co.uk/019eff77-82aa-73d5-b658-f40286a891e5",
    "https://audio.jukehost.co.uk/019eff77-75b9-7103-aa01-a076809683d7",
    "https://audio.jukehost.co.uk/019eff77-86c2-710c-8f0e-c2794bb4fb14",
    "https://audio.jukehost.co.uk/019eff77-16ab-7022-ae08-19d3f12ac8ed",
    "https://audio.jukehost.co.uk/019eff77-bf6d-7198-9eb3-3c32e43d0f04",
    "https://audio.jukehost.co.uk/019eff77-ae59-7202-8c6e-0e20f8a0c3e7",
    "https://audio.jukehost.co.uk/019eff77-3985-7133-b10b-145b252d18f9",
    "https://audio.jukehost.co.uk/019eff77-77bf-702a-9c6b-997af4b8e9f8",
    "https://audio.jukehost.co.uk/019eff77-2c58-72c9-b06f-8db059fad90d",
    "https://audio.jukehost.co.uk/019eff77-9252-73b8-8b5f-06eee52005b9",
    "https://audio.jukehost.co.uk/019eff77-88f1-7296-a495-3f577d5fc11c",
    "https://audio.jukehost.co.uk/019eff77-84a8-73d8-888e-822cb1addb7f",
    "https://audio.jukehost.co.uk/019eff77-b016-72ec-8dd3-9e0696ddadb9",
    "https://audio.jukehost.co.uk/019eff76-f491-7233-8d67-3cf638e98c7d",
    "https://audio.jukehost.co.uk/019eff76-c852-71c0-8989-77d9af7d709a",
    "https://audio.jukehost.co.uk/019eff76-c9ee-723c-866b-6e9f7fbb7ca7",
    "https://audio.jukehost.co.uk/019eff7b-e1db-73ab-9e77-8390ddb73b4a",
    "https://audio.jukehost.co.uk/019eff76-eca2-726b-993f-29cc5893d572",


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

  // Ajuste pedido:
  // - Domingo: baladavibe 21h até 00h (na prática: 21h-23:59)
  // - Segunda a sexta: rootsvibe 18h-19h
  // - Segunda a sexta: baladavibe 19h-02h

  // Domingo 21h-23:59 => baladavibe
  if (day === 0 && h >= 21 && h <= 23) {
    return "baladavibe";
  }

  // Seg-Sex
  if (day >= 1 && day <= 5) {
    // 18h-19h => rootsvibe
    if (h >= 18 && h < 19) {
      return "rootsvibe";
    }

    // 19h-02h => baladavibe
    if (h >= 19 || h < 2) {
      return "baladavibe";
    }
  }

  // 02h-04h
  if (h >= 2 && h < 4) {
    return "lofi";
  }

  // 04h-06h
  if (h >= 4 && h < 6) {
    return "chilldrive";
  }

  // 06h-08h
  if (h >= 6 && h < 8) {
    return "fundaovibe";
  }

  // 08h-12h
  if (h >= 8 && h < 12) {
    return "hitsvibe";
  }

  // 12h-14h
  if (h >= 12 && h < 14) {
    return "lofi";
  }

  // 14h-17h
  if (h >= 14 && h < 17) {
    return "hitsvibe";
  }

  // 17h-18h
  if (h >= 17 && h < 18) {
    return "fundaovibe";
  }

  // resto
  return "hitsvibe";
}

// ==============================
// ESTADO DA RÁDIO (por fase)
// ==============================
let indexMusicaNaFase = 0; // incrementa quando uma música termina

function getArquivosDaPasta(nomePasta) {
  return PASTAS[nomePasta]?.arquivos || [];
}

function estaNoHorarioPsy() {
  // PSY fica em: grove/night/forest conforme getPastaInicialPorHorario()
  const pasta = getPastaInicialPorHorario();
  return pasta === 'grove' || pasta === 'night' || pasta === 'forest';
}

function pickVinhetaAleatoria() {
  const vinhetas = getArquivosDaPasta('vibezonefm');
  if (!vinhetas || !vinhetas.length) return null;
  const i = Math.floor(Math.random() * vinhetas.length);
  return vinhetas[i];
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

function withCacheBust(src) {
  try {
    const ts = Date.now();
    // preserva querystring existente
    return src + (src.includes('?') ? '&' : '?') + 'cb=' + ts;
  } catch {
    return src;
  }
}

async function tocarMusica(src) {
  if (!src) {
    console.warn("Nenhuma música encontrada");
    return;
  }
  if (!playerEl) return;

  // Cloudinary + HTTP/2 pode falhar quando reaproveita conexão/cache.
  // Para forçar novo request do MP3 quando trocamos faixa (ou ao retomar após erro),
  // usamos cache-bust.
  const finalSrc = withCacheBust(src);

  // Troca o src somente se necessário
  if (playerEl.src !== finalSrc) {
    playerEl.src = finalSrc;
  }


  try {
    // Evita múltiplos play() sobrepostos via locks globais.
    if (!playPending) {
      playPending = true;
    }

    await playerEl.play();
    tocando = true;
    console.log("🎵 Tocando:", pastaAtual);
  } catch (e) {
    console.log("Erro ao tocar:", e);
    tocando = false;

    // se falhou por concorrência/pause, liberamos rapidamente o flag de playPending.
    // (o lock principal é controlado por tocarRadio())
    // Não setamos playPending=false aqui para não quebrar token/lock do clique.
  }
}


// ==============================
// PRÓXIMA MÚSICA
// ==============================

async function proximaMusica() {
  // Evita loops/duplicidade se `ended` disparar mais de uma vez.
  if (proximoPending) return;
  // Não avança playlist enquanto play/pause estão no meio do caminho.
  if (playPending) return;
  proximoPending = true;


  try {
    // fase atual pelo horário
    const pastaHorario = getPastaInicialPorHorario();
    if (pastaHorario !== pastaAtual) {
      pastaAtual = pastaHorario;
      indexMusicaNaFase = 0;
      console.log("📅 Mudando programação para:", pastaAtual);
      ultimaMusicaSrc = null; // ao mudar de fase, não força anti-repetição do src anterior

      // Ao trocar programação/pasta fora do período PSY,
      // tocar 1 vinheta aleatória antes da primeira música.
      if (!estaNoHorarioPsy()) {
        vinhetaPendente = true;
      } else {
        vinhetaPendente = false;
      }
    }


    // Se a programação mudou, tocar 1 vinheta aleatória antes da 1ª música (fora do período PSY)
    if (vinhetaPendente && !estaNoHorarioPsy()) {
      const vinheta = pickVinhetaAleatoria();
      vinhetaPendente = false;
      if (vinheta) {
        ultimaMusicaSrc = null; // evita anti-repetição da música por causa da vinheta
        await tocarMusica(vinheta);
        atualizarBtnAgora();
        return;
      }
    }

    // Vinheta vibezonefm a cada 1h (somente entre músicas)
    // - não interrompe música (executa antes de tocar próxima)
    // - baseada no timestamp da última vinheta
    // - desabilitada completamente aos sábados
    if (!estaNoHorarioPsy()) {
      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Belem" })
      );

      const day = now.getDay(); // 0=Dom, 6=Sáb

      const pastaHorario = getPastaInicialPorHorario();

      // mantém contagem por “programa ativo” (evita disparar de hora em hora ao mudar de pasta)
      // e só roda quando a programação/pasta atual é a mesma que a última vinheta.
      const pastaKey = pastaHorario || "";

      if (day !== 6) {
        const podeDispararHora = (
          !ultimaVinhetaHoraTs ||
          (Date.now() - ultimaVinhetaHoraTs) >= 3600000
        );

        if (podeDispararHora && ultimaVinhetaHoraPasta !== pastaKey) {
          // Observação: a condição ultimaVinhetaHoraPasta !== pastaKey garante que
          // a contagem reinicia quando a programação/pasta muda, mas sem reiniciar por “troca de música”.
          // (quando retornar aqui dentro da mesma pasta, ultimaVinhetaHoraPasta já será igual)
          ultimaVinhetaHoraTs = Date.now();
          ultimaVinhetaHoraPasta = pastaKey;

          const vinheta = pickVinhetaAleatoria();
          if (vinheta) {
            ultimaMusicaSrc = null;
            await tocarMusica(vinheta);
            atualizarBtnAgora();
            return;
          }
        }
      }
    }



    const arquivos = getArquivosDaPasta(pastaAtual);
    if (!arquivos.length) return;

    // escolhe nova faixa tentando não repetir a atual imediatamente

    let tentativa = 0;
    let musica = null;

    // tentativas limitadas: muda indexMusicaNaFase e gera outra posição no shuffle determinístico
    while (tentativa < 10) {
      const candidato = pickAleatorioSemRepeticao(pastaAtual, arquivos, indexMusicaNaFase);
      indexMusicaNaFase++;

      // pula candidato se for o mesmo src (evita repetição imediata)
      if (candidato && candidato !== ultimaMusicaSrc) {
        musica = candidato;
        break;
      }
      tentativa++;
    }

    // se não achou diferente (playlist com repetição real/única), toca o último candidato válido
    if (!musica) {
      musica = pickAleatorioSemRepeticao(pastaAtual, arquivos, indexMusicaNaFase % arquivos.length);
    }

    if (!musica) return;

    ultimaMusicaSrc = musica;
    await tocarMusica(musica);
    atualizarBtnAgora();
  } finally {
    proximoPending = false;
  }
}


// ==============================
// BOTÃO PLAY
// ==============================
// MAPEAMENTO PASTA -> NOME DO PROGRAMA
// ==============================
const PROGRAMAS = {
  fundaovibe: "🔥 Fundão da Vibe 🔥",
  hitsvibe:   "⭐ Hits Vibe ⭐",
  lofi:        "🎧 Lo-Fi Vibe 🎧",
  chilldrive:  "☕ Chill Vibe ☕",
  grove:       "🌀 PSY Vibe 🌀 ",
  night:       "🌙 PSY Vibe 🌙",
  forest:      "🌲 PSY Vibe 🌲 ",
  rootsvibe:   "☀️Reggae Roots☀️",
  baladavibe:  "💫🌙inVibe🌙💫",
  frequêncianight: "🎶⚡ Frequência Night ⚡🎶",

};

function atualizarBtnAgora() {
  const btn = document.getElementById("btnAgora");
  const nomeSpan = document.getElementById("nomePrograma");
  if (!btn || !nomeSpan) return;

  // sincroniza pelo estado real do audio (evita "tocando" preso)
  const isPlaying = !!playerEl && !playerEl.paused && !playerEl.ended;
  tocando = isPlaying;

  // Exporta estado para o admin.js via localStorage
  // (para mostrar programa atual + arquivo tocando abaixo do VibefmADM)
  try {
    const programaAtual = isPlaying && pastaAtual ? (PROGRAMAS[pastaAtual] || pastaAtual) : null;
    const arquivoAtual = isPlaying ? (ultimaMusicaSrc || playerEl?.src || null) : null;
    localStorage.setItem('vibe_radio_now', JSON.stringify({
      programaAtual: programaAtual,
      arquivoAtual: arquivoAtual
    }));
  } catch (_) {}

  if (isPlaying && pastaAtual) {
    btn.style.display = "block";
    nomeSpan.textContent = PROGRAMAS[pastaAtual] || pastaAtual;
  } else {
    btn.style.display = "none";
  }
}


function setMainButtonText(texto) {
  // NÃO mexe em layout/CSS. Apenas texto do botão principal.
  // No seu HTML o botão é: <button class="play-btn" ...>
  // Não existe id="btnRadio".
  const h2 = document.querySelector(".play-btn .play-text h2");
  if (h2) {
    h2.textContent = texto;
  }
}




// ==============================

async function tocarRadio() {
  if (!playerEl) return;

  // debounce + bloqueio de clique duplo (evita múltiplos play() simultâneos)
  const nowTs = Date.now();
  if (nowTs - clickDebounceTimer < 250) return;
  clickDebounceTimer = nowTs;

  // Fonte da verdade antes de agir: evita botão preso após ended/error/pause.
  if (playerEl.ended || playerEl.paused) {
    pauseRequested = false;
    playPending = false;
    playClickLocked = false;
    tocando = false;
  }

  if (playClickLocked) return;

  // Se um play() já está pendente, não dispare outro.
  // Em vez disso, transforma clique em "pedido" de pause.
  if (playPending) {
    pauseRequested = true;
    return;
  }


  // Caso: se estiver tocando, pausa (mas só se NÃO houver play pendente)
  if (!playerEl.paused && !playerEl.ended) {
    pauseRequested = false;
    try {
      // Antes de pausar, garanta que não há play recém-disparado em loop
      if (!playPending) {
        playerEl.pause();
      }
    } catch (e) {
      console.log("Erro ao pausar:", e);
    }
    return;
  }

  // Caso inicial: se não há src/sem tocar ainda, inicia a primeira música
  const temSrc = !!playerEl.getAttribute('src') || !!playerEl.src;
  if (!temSrc && !tocando) {
    // define pastaAtual/idx e toca a primeira faixa
    pastaAtual = getPastaInicialPorHorario();
    indexMusicaNaFase = 0;

    atualizarBtnAgora();

    const arquivos = getArquivosDaPasta(pastaAtual);
    const musica = pickAleatorioSemRepeticao(pastaAtual, arquivos, indexMusicaNaFase);
    indexMusicaNaFase++;

    // lock para evitar double play durante setup do src
    playClickLocked = true;
    const token = ++lastPlayToken;
    playPending = true;

    try {
      await tocarMusica(musica);

      // Se o usuário pediu pause durante o play, aplica agora
      if (pauseRequested && lastPlayToken === token) {
        pauseRequested = false;
        playerEl.pause();
      }
    } catch (e) {
      console.log("Erro ao tocar música inicial:", e);
    } finally {
      // somente o token atual libera o lock (evita corrida)
      if (lastPlayToken === token) {
        playPending = false;
        playClickLocked = false;
      }
      atualizarBtnAgora();
    }
    return;
  }

  // Retomar (pause/ended) com proteção anti-concorrência
  playClickLocked = true;
  const token = ++lastPlayToken;
  playPending = true;
  pauseRequested = false;

  try {
    // sincroniza o estado real antes de chamar play
    // (syncUIFromAudioState é definido dentro do setupAudioEvents; aqui usamos proteção)
    try {
      if (typeof window.syncUIFromAudioState === 'function') {
        window.syncUIFromAudioState();
      }
    } catch (_) {}


  // Se estava pausado/ended, só tenta play.
  if (playerEl.paused || playerEl.ended) {
    await playerEl.play();
  }

  // Se durante o await o usuário pediu pause, aplica.

    if (pauseRequested && lastPlayToken === token) {
      pauseRequested = false;
      try { playerEl.pause(); } catch (_) {}
    }

  } catch (e) {
    console.log("Erro ao retomar:", e);
  } finally {
    if (lastPlayToken === token) {
      playPending = false;
      playClickLocked = false;
    }
    atualizarBtnAgora();
  }
}






// ==============================
// EVENTOS DO ÁUDIO
// ==============================

let audioEventsInitialized = false;

function setupAudioEvents() {
  if (!playerEl) return;
  if (audioEventsInitialized) return;
  audioEventsInitialized = true;


  function setListeningOverlayVisible(visible) {
    // Elemento do HTML: <button id="btnAgora"> ... <span id="txtAgora">Você está ouvindo Agora</span>
    const btnAgora = document.getElementById("btnAgora");
    if (!btnAgora) return;

    btnAgora.style.display = visible ? "block" : "none";
  }

  // Fonte da verdade: sincroniza UI com o estado real do <audio>
  function syncUIFromAudioState() {
    // exporta para o tocarRadio() usar sem ReferenceError
    window.syncUIFromAudioState = syncUIFromAudioState;

    const isPlaying = !!playerEl && !playerEl.paused && !playerEl.ended;
    tocando = isPlaying;


    // Equalizador
    setEqualizerState(isPlaying);

    // Botão principal + overlay do "Ouvir Agora"
    if (isPlaying) {
      setMainButtonText("PARAR");
      atualizarBtnAgora();
      setListeningOverlayVisible(true);
    } else {
      setMainButtonText("OUVIR AGORA");
      atualizarBtnAgora();
      setListeningOverlayVisible(false);
    }
  }

  function resetMainButton() {
    // Reset rápido para o estado "não tocando"; a UI final vem do sync
    pauseRequested = false;
    playPending = false;
    playClickLocked = false;

    tocando = false;
    setEqualizerState(false);

    setMainButtonText("OUVIR AGORA");
    atualizarBtnAgora();
    setListeningOverlayVisible(false);
  }


  // Mantém referência ao setEqualizerState do tocarRadio() via closure
  // (fallback caso ainda não exista)
  function setEqualizerState(running) {
    const bars = document.querySelectorAll(".bar");

    // O equalizador no seu HTML usa apenas animationPlayState nas `.bar`.
    // Não existe `#equalizerBox`, então não devemos depender dele.
    bars.forEach(b => {
      b.style.animationPlayState = running ? "running" : "paused";
    });
  }


  // Atualização 100% baseada nos eventos do <audio>.
  // (Adicionar apenas uma vez; protege travamentos e não duplica listeners)
  playerEl.addEventListener("play", () => {
    // ao iniciar, limpa flags que podem ter ficado presas
    pauseRequested = false;
    playPending = false;
    playClickLocked = false;
    audioErrorPending = false;
    syncUIFromAudioState();
  });

  playerEl.addEventListener("pause", () => {
    pauseRequested = false;
    playPending = false;
    playClickLocked = false;
    syncUIFromAudioState();
  });

  playerEl.addEventListener("ended", () => {
    // Reset antes de avançar: evita travar botão por lock pendente.
    playPending = false;
    pauseRequested = false;
    playClickLocked = false;
    proximoPending = false;
    audioErrorPending = false;

    tocando = false;
    syncUIFromAudioState();

    // Ao terminar naturalmente, tenta próxima música.
    setTimeout(() => proximaMusica(), 0);
  });


  playerEl.addEventListener("error", () => {
    // error pode disparar em cascata durante troca/alt/tab, então protegemos contra loops.
    if (audioErrorPending) return;
    audioErrorPending = true;

    try {
      console.log("⚠️ Erro na música (reconexão falhou/stream quebrado). Tentando recuperar...");

      // Resetar player e UI com segurança
      pauseRequested = true;
      playPending = false;
      playClickLocked = false;

      try { playerEl.pause(); } catch (_) {}
      // Reset de tempo para evitar estados presos
      try { playerEl.currentTime = 0; } catch (_) {}

      tocando = false;
      syncUIFromAudioState();

      // Recuperação: tenta próxima faixa (uma vez) após estabilizar
      setTimeout(() => {
        audioErrorPending = false;

        // Se o usuário ainda não retomou, segue para próxima
        if (!tocando) {
          if (!proximoPending && !playPending) {
            proximaMusica();
          }
        }
      }, 900);

      // caso o navegador nunca dispare pause/play após error, liberamos guard também
      connectionRecoveryTimer = setTimeout(() => {
        audioErrorPending = false;
      }, 6000);
    } catch (e) {
      audioErrorPending = false;
      console.log("Erro no handler de error:", e);
    }
  });



}

// DOM já está pronto quando o script é executado (colocado antes de </body>)
setupAudioEvents();

// (Intencionalmente sem sincronização manual inicial do texto.
// Texto do botão é controlado EXCLUSIVAMENTE pelos eventos: play/pause/ended.)
if (playerEl) {
  atualizarBtnAgora();
}



// OBS: dai pra cima tudo certo salvo ate aqui pangare