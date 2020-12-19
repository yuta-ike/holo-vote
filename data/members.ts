import Member, { Generation, generations } from "../types/member"

const data = [
  [
    'ときのそら',
    '时乃空',
    'Tokino Sora',
    '0th',
    'そらとものみんなー！元気ー？ときのそらです！',
    '2017年9月7日より活動を開始、ホロライブプロダクション初のバーチャルアイドル。歌とホラーゲームが大好きで、活動当初からの夢は「横浜アリーナでライブをすること」。',
    'UCp6993wxpyDPHUpavwDFqgg',
    '286179206',
    'tokino_sora',
    'ときのそら',
    'sora_a.webp',
    'sora_b.webp',
  ],
  [
    'ロボ子さん',
    '萝卜子',
    'Roboco-san',
    '0th',
    'はろーぼー！ロボ子だよー',
    'とある荒地にいる、いつもひとりぼっちのポンコツロボット。今はバーチャルユーチューバーとして、たくさんの人と交流をとって毎日を楽しく過ごすことが目標。',
    'UCDqI2jOz0weumE8s7paEk6g',
    '20813493',
    'robocosan',
    'robo_co ろぼさー',
    'roboco_a.webp',
    'roboco_b.webp',
  ],
  [
    'さくらみこ',
    '樱巫女',
    'Sakuramiko',
    '0th',
    'にゃっはろー！さくらみこだよ～！',
    '電脳世界での巫女として真面目に神事をこなしてきたが、神様にお使いを頼まれ日本に訪れる。お使いをこなしていくうち、バーチャル巫女アイドルになることを決意し、日々奮闘中！',
    'UC-hM6YJuNYVAmUWxeIr9FeA',
    '366690056',
    'sakuramiko35',
    'さくらみこ',
    'miko_a.png',
    'miko_b.webp',
  ],
  [
    '星街すいせい',
    '星街彗星',
    'Hoshimachi Suisei',
    '0th',
    '彗星の如く現れたスターの原石！アイドルVTuberの星街すいせいです！',
    '歌とアイドルをこよなく愛する永遠の18歳のアイドルVTuber。いつか武道館でライブをすることを夢見て活動している。',
    'UC5CwaMl1eIgY8h02uZw7u8A',
    '9034870',
    'suisei_hosimati',
    '星街すいせい 星詠み',
    'suisei_a.webp',
    'suisei_b.webp',
  ],
  [
    '白上フブキ',
    '白上吹雪',
    'Shirakami Fubuki',
    '1st',
    'こんばんきーつね！白上フブキです！',
    '白髪ケモミミの女子高生。恥ずかしがり屋であり、おとなしめな性格だけれど、実は人と話すのが好きで、構ってもらえると喜ぶ。',
    'UCdn5BQ06XqgXoAxIhbqw5Rg',
    '332704117',
    'shirakamifubuki',
    '白上フブキ すこん部',
    'hubuki_a.webp',
    'hubuki_b.webp',
  ],
  [
    '夏色まつり',
    '夏色祭',
    'Natsuiro Matsuri',
    '1st',
    'こんばんわっしょーい！夏色まつりです！',
    'チア部の新入生。明るく元気で人懐っこい性格であり誰とでもすぐに仲良くなれて、友達も多い。祭りやイベントなど楽しいことが好き。',
    'UCQ0UDLQCjY0rmuxCDE38FGg',
    '336731767',
    'natsuiromatsuri',
    '夏色まつり まつりす',
    'matsuri_a.webp',
    'matsuri_b.webp',
  ],
  [
    '夜空メル',
    '夜空梅露',
    'Yozora Mel',
    '1st',
    'こんかぷ～夜空メルだよ！',
    'バンパイアの女の子。バンパイアなのに血は苦手で、アセロラジュースが大好き。',
    'UCD8HOxPs4Xvsm8H0ZxXGiBw',
    '389856447',
    'yozoramel',
    '夜空メル かぷ民',
    'mel_a.webp',
    'mel_b.webp',
  ],
  [
    '赤井はあと',
    '赤井心',
    'Akai Haato',
    '1st',
    'こんるーじゅ！赤井はあとよ！',
    '生意気な後輩。普段はツンツンしているが仲良くなった相手には甘えたりする。赤いリボンとハートが好きで、髪や服によくつけている。',
    'UC1CfXB_kRs3C-zaeTG3oGyg',
    '339567211',
    'akaihaato',
    '赤井はあと はあとん',
    'haato_a.webp',
    'haato_b.webp',
  ],
  [
    'アキ・ローゼンタール',
    '亚绮-罗森',
    'Aki Rosenthal',
    '1st',
    'こんばんアローナ！アキロゼことアキローゼンタールです！',
    '異世界から来た女子高生。好奇心旺盛であり、色々なことに積極的に手を出していく。彼女のトレードマークであるツインテールは不思議な力で浮いている。',
    'UCFTLzh12_nrtzqBPsTCqenA',
    '389857131',
    'akirosenthal',
    'アキ・ローゼンタール ロゼ隊',
    'aki_a.webp',
    'aki_b.webp',
  ],
  [
    '湊あくあ',
    '湊-阿库娅',
    'Minato Aqua',
    '2nd',
    '皆さんどうもこんあくあー！湊あくあです！',
    'マリンメイド服のバーチャルメイド。本人は頑張っているがおっちょこちょいでドジっ子。',
    'UC1opHUrw8rvnsadT-iGp7Cg',
    '375504219',
    'minatoaqua',
    '湊あくあ あくあクルー',
    'aqua_a.webp',
    'aqua_b.webp',
  ],
  [
    '癒月ちょこ',
    '癒月巧可',
    'Yuzuki Choco',
    '2nd',
    'Good evening!my cute students.ちょっこーん！',
    '魔界学校の保健医。校内の男女からの人気は高く、特に男子からの診察依頼が絶えないという。お菓子が好きで、机の上にお菓子の袋が散乱しているのが目撃されては怒られている。',
    'UC1suqwovbL1kzsoaZgFZLKg',
    '389858754',
    'yuzukichococh',
    '癒月ちょこ ちょこカルテ',
    'choco_a.webp',
    'choco_b.webp',
  ],
  [
    '百鬼あやめ',
    '百鬼绫目',
    'Nakiri Ayame',
    '2nd',
    '人間様たちこんなきりー！百鬼あやめだぞ',
    '魔界学校所属の和装鬼娘。いたずら好きで、よく鬼火を飛ばして他人をからかって遊んでいる。こう見えて実は生徒会長。',
    'UC7fk0CB07ly8oSl0aqKkqFg',
    '389858027',
    'nakiriayame',
    '百鬼あやめ あやめ夜行',
    'ayame_a.webp',
    'ayame_b.webp',
  ],
  [
    '紫咲シオン',
    '紫咲诗音',
    'Murasaki Shion',
    '2nd',
    'こんしお～、紫咲シオンだよ',
    '魔界学校に出没する子供・・・ではなく本人曰く大人（らしい）。自称名門の出身で黒魔術を得意としている（らしい）あまり「こんしお」とは言わない。',
    'UCXTpFs_3PqI41qX2d9tL2Rw',
    '389857640',
    'murasakishionch',
    '紫咲シオン 塩っ子',
    'shion_a.webp',
    'shion_b.webp',
  ],
  [
    '大空スバル',
    '大空昴',
    'Oozora Subaru',
    '2nd',
    'ちわっす！大空スバルっす！',
    '総合格闘技部とe-sports部のマネージャーをしている。男勝りな性格で、誰とも分け隔てなく接する、明るく元気で活発な子。ゲームは絶賛練習中。',
    'UCvzGlP9oQwU--Y0r9id_jnA',
    '389859190',
    'oozorasubaru',
    '大空スバル スバ友',
    'subaru_a.webp',
    'subaru_b.webp',
  ],
  [
    '大神ミオ',
    '大神澪',
    'Ookami Mio',
    'gs',
    'こんばんみぉーん！大神ミオだよ～！',
    'どこからともなく現れた黒髪のケモミミ少女。神社によく出没するらしい。ゲームが大好き。',
    'UCp-5t9SrOQwXMU7iIjQfARg',
    '389862071',
    'ookamimio',
    '大神ミオ ミオファ',
    'mio_a.webp',
    'mio_b.webp',
  ],
  [
    '猫又おかゆ',
    '猫又小粥',
    'Nekomata Okayu',
    'gs',
    'もぐもぐ～おかゆ～！',
    'おにぎり屋さんを経営してるおばあさんに飼われてる猫。おばあちゃんの部屋にあるPCから配信している。',
    'UCvaTdHTWBGv3MKj3KVqJVCw',
    '412135222/#',
    'nekomataokayu',
    '猫又おかゆ おにぎりゃー',
    'okayu_a.webp',
    'okayu_b.webp',
  ],
  [
    '戌神ころね',
    '戌神沁音',
    'Inugami Korone',
    'gs',
    'ぉぁよ～！ゆびゆび～',
    '都会にあるパン屋さんにいる犬。店番をしながら空いた時間にゲームをしている。',
    'UChAnqc_AY5_I3Px5dig3X1Q',
    '412135619/#',
    'inugamikorone',
    '戌神ころね',
    'korone_a.webp',
    'korone_b.webp',
  ],
  [
    '不知火フレア',
    '不知火芙蕾雅',
    'Shiranui Flare',
    '3rd',
    'こんぬい～！不知火フレアだよ～！',
    '普段は適当に見えるけどいざというときは頼れる姉御肌なハーフエルフ。基本少しやさぐれている。情に熱く涙もろく、褒められるのに弱い。（デレがち。）いつも近くにいるパンダに見える妖精の名前は「きんつば」。',
    'UCvInZx9h3jC2JzsIzoOebWg',
    '454737600',
    'shiranuiflare',
    '不知火フレア',
    'flare_a.webp',
    'flare_b.webp',
  ],
  [
    '白銀ノエル',
    '白银诺艾尔',
    'Shirogane Noel',
    '3rd',
    'こんばんまっする～！白銀ノエルです！',
    'おっとりしているが、なんでも筋力でどうにかする物騒な面を持つ ' +
    'ゆるふわ脳筋女騎士。強さに憧れるあまり、つよつよな人達が集まるVTuber界に武者修行にきた。',
    'UCdyqAaZDKHXg4Ahi7VENThQ',
    '454733056',
    'shiroganenoel',
    '白銀ノエル 白銀聖騎士団',
    'noel_a.webp',
    'noel_b.webp',
  ],
  [
    '宝鐘マリン',
    '宝钟玛琳',
    'Houshou marine',
    '3rd',
    'Ahoy!宝鐘海賊団船長！宝鐘マリンです～！',
    '宝石、宝、お金が大好きで、海賊になって宝を探すのが夢。海賊船を買うのが目標で今は陸でVTuberをしている。（ようするには今はただの海賊コスプレ女）お姉さん風にふるまい、小悪魔的に誘惑したりからかったりしてくる。',
    'UCCzUftO8KOVkV4wQG1vkUvg',
    '454955503',
    'houshoumarine',
    '宝鐘マリン 宝鐘の一味',
    'marine_a.webp',
    'marine_b.webp',
  ],
  [
    '兎田ぺこら',
    '兔田佩克拉',
    'Usada Pekora',
    '3rd',
    'こんぺこ！こんぺこ！こんぺこー！兎田ぺこらぺこ！',
    '寂しがり屋なうさ耳の女の子。にんじんをこよなく愛し、いつでも食べられるように持ち歩いている。',
    'UC1DCedRgGHBdm81E1llLhOQ',
    '443305053',
    'usadapekora',
    '兎田ぺこら 野うさぎ同盟',
    'pekora_a.webp',
    'pekora_b.webp',
  ],
  [
    '潤羽るしあ',
    '润羽露西娅',
    'Uruha Rushia',
    '3rd',
    'こんるし～潤羽るしあなのです！',
    '人前に出ることが苦手な魔界学校に所属のネクロマンサー(死霊使い)の少女。ひとりぼっちが嫌なので死霊や屍とおしゃべりをしている。',
    'UCl_gCybOJRIgOXw6Qb4qJzQ',
    '443300418',
    'uruharushia',
    '潤羽るしあ ふぁんでっど',
    'rushia_a.webp',
    'rushia_b.webp',
  ],
  [
    '天音かなた',
    '',
    'Amane Kanata',
    '4th',
    'ホロライブ4期生かなたんこと、天音かなたです！',
    '天界学園に通う天使。人を癒すための研究をしている。恥ずかしがりやな性格を隠すために、クールを装おうとする。',
    'UCZlDXzGoo7d44bwdNObFacg',
    '',
    'amanekanatach',
    '天音かなた',
    'kanata_a.webp',
    'kanata_b.webp',
  ],
  [
    '桐生ココ',
    '4th',
    '',
    'Kiryu Coco',
    'はーじまーるぞーい',
    '人間の文化に興味を持ち、異世界から日本に語学留学中の子どものドラゴン。仁義と任侠を重んじる正義感あふれるドラゴンで、気合で人間の姿を保っている。',
    'UCS9uQI-jC3DE0L4IpXyvr6w',
    '',
    'kiryucoco',
    '桐生ココ',
    'coco_a.webp',
    'coco_b.webp',
  ],
  [
    '角巻わため',
    '',
    'Tsunomaki Watame',
    '4th',
    'こんばんドドドー',
    '吟遊詩人をしながらのんびり旅をしている羊。歌が大好き。もふもふ。とにかくもふもふ。草食系なのでポテチが好物。',
    'UCqm3BQLlJfvkTsX_hvm0UmA',
    '',
    'tsunomakiwatame',
    '角巻わため',
    'watame_a.webp',
    'watame_b.webp',
  ],
  [
    '常闇トワ',
    '',
    'Tokoyami Towa',
    '4th',
    'こんやっぴー！ホロライブ4期生の常闇トワ様です',
    '1人前の悪魔になる為の社会勉強として人間界にやってきた小悪魔。本来勉強をしなきゃいけないところ、ゲームに出会ってしまい、夢中になる。配信という人間達とのコミュニケーションツールを見つけそこで勉強を試みる。',
    'UC1uv2Oq6kNxgATlCiez59hw',
    '',
    'tokoyamitowa',
    '常闇トワ',
    'towa_a.webp',
    'towa_b.webp',
  ],
  [
    '姫森ルーナ',
    '',
    'Himemori Luna',
    '4th',
    'んなあああ！ホロライブ4期生姫森ルーナなのら',
    'お菓子の国のお姫様。甘えんぼで人懐っこいがわがままを言ってたびたび執事に怒られている。月のアクセは、異世界の国のマークらしい？',
    'UCa9Y57gfeY0Zro_noHRVrnw',
    '',
    'himemoriluna',
    '姫森ルーナ',
    'luna_a.webp',
    'luna_b.webp',
  ],
  [
    '雪花ラミィ',
    '',
    'Yukihana Lamy',
    '5th',
    '',
    '人里離れた白銀の大地に住む、雪の一族の令嬢。ホロライブの笑顔や彩りあふれる配信に心を打たれ、お供のだいふくと共に家を飛び出した。真面目だが世間知らずで抜けたところがある。',
    'UCFKOVgVbGmX65RxO3EtH3iw',
    '',
    'yukihanalamy',
    '雪花ラミィ',
    'lamy_a.webp',
    'luna_b.webp',
  ],
  [
    '桃鈴ねね',
    '',
    'Momosuzu Nene',
    '5th',
    'ほろらいぶ5期生オレンジ担当ももすずねねある～',
    'アイドルにあこがれて、異世界からやってきたチャイナ服の女の子。歌って踊ることと餃子が大好き。たくさんの人に愛される存在になるべく、日々特訓中。故郷では「タオリン」と呼ばれていた。',
    'UCAWSyEs_Io8MtpY3m-zqILA',
    '',
    'momosuzunene',
    '桃鈴ねね ねっ子',
    'nene_a.webp',
    'nene_b.webp',
  ],
  [
    '獅白ぼたん',
    '',
    'Shishiro Botan',
    '5th',
    '',
    '見た目とは裏腹にぐうたらした性格のホワイトライオン。基本めんどくさがり屋だが、一度決めた事はやり通す誠実な一面もある。好きな言葉は「採算度外視」。',
    'UCUKD-uaobj9jiqB-VXt71mA',
    '',
    'shishirobotan',
    '獅白ぼたん',
    'botan_a.webp',
    'botan_b.webp',
  ],
  [
    '尾丸ポルカ',
    '',
    'Omaru Poruka',
    '5th',
    '',
    'VTuber界の座長となるべくホロライブに降り立ったサーカス団の団員。曲芸で人を楽しませるのが好きで、やるとなればやるっきゃない！の精神の持ち主。時々出るボロは、持ち前の愛嬌でごまかす。',
    'UCK9V2B22uJYu3N7eR_BT9QA',
    '',
    'omarupolka',
    '尾丸ポルカ おまる座',
    'polka_a.webp',
    'polka_b.webp',
  ],
  [
    'アイラニ・イオフィフティーン',
    '',
    'Airani Iofifteen',
    'id-1st',
    '',
    '絵を描くのが大好きな宇宙人の子。地球が好きすぎて、地球の大学のビジュアル・コミュニケーション・デザイン学科に入学した。',
    'UCAoy6rzhSf4ydcYjJw3WoVg',
    '',
    'airaniiofifteen',
    'アイラニ・イオフィフティーン',
    'iofifteen_a.webp',
    'iofifteen_b.webp',
  ],
  [
    'ムーナ・ホシノヴァ',
    '',
    'Moona Hoshinova',
    'id-1st',
    '',
    'モデル兼アイドルの大学生。バーチャル世界に興味を持ち、Vtuberになった。落ち着いているように見えるが実はホラーが苦手。',
    'UCP0BspO_AMEe3aQqqpo89Dg',
    '',
    'moonahoshinova',
    'ムーナ・ホシノヴァ',
    'moona_a.webp',
    'moona_b.webp',
  ],
  [
    'アユンダ・リス',
    '',
    'Ayunda Risu',
    'id-1st',
    '',
    '魔法の森からやってきたリスの女の子。人間の世界で迷子になっていたが、とある事情があって優しいお姉さんの家に住むことになる。その恩返しをするためVtuberになることにした。',
    'UCOyYb1c43VlX9rc_lT6NKQw',
    '',
    'ayunda_risu',
    'アユンダ・リス',
    'risu_a.webp',
    'risu_b.webp',
  ],
  [
    'クレイジー・オリー',
    '',
    'Kureiji Ollie',
    'id-2nd',
    '',
    'お墓から出てきたゾンビ女子高生。生前の記憶を頼りに家に帰ったが知らないラーメン屋になっていた。彼女はラーメン屋になってしまった家を取り戻すために、VTuberになることを決めた。',
    'UCYz_5n-uDuChHtLo7My1HnQ',
    '',
    'kureijiollie',
    'クレイジー・オリー',
    'ollie_a.webp',
    'ollie_b.webp',
  ],
  [
    'アーニャ・メルフィッサ',
    '',
    'Anya Melfissa',
    'id-2nd',
    '',
    '「クリス」として知られている古代武器だった彼女は、主人の神秘的な儀式によって、人間の身体を与えられた。興味のないことや人に対して反応が薄くなるが、好きなことについて話すときは、とても子供っぽく熱心になる。',
    'UC727SQYUvx5pDDGQpTICNWg?',
    '',
    'anyamelfissa',
    'アーニャ・メルフィッサ',
    'anya_a.webp',
    'anya_b.webp',
  ],
  [
    'パヴォリア・レイネ',
    '',
    'Pavolia Reine',
    'id-2nd',
    '',
    '孔雀のお嬢様。魔法アカデミーで魔法を勉強していたが、事故に巻き込まれてしまい、人間の世界に転移。その時に魔法はほとんど使えなくなってしまった。優雅で冷静に見えるが、怒るととても感情的になる。',
    'UChgTyjG-pdNvxxhdsXfHQ5Q?',
    '',
    'pavoliareine',
    'パヴォリア・レイネ',
    'pavolia_a.webp',
    'pavolia_b.webp',
  ],
  [
    '森美声',
    '',
    'Mori Calliope',
    'en-1st',
    '',
    'グリム・リーパーの第一弟子。医療が発達している現代においては、死神として活躍する場面がなく、その代わりにVTuber活動で他人のソウルを収穫するつもりらしい。彼女は実は面倒見がよく、優しい心の持ち主である。',
    'UCL_qhgtOy0dy1Agp8vkySQg',
    '',
    'moricalliope',
    '森美声',
    'calliope_a.webp',
    'calliope_b.webp',
  ],
  [
    '小鳥遊キアラ',
    '',
    'Takanashi Kiara',
    'en-1st',
    '',
    'ファストフードチェーンの店主になりたいアイドル。不死鳥であり、ニワトリや七面鳥ではない（重要）。彼女は命を削りながらすごく頑張って働いている、どうせ死んでも灰から蘇られるから。',
    'UCHsx4Hqa-1ORjQTh9TYDhww',
    '',
    'takanashikiara',
    '小鳥遊キアラ',
    'kiara_a.webp',
    'kiara_b.webp',
  ],
  [
    '一伊那尓栖',
    '',
    'Ninomae Inanis',
    'en-1st',
    '',
    'こう見えても古き神の司祭である。ある日「変な本」を拾ってから触手を操れるようになった。力を得て以来、古き声から囁きや天啓を受け、無垢でごく普通な彼女はVTuber活動を通して人々のSAN値を削っている模様。',
    'UCMwGHR0BTZuLsmjY_NT5Pwg',
    '',
    'ninomaeinanis',
    '一伊那尓栖',
    'inanis_a.webp',
    'inanis_b.webp',
  ],
  [
    'がうる・ぐら',
    '',
    'Gawr Gura',
    'en-1st',
    '',
    '「海底つまらんすぎてワロタ」って言いながら地上にやってきたアトランティスの末裔。彼女がお気に入りで着ている服は（サメの被りモノも含めて）日本で買った。本人曰く暇な時は海洋生物と会話するのが好き。',
    'UCoSrY_IQQVpmIRZ9Xf-y93g',
    '',
    'gawrgura',
    'がうる・ぐら',
    'gura_a.webp',
    'gura_b.webp',
  ],
  [
    'ワトソン・アメリア',
    '',
    'Watson Amelia',
    'en-1st',
    '',
    '色々ホロライブにまつわる変な噂を耳にし、気になって調査に出向いたところ、彼女自身もアイドルになりたくなった。暇つぶしに反射神経を鍛えられるFPSやパズルゲーなどを好んでやっている。「初歩的なことなんでしょう？」',
    'UCyl1z3jo3XHR1riLFKG5UAg',
    '',
    'watsonameliaEN',
    'ワトソン・アメリア',
    'amelia_a.webp',
    'amelia_b.webp',
  ],
  [
    '友人A（えーちゃん）',
    '友人A（A酱)',
    'Yujin A',
    'staff',
    '',
    'VTuberときのそらの親友で、ホロライブ事務所の裏方担当。',
    '',
    '',
    'achan_UGA',
    '友人A',
    'achan_a.jpg',
    'achan_a.webp',
  ]
]

export const members: Member[] = data.map(([name, chineseName, englishName, gen, catchphrase, description, youtubeId, bilibiliId, twitterId, twitterHasTags, imageAPath, imageBPath], id) => {
  const newGen = name === "白上フブキ" ? ["1st", "gs"] : [gen]
  const newTwitterHasTags = twitterHasTags?.split(" ") ?? []
  return {
    id: id + 1,
    name, chineseName, englishName, gen: newGen as Generation[], catchphrase, description, youtubeId, bilibiliId, twitterId, twitterHasTags: newTwitterHasTags, imageAPath, imageBPath
  }
})

export const categorizedMembers: Record<Generation, Member[]> = Object.fromEntries(
  generations.map((gen) => [gen, members.filter(({ gen: _gen }) => _gen[0] === gen)])) as Record<Generation, Member[]>

