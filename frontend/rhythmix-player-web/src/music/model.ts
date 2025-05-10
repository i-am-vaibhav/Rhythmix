export interface LyricsLine {
  time: number;
  text: string;
}

export interface SongMetadata {
  id?: string;
  title: string;
  artist: string;
  album: string;
  coverArt: string;
  url: string;
  lyrics: LyricsLine[];
}

export const mockLyrics: LyricsLine[] = [
  { time:7, text:"MixSingh in the house" },
  { time:14,text:"O, sunnian-sunnian raataan te raataan de vich tu"},
  { time:18,text:"Jad vi tainu labhan te mil jaave mainu tu"},
  { time:22,text:"Saare din diyan gallan beh ke dassan main tainu"},
  { time:25,text:"Tu mainu bhule na kade}, main na bhulan tainu"},
  { time:36,text:"O, sunnian-sunnian raataan te raataan de vich tu"},
  { time:40,text:"Jad vi tainu labhan te mil jaave mainu tu"},
  { time:44,text:"Saare din diyan gallan beh ke dassan main tainu"},
  { time:47,text:"Tu mainu bhule na kade, main na bhulan tainu"},
  { time:62,text:"Tainu main manawan, tere te mari jaawan"},
  { time:66,text:"Mere te tu mare hi na"},
  { time:70,text:"Aidan nahio hunda, main hi kari jaawan"},
  { time:73,text:"Te tu mera kare hi na"},
  { time:77,text:"Tainu main manawan, tere te mari jaawan"},
  { time:81,text:"Mere te tu mare hi na"},
  { time:84,text:"Aidan nahio hunda, main hi kari jaawan"},
  { time:88,text:"Te tu mera kare hi na"},
  { time:91,text:"O, challiyan-challiyan baataan te baataan de vich tu"},
  { time:95,text:"Jad vi tang koi karda, bas karda tu mainu"},
  { time:99,text:"Main hi kardi gallan, kyu nahi karda tu?"},
  { time:103,text:"Tu mainu bhule na kade, main na bhulan tainu"},
  { time:121,text:"O, khedan na kade vi tere dil naal main"},
  { time:125,text:"Har vele rakhan tainu mere naal main"},
  { time:129,text:"Mar jaawan othe jithe tu na mile"},
  { time:132,text:"Jhooth na main bolan kade tere naal main"},
  { time:136,text:"Meriyan jo gallan tainu buri lagan"},
  { time:140,text:"Oh gallan karaan hi na"},
  { time:143,text:"Tere wal vekhan}, tainu hi main vekhan"},
  { time:147,text:"Hor wal moonh karaan hi na"},
  { time:150,text:"O, lammiyan-lammiyan waataan te waataan de vich tu"},
  { time:154,text:"Main taan chahwan mera parchhaawan ban jaave tu"},
  { time:158,text:"Nede-nede rakh le haath phad ke mainu"},
  { time:162,text:"Tu mainu bhule na kade}, main na bhulan tainu"},
  { time:169,text:"O, sunnian-sunnian raataan te raataan de vich tu"},
  { time:173,text:"Jad vi tainu labhan te mil jaave mainu tu"},
  { time:177,text:"Saare din diyan gallan beh ke dassan main tainu"},
  { time:180,text:"Tu mainu bhule na kade}, main na bhulan tainu"}
];

export const mockLyrics2: LyricsLine[] = [
  { time: 0, text: "(Church-Church-Church)" },
  { time: 2, text: "(Churchil dái in the beat)" },
  { time: 5, text: "Yeah" },
  { time: 7, text: "Paisaa (paisaa) tãsanga, mm-hm" },
  { time: 10, text: "Paisaa mãsanga, yeah" },
  { time: 13, text: "Paisaa (paisaa) tãsanga, mm-hm" },
  { time: 16, text: "Paisaa mãsanga, yeah" },
  { time: 19, text: "Paisaa (paisaa) tãsanga, mm-hm" },
  { time: 22, text: "Paisaa mãsanga, yeah" },
  { time: 25, text: "Paisaa (paisaa) tãsanga, mm-hm" },
  { time: 28, text: "Paisaa mãsanga, yeah" },
  { time: 31, text: "Paisaa chha dough, overload cash flow" },
  { time: 34, text: "Bro, bhaisakẽ bor, gani nasakine bho (ho)" },
  { time: 37, text: "Paisaa ko bot, paisaa jaḍeko coat mero" },
  { time: 40, text: "Hãshera bitáide ājabholiko nasoch, keṭo" },
  { time: 43, text: "Paisaa tãsanga, mm-hm" },
  { time: 46, text: "Paisaa (paisaa) mãsanga, yeah" },
  { time: 49, text: "Paisaa tãsanga, mm-hm" },
  { time: 52, text: "Paisaa (paisaa) mãsanga, yeah" },
  { time: 55, text: "Dhani ṭhūlo, choḍ kuro, money kuro bol ṭhūlo" },
  { time: 58, text: "Bhani ḍubo, pol khulo, ani bujho, soch kuro" },
  { time: 61, text: "Ambani ko Antilia mā kholidinchu penṭikhānā" },
  { time: 64, text: "Paisaa yeti dherai, solṭi, kamāyerai senti bhā ma" },
  { time: 67, text: "Āyo paisaa, gayo paisaa, dherai āyo, thorai laijā" },
  { time: 70, text: "Khāyo paisaa, hāgo aisā, beche āu̐cha Mona Lisa" },
  { time: 73, text: "Steve Jobs, better not fu*k with me dherai, 'cause" },
  { time: 76, text: "Kindinchu tero all company feri ma" },
  { time: 79, text: "Paisaa tãsanga, mm-hm" },
  { time: 82, text: "Paisaa (paisaa) mãsanga, yeah" },
  { time: 85, text: "Paisaa tãsanga, mm-hm" },
  { time: 88, text: "Paisaa (paisaa) mãsanga, yeah" },
  { time: 91, text: "Shah Rukh lāi loan bhāk, Salman ko donor ma" },
  { time: 94, text: "Paisaa ko golmāl, bāṇijyako owner ma" },
  { time: 97, text: "Sā̃ccikai bhaneko kuro sundā feri ṭhaṭṭā lācha" },
  { time: 100, text: "Candramā mā jaggā mero, dhanī purjā pakkā bhācha" },
  { time: 103, text: "Pā̃c dekhi daś, bīs, saya, pacās, mastī" },
  { time: 106, text: "Sakyo? La, parkhi, print huncha parsi" },
  { time: 109, text: "Facebook ra Insta, yo Twitter ko cintā" },
  { time: 112, text: "Bhan, kati lāgcha paisaa yo tīntai lāi kindā, hā?" },
  { time: 115, text: "Paisaa tãsanga, mm-hm" },
  { time: 118, text: "Paisaa (paisaa) mãsanga, yeah" },
  { time: 121, text: "Paisaa tãsanga, mm-hm" },
  { time: 124, text: "Paisaa (paisaa) mãsanga, yeah" },
  { time: 127, text: "Bezos nai riṇmā jaba chirchu ma scene mā" },
  { time: 130, text: "Bhāi Chaudhary lāi siṅgai pacāidinchu ekchinmā" },
  { time: 133, text: "Musk Elon le Tesla lāi katimā po beclā?" },
  { time: 136, text: "Bhan, testā mulā kinne paisaa bokī hiḍchu jebmā" },
  { time: 139, text: "Louis Vuitton, Zara, yo Gucci ra Prada ko" },
  { time: 142, text: "Uṭhāuchu ma bhāḍā sadhaī America jādā" },
  { time: 145, text: "Yo Andrew ko Tate ani Billy bhāiko gate pani" },
  { time: 148, text: "Joḍī mero net jati pugdaina bheṭna ni" },
  { time: 151, text: "Jeff pani bec, kati tespachi pani ajhai" },
  { time: 154, text: "Days kati lāgcha tãlāi yā̃ pugna? Decades jati" },
  { time: 157, text: "Hā, hā, tetī paisaa chha, bro" },
  { time: 160, text: "Paisaa tãsanga, mm-hm" },
  { time: 163, text: "Paisaa mãsanga, yeah" },
  { time: 166, text: "Paisaa tãsanga, mm-hm" },
  { time: 169, text: "Paisaa mãsanga, yeah" },
  { time: 172, text: "Paisaa tãsanga, mm-hm" },
  { time: 175, text: "Paisaa mãsanga, yeah" },
  { time: 178, text: "Paisaa tãsanga, mm-hm" },
  { time: 181, text: "Paisaa mãsanga, yeah" }
];

export const mockQueue: SongMetadata[] = [
  {
    url: "https://pagalfree.com/download/128-Suniyan%20Suniyan%20-%20Juss%20128%20Kbps.mp3",
    title: "Suniyan Suniyan",
    artist: "Ninja",
    album: "Suniyan Suniyan",
    coverArt: "https://i1.sndcdn.com/artworks-9L7V4njW3zkBVG1l-misuQQ-t500x500.jpg",
    lyrics: mockLyrics,
    id: "1",
  },
  {
    url: "https://pagalall.com/wp-content/uploads/all/Paisa%20-%E2%80%AC%20Taaza%20Khabar%20Season%202%20(pagalall.com).mp3",
    title: "Paisaa",
    artist: "Kushal Grumpy",
    album: "Paisaa",
    coverArt: "https://m.media-amazon.com/images/M/MV5BN2Y4M2ZiNjQtZDYxMS00MGY4LTlhMjYtODdlMTNmYWIzOWE3XkEyXkFqcGc@._V1_.jpg",
    id: "2",
    lyrics: mockLyrics2
  }
];