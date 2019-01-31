/************************
 * Object Fixture utilisé pour la génération aléatoire de fixtures
 * @type {{getRandom: (function(*): *), lorems: [string,string,string,string,string,string,string], imgUrls: [string,string,string,string,string,string,string,string,string], locations: [null,null,null,null,null], loopId: (function(*)), usernames: [string,string,string,string,string,string,string,string,string,string], password: string}}
 */
const Fixtures = {
    /***********
     * permet d'avoir un retour aléatoire sur le type de fixtures demandé
     * @param key String
     * @returns {*}
     */
    getRandom(keyName) {
        return this[keyName][Math.floor(Math.random() * (this[keyName].length))]

    },
    //(Contribution à la critique de l’économie politique, Avant propos, trad. fr. in Karl Marx, Philosophie], Gallimard, folio « essais », p. 488-489)
    lorems: ["|p|Dans la production sociale de leur existence, les hommes nouent des rapports déterminés, nécessaires, indépendants de leur volonté ; ces rapports de production correspondent à un degré donné du développement de leurs forces productives matérielles. L’ensemble de ces rapports forme la structure économique de la société, la fondation réelle sur laquelle s’élève un édifice juridique et politique, et à quoi répondent des formes déterminées de la conscience sociale. Le mode de production de la vie matérielle domine en général le développement de la vie sociale, politique et intellectuelle. Ce n’est pas la conscience des hommes qui détermine leur existence, c’est au contraire leur existence sociale qui détermine leur conscience.|§p|",
        "|p| A un certain degré de leur développement, les forces productives matérielles de la société entrent en collision avec les rapports de production existants, ou avec les rapports de propriété au sein desquels elles s’étaient mues jusqu’alors, et qui n’en sont que l’expression juridique.|§p|",
        "|p| Hier encore formes de développement des forces productives, ces conditions se changent en de lourdes entraves. Alors commence un ère de révolution sociale. Le changement dans les fondations économiques s’accompagne d’un bouleversement plus ou moins rapide dans tout cet énorme édifice. Quand on considère ces bouleversements, il faut toujours distinguer deux ordres de choses. Il y a le bouleversement matériel des conditions de production économique. On doit le constater dans l’esprit de rigueur des sciences naturelles. Mais il y a aussi les formes juridiques, politiques, religieuses, artistiques, philosophiques, bref les formes idéologiques, dans lesquelles les hommes prennent conscience de ce conflit et le poussent jusqu’au bout.|§p|",
        "|p| On ne juge pas un individu sur l’idée qu’il a de lui-même. On ne juge pas une époque de révolution d’après la conscience qu’elle a d’elle-même. Cette conscience s’expliquera plutôt par les contrariétés de la vie matérielle, par le conflit qui oppose les forces productives sociales et les rapports de production. |§p|",
        "|p|Jamais une société n’expire, avant que soient développées toutes les forces productives qu’elle est assez large pour contenir ; jamais des rapports supérieurs de production ne se mettent en place, avant que les conditions matérielles de leur existence soient écloses dans le sein même de la vieille société. C’est pourquoi l’humanité ne se propose jamais que les tâches qu’elle peut remplir : à mieux considérer les choses, on verra toujours que la tâche surgit là où les conditions matérielles de sa réalisation sont déjà formées, ou sont en voie de se créer.|§p|",
        "|p|Réduits à leurs grandes lignes, les modes de production asiatique, antique, féodal et bourgeois moderne apparaissent comme des époques progressives de la formation économique de la société. Les rapports de production bourgeois sont la dernière forme antagoniste du procès social de la production. Il n’est pas question ici d’un antagonisme individuel ; nous l’entendons bien plutôt comme le produit des conditions sociales de l’existence des individus ; mais les forces productives qui se développent au sein de la société bourgeoise créent dans le même temps les conditions matérielles propres à résoudre cet antagonisme. Avec ce système social c’est donc la préhistoire de la société humaine qui se clôt.|§p|",
        ""
    ],
    postLorems:["|p|Même dans ses tout derniers efforts, la critique allemande n'a pas quitté le terrain de la philosophie. Bien loin d'examiner ses bases philosophiques générales, toutes les questions sans exception qu'elle s'est posées ont jailli au contraire du sol d'un système philosophique déterminé, le système hégélien. Ce n'est pas seulement dans leurs réponses, mais bien déjà dans les questions elles-mêmes qu'il y avait une mystification. Cette dépendance de Hegel est la raison pour laquelle vous ne trouverez pas un seul de ces modernes critiques qui ait seulement tenté de faire une critique d'ensemble du système hégélien, bien que chacun jure avec force qu'il a dépassé Hegel. La polémique qu'ils mènent contre Hegel et entre eux se borne à ceci : chacun isole un aspect du système hégélien et le tourne à la fois contre le système tout entier et contre les aspects isolés par les autres. On commença par choisir des catégories hégéliennes pures, non falsifiées, telles que la substance, la Conscience de soi, plus tard on profana ces catégories par des termes plus temporels tels que le Genre, l'Unique, l'Homme, etc.|§p|",
        "|p|On peut distinguer les hommes des animaux par la conscience, par la religion et par tout ce que l'on voudra. Eux-mêmes commencent à se distinguer des animaux dès qu'ils commencent à produire leurs moyens d'existence, pas en avant qui est la conséquence même de leur organisation corporelle. En produisant leurs moyens d'existence, les hommes produisent indirectement leur vie matérielle elle-même.|§p|",
        "|p|On peut distinguer les hommes des animaux par la conscience, par la religion et par tout ce que l'on voudra. Eux-mêmes commencent à se distinguer des animaux dès qu'ils commencent à produire leurs moyens d'existence, pas en avant qui est la conséquence même de leur organisation corporelle. En produisant leurs moyens d'existence, les hommes produisent indirectement leur vie matérielle elle-même.|§p|",
        "|p|La façon dont les hommes produisent leurs moyens d'existence, dépend d'abord de la nature des moyens d'existence déjà donnés et qu'il leur faut reproduire. Il ne faut pas considérer ce mode de production de ce seul point de vue, à savoir qu'il est la reproduction de l'existence physique des individus. Il représente au contraire déjà un mode déterminé de l'activité de ces individus, une façon déterminée de manifester leur vie, un mode de vie déterminé. La façon dont les individus manifestent leur vie reflète très exactement ce qu'ils sont. Ce qu'ils sont coïncide donc avec leur production, aussi bien avec ce qu'ils produisent qu'avec la façon dont ils le produisent. Ce que sont les individus dépend donc des conditions matérielles de leur production.|§p|",
        "|p|A l'encontre de la philosophie allemande qui descend du ciel sur la terre, c'est de la terre au ciel que l'on monte ici. Autrement dit, on ne part pas de ce que les hommes disent, s'imaginent, se représentent, ni non plus de ce qu'ils sont dans les paroles, la pensée, l'imagination et la représentation d'autrui, pour aboutir ensuite aux hommes en chair et en os; non, on part des hommes dans leur activité réelle, c'est à partir de leur processus de vie réel que l'on représente aussi le développement des reflets et des échos idéologiques de ce processus vital. Et même les fantasmagories dans le cerveau humain sont des sublimations résultant nécessairement du processus de leur vie matérielle que l'on peut constater empiriquement et qui repose sur des bases matérielles. De ce fait, la morale, la religion, la métaphysique et tout le reste de l'idéologie, ainsi que les formes de conscience qui leur correspondent, perdent aussitôt toute apparence d'autonomie. Elles n'ont pas d'histoire, elles n'ont pas de développement; ce sont au contraire les hommes qui, en développant leur production matérielle et leurs rapports matériels, transforment, avec cette réalité qui leur est propre, et leur pensée et les produits de leur pensée. Ce n'est pas la conscience qui détermine la vie, mais la vie qui détermine la conscience. Dans la première façon de considérer les choses, on part de la conscience comme étant l'individu vivant, dans la seconde façon, qui correspond à la vie réelle, on part des individus réels et vivants eux-mêmes et l'on considère la conscience uniquement comme leur conscience.|§p|",
        "|p|Cette façon de considérer les choses n'est pas dépourvue de présuppositions. Elle part des prémisses réelles et ne les abandonne pas un seul instant. Ces prémisses, ce sont les hommes, non pas isolés et figés, de quelque manière imaginaire, mais saisis dans leur processus de développement réel dans des conditions déterminées, développement visible empiriquement. Dès que l'on représente ce processus d'activité vitale, l'histoire cesse d'être une collection de faits sans vie, comme chez les empiristes, qui sont eux-mêmes encore abstraits, ou l'action imaginaire de sujets imaginaires, comme chez les idéalistes.|§p|"

    ],
    commentLorems:[
        "|p|La coïncidence du changement des circonstances et de l'activité humaine ou auto-changement ne peut être considérée et comprise rationnellement qu'en tant que pratique révolutionnaire.",
        "|p|Toute vie sociale est essentiellement pratique. Tous les mystères qui détournent la théorie vers le mysticisme trouvent leur solution rationnelle dans la pratique humaine et dans la compréhension de cette pratique.|§p|",
        "|p|Le résultat le plus avancé auquel atteint le matérialisme intuitif, c'est-à-dire le matérialisme qui ne conçoit pas l'activité des sens comme activité pratique, est la façon de voir des individus isolés et de la société bourgeoise|§p|",
        "|p|Les philosophes n'ont fait qu'interpréter le monde de différentes manières, ce qui importe c'est de le transformer.|§p|",
        "|p|C’est pourquoi l’humanité ne se propose jamais que les tâches qu’elle peut remplir : à mieux considérer les choses, on verra toujours que la tâche surgit là où les conditions matérielles de sa réalisation sont déjà formées, ou sont en voie de se créer.|§p|",
        "|p|La doctrine matérialiste qui veut que les hommes soient des produits des circonstances et de l'éducation, que, par conséquent, des hommes transformés soient des produits d'autres circonstances et d'une éducation modifiée, oublie que ce sont précisément les hommes qui transforment les circonstances et que l'éducateur a lui-même besoin d'être éduqué. C'est pourquoi elle tend inévitablement à diviser la société en deux parties dont l'une est au-dessus de la société |§p|",
        "|p|Avec ce système social c’est donc la préhistoire de la société humaine qui se clôt.|§p|",
        "|p|La coïncidence du changement des circonstances et de l'activité humaine ou auto-changement ne peut être considérée et comprise rationnellement qu'en tant que pratique révolutionnaire|§p|",
        "|p|Les philosophes n'ont fait qu'interpréter le monde de différentes manières, ce qui importe c'est de le transformer.|§p|",
        "|p|Le principal défaut, jusqu'ici, du matérialisme de tous les philosophes – y compris celui de Feuerbach est que l'objet, la réalité, le monde sensible n'y sont saisis que sous la forme d'objet ou d'intuition, mais non en tant qu'activité humaine concrète, en tant que pratique, de façon non subjective.|§p|",
    ],
    imgUrls: [
       "https://i.imgur.com/vuNjnFR.jpg",
        "https://i.imgur.com/QJDUkIO.jpg",
        "https://i.imgur.com/DdvEyeL.jpg",
        "https://i.imgur.com/WxstNvO.jpg",
        "https://i.imgur.com/cSalghw.jpg",
        "https://i.imgur.com/Y2ePs2Q.jpg",
        "https://i.imgur.com/9Uc0GPK.jpg"
    ],
    conversationLorems : [
        "C’est un malheur du temps que les fous guident les aveugles.",
        "La vie n’est qu’un fantôme errant, un pauvre comédien — qui se pavane et s’agite durant son heure sur la scène — et qu’ensuite on n’entend plus ; c’est une histoire — dite par un idiot, pleine de fracas et de furie, — et qui ne signifie rien…",
        "Maintenant que l'hiver de notre mécontentement S'est changé en été glorieux par ce soleil d'York; Et toute la nuée pesant sur ma maison Engloutie dans le sein profond de l'océan.",
        "Disons le triste histoire de la mort des rois: les uns déposés, d'autres tués à la guerre, d'autres égorgés en dormant, tous assassinés.",
        "Le mal recueille le mal; et l'infamie, la rétribution de l'infamie.",
        " Que l'insomnie habite la chambre où tu couches! " ,
        " Elle y habitera, Madame, jusqu'à ce que je couche avec vous." ,
        "Je l'espère."
    ],
    wideImgUrls: [
        "https://i.imgur.com/rt8UCE7.jpg",
        "https://i.imgur.com/MbhpYcl.jpg",
        "https://i.imgur.com/oiodLkh.jpg",
        "https://i.imgur.com/IjRqdU4.jpg",
        "https://i.imgur.com/tRYaPUP.jpg",
        "https://i.imgur.com/rt8UCE7.jpg",
        "https://i.imgur.com/IXED805.jpg"
    ],
    locations: [
        {
            lonLat: [3.98, 44.05],
            city: "Anduze",
            country: "France"
        },
        {
            lonLat: [4.08, 44.12],
            city: "Alès",
            country: "France"
        },
        {
            lonLat: [4.36625226871583, 43.8323799],
            city: "Nîmes",
            country: "France"
        },
        {
            lonLat: [4.83, 45.75],
            city: "lyon",
            country: "France"
        },
        {
            lonLat: [3.70, 43.93],
            city: "Ganges",
            country: "France"
        }
    ],
    //permet de faire rouler l'index comme si les utilisateurs etaient en cercle, ainsi meme si
    // l'utilisateur est le premier, on peut demander celui qui est à l'index "-2" par rappor a lui
    loopId(index) {
        if (index < 0) {
            return index + this.usernames.length
        } else if (index > this.usernames.length - 1) {
            return index - this.usernames.length
        }else{
            return index
        }
    },
    /**
     * Shuffles array in place. ES6 version
     * @param {Array} a items An array containing the items.
     */
    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    },
    usernames: [
        "robin", "noemie", "audric", "jeremy", "batman", "lenka", "patrick", "marco", "blandine", "humanbeing"
    ],
    password: "123456",
    asymPublicKey : "{\"alg\":\"RSA-OAEP-256\",\"e\":\"AQAB\",\"ext\":true,\"key_ops\":[\"encrypt\"],\"kty\":\"RSA\",\"n\":\"k105c8BZhFmeENwHL1qwvv7PFG0hLwg41Bf1iVaIe2sYO6gyf07wFhm_kahwvVDCTi76kQEfYLnNVUYyXaWxs5xVE83Wg-cvU8vN8W7jwgvJpiD3Rqa7a9eg6DRjZ-P8mV30f6pxeNdnGhUaJxYssEBUJhVtbQdkw_Id2QtIOuPBMHSGyR_E5uFm9YjbncOs-LgQydIS9vB1Xa3rtMBUCK9ECsRR-_qFCy6uhghfRAcetw1FQtDqyGiCvmeF1azzfCD0nYEGGnNDC1Of4C3_1vmBOwY2GaqIL7OsCHb03A1ih-RFqkdtcAjjnrj3H6xTDTkYcfSaA2yAvMq2gmwCxw\"}",
    encryptedAsymPrivateKey : "Pe33eî}!>Â¦õJîÒ\"¹9XO\\`/õ7|³{èô£ôE×áÑnCP¬#í{\tÃwÅ°¥ gþi·éá[då»çi)¾È\fQµ®¼ñ îÖ¾ÍBZ!Krã\tWÉi\t-Ra,ð0½Tóeä)w¼Y>dÛÂýä©¡R:q1=åð·ééó©¥y¿&ÒL±Kl%LvÛâRÂN³J\f«eþ,%*¤&¶\\mÎç ÎkòÏ'H'!\b1§TúáµÝ#azÚèÙ>qÜ\t°@?\bgtÍ»dÕ·Nof÷BD°÷°UÌ N^¥¼´Vc=Å¤?g¤¢*»Æ2l*ÓûºWë0×¬ãæé+¨}°V[nçéhqØ@w;o,TSÄâvhÁÿ )¼ÞtAÚ,òÖ.ååtØL¸ÂÃîçkc?³¿W£yÅÆWôÐ-kñl(½ªá¢¦ÉÆ#6fÐÖÛ]õèB ´K§aWÉú:ÌvÂBB·.Ô.<LoTñ%&ábëô ´_ÚyåÁ(tøM~=[ÓVêj²-BúÛp;CïEÚ}Fµ\fYÆ®5\\þbÊñ-\\µ¸ì\n" +
    "6gI×¡,º­ñ< Hû.åû÷ [î»øôÚÇbv°!Ýé,Gî5Y^Ý±[Ô~óÜEîE4zWíÆð'+Ë£Ô\ft}HÇmyî&ÐýÛs¶m¼¬±Æ]æ¯1=¼´ÜËôÇñÕ°·^ÞÚâù>Túw\tN8ÀÂRðvÔkòðT]Ë@Ùå·#9õ'únGùWE|BdyOøîn1Ò¢&¥/ºàwï¶çÚê;¥`(EX9@Æ6#Y¿0\"(¶k ê×Cv¦ñ*½±¿ÙñÀ$/ò3ùyÌ*ô´ø \n" +
    "\"1ÎÙÓ¦ð+%Í(n0»mj °6Oc±¿!V4ëC²m®¥_\\kdh1$x¦7*ûëÙßGÁjÝù¹&.<ß%·þ-Ií\t^ìþ dc¹6é 5êáÝ=Î?ÓSo÷¯ùñ;ÎÃüg'KØ;ñh35µzÁÿ_VDÌÚà&2XâéÝÌ9õ\"Üok¿èÊo^8Jòf¤(cê/\tæéÝºþ«ùG{\"e¿þo¿4LËå|Ó©V¢-îéy½Ò·RÄzbÒP$ÊÃäº Y u¢üÿÿÂZÒºÖ½kÈi¯Ø&ÆaÍ¦ý[w±¥·%|¥þêµðËj#W'^dÃ\fÜßáÚ3¯ô}è9\n" +
    ",~ø,IÔ·}ÖÂOÎ6;Ï°Vß~ÌXOÀ#Ð-ÚØÈbý´Áµo3!C±\tQý±ãñ5X«DÛEÕßrË¦ò»<Üê)üþËçÅp§¸í¡3ÐjòD4ípÊöKöî¾£Æ0äK)ôFX*LQ{<ªÀåaCAF30dIYeÆKuT`¦\b(FäÕ[ï//©9 ¢¢g°{r¼g¾!ÁMôlôT¼¿½ð´H|;oPè¥x@rEø=vD®­\fÔ ÈS¤ µL\",½»d½!»¿dØeÿ[3=Ç0S¸£ÐWõlcÊOf~¸·X\"z®1Ô3º\ffµ\n" +
    "[)²ûEÜÉéÆõ=¯¤É·5£-oOQv~nÿá}ãD ½å\"á);RüÇ÷^y²MEiÙÍpMÊ4îrøÂÊQÀp³òÕ%oJHnã6W©b¹´ì5K-Ðü¬-êC¨UÿPõÙM¤õýA¬°¬däoYÉ²¢çRy'»çt²¹À/' Â\bÀ'øòàÝ¯ÓÉà_)5ÊpÝAS\\}á®\n" +
    "k\f¶o£Ô%½.çÈÝîUmÜÞïè(µÞ5FçxU8S¹47¦ReVäuþWÆ Èj·¿ T(#¥H²",
    projectAsymPublicKey : "{\"alg\":\"RSA-OAEP-256\",\"e\":\"AQAB\",\"ext\":true,\"key_ops\":[\"encrypt\"],\"kty\":\"RSA\",\"n\":\"u5FdwLtD063QBZUuHL0OGsHEspWhqAPi-4mSJ7qjUM6onye3W_o9t3w2PNunlTX1HwAQgPPZWizlL9UCcO68ahDpeteEFMgpvlbVnPd2FRMGmsutDeOD82EmR7MB-5M4zb0bRSkkPIni9w4EFC0beU0iLDp9bCCDYITmUz1CaldHUOcDkds0_XOJxXSah46cAY_xYD0CGmhMCq70gHXIG_P4IOXL9e03QlbDaaWLf96lZJA-76_wy_zYrVgNLpMUn6yrp-q3HwDZ4ebhVuzyG0kHA2Nc5nOoWRW2hJCPEtZPQObNiMh2P_qS259Zw9zOBOfhHX2fNOcEKUHrOkQY7Q\"}",
    projectEncryptedAsymPrivateKey :"?jdÁeéÉ`æ8++¯ÛU8äKÆ¡]¹÷DRIb¼-ç¯lî)|äÌù¯§Ú»ëÁð{hÒ¬é¸ä+ÑáòI¬~ÜN;±¨Îbª¯äÊ$hXÐY¹ãäÌâ­(4\f*°Í?É\bA\"¼ú×ÜIQvÅ<HÝÃ?@¹_ð<z»#Ó²ÝÑ?Åô\"¢z¸±@ñóÁv3¹^®t´ah$h+ëÓ+Þ/_[j«H4W.æ+í'4Ò\\ê\"-Ã±:ÅÝØS\\ø¾â'Ac\büL¦ý½Q$\f? ûëÚ`tçtuá½w'²PäÙâ8­ÀZPnãáóÞ3_þ3H²:(½iV3ZÌ|ÓßUÒtNJ].¿W9~«ÆÜgke.Õú'2GØ³Ùz&¥m÷GÆÊUA6÷»SÈüdif?uzlL®þbÅzJ1gñÓ6-e|Dò2Ç®¿^AäI÷ÀºåíPaÀÃø:>µ¸­|í¾H/*Rþû7>U¼¿ùKó}\f¦Á8}¨0NR~{xJFÝ<¼ÈCk,kR·aÊ\\2Ü¡S1µf7ä\tç®«NôÚuuLvVDt´- ÷¶]6Eê7[0$Ù'R¶b»¿{Ynsú¢¾À(èú¼6+5TnT¯Ý¿åâl¢ÔüE±ã%8S.í$Ö/¡«}aÚ´:½&v|/¸[NW×µ~Ï×N{éYÛÃ|1å÷°rK´æsp(#çämãÌÊ\"ÚJ |éöÒE{g+nF¶j øyÌjSçDÓåúDÎÕÒk%²ËTµðã'Æp[ï\"ÍgÎz[^ù­Y¢vK/Ô ´KêZC¯£û®µ»ÒxÓù:ê:P§-°ÃåhBZ±Â<ÆL¡³Úã-¶²»°À7`YP6?T+ ãn?|yp\f<Q+Û. ËWÄÜ¢ð¨êÁÐ ò7ï'ÄR½@IV0lÐÀiCtmóÒu[°WhG~PGe(º(tÌcf\b,VØlD*ÚS¹AëAhÐiµ|\b&Ò¬YÜ»]Ê}QéwÃd>SUÍànnÆ1bZy°X~.L.a\"cMôl°nÉð½®ØÒ=vË>ANnoô¬kcãì»8×Z'cZ»ê8Ý\"å)eFñÚð{g¨d\tÁnùUFV´ÆÍ\\z0×&Ãç@R*öÍe¶÷]$>mO:èßR!_Á\"øWºÒ·Ýç©K8°Ï¤~Kea\bó8[W­Ü3zz{@F¸0E±P=xâuw\\FÛË)ø\fÉ+áÂèÄIö$îãï«ðÔXTWµd¿±'º»!éUT<<¾ÜÅÕá+$ÍkDð6VËjüï×ãûûù©¯§°4ß¦¬9¥Ò¯úueS5Ý¦âº¥ÄE0ÄWjàCÑü®v(ZúÛ«õ9¬\tð{ªõ~ãÇ&¬1õÊP~áC¤l±xóô}ûê)ué¿fÁ^·bå'$Ì&¹iiwý~0\\5Yà¨½UT¿©÷É¬Eé[Â!Ñ·Ð.¾bmØÑ´\tÏþwlÆ(=b#sß®ÌUø£c¨,·ä^O^FÇtkAOBõÈÑQåZÍêä9z¬¤DIqnÓÔÕ¬éñëu6.yÚÜ¼ØPy£{Uºõ®ãíSZ>°.×Ø,¸æ]%?À¦ªg§»ûV Rùöù>~ê§LZjÙauWùO½!ÉVê±(}dzÞvUC­üwY,å\fµÞÎD\b%*ÃØÓ¶¥Ê°~v,²ts[n£HÛänÚH³ÄþæóiÙ*§8gõÀ0¦ÓVÔ-Jw)âþ l®®%sÞ6µzÅâ¿¯-¯¡Xç4Øjmm9ÃÃÝÜèS³¿NWZ¿ÜäÔWÄ]óFÓo2òOG§KåÿñJÔ²s0(ê*èNíít®Õ÷ø¿UD-Ï$`J",
    encryptedProjectKey : "KzE òBÀé×RySØÍùw$PôyßÁÍI¿»MOÒbÈ{=1n~HÅúäi±¸8½X>À2SXÉÛËñ07e\bÀ)Öøãø-àXçyEÊ¯Øó.÷\tçëÙb!÷<éÑä|Ì4°Ã*ì®jåm6áÔ8î¨xr6~¯í»î@!Ô÷)LÔXmAÖs:PÑ,vtE»Qb0«+ªfÂ\"oË4¶¿ÌÄ/_U/ìFÉP£c§ÙFl¨èºæàpß 7sojQþqîå§öÿÜ>"
};

export default Fixtures
