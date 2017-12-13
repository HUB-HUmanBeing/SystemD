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
    asymPublicKey : "{\"alg\":\"RSA-OAEP-256\",\"e\":\"AQAB\",\"ext\":true,\"key_ops\":[\"encrypt\"],\"kty\":\"RSA\",\"n\":\"vGiO6_34WTb7nwlkw98kiDEtcH8IV0943T48LWlJZ8iEPWtCJZAFl7r4ovlfZ-SLI1ab1qrgc-QDIYqxxUrd0nJkD3GgbQl1hyg3RNzdUcumr6uWwKt5ZRkbxaJJ3e92C89nM07AsWFtTIpS1UhAtLoJBKPyDLxOd04yybOmPbc-qZhdG_5HySsfHSUV2GV4lGJYQRMZJ0ckvkjVZ7GkkzclfwISLzotLn84rFycb4HCyMJ89GN7VplOfxo1s_U4tGElJmFv3lp7eGeird2lo2tbbKBg5QYmiHWAlCD75PD2oFd5NHhQNJm7vQi_GIogsEx-pcbGaz6Vf1OKurIjPQ\"}" ,
    encryptedAsymPrivateKey : "<SsÏ!Ú¼2ÊíÕeXº*&¸RÿÇñÕJG³¢åQd®Jë?³ÖGÑ× ·úHÝ8z¹¸Ö9f¦K`h3\tg5ôå\bS«¬ÓÿÑz0&>¾*`¼üçer þù\"Yg¬\fhJ¡æªjãnz17mÌËñ«sVÓ£¸ßÜj-¸¥ELï¸R¨9Úk¾x:X±a¥Àk±%OG¢zm\f«cÌkx¹sÅD!1ïXfì8IöúEMH.õ[\b;CMÀçÄ]ñ¬}Á¡¿Ô¤þ7ÍÁ~n\"Gb8´Ý}P5Û Ê¾§f~7'n[~àòµÞEÜt!âRT¿\t£^0&°wMü4¶ºvS!MÓ~È8¡rññÂQ©¥>°8¹ý~`u¸ÃÊWx}9è=ÉG Rnù¼<§ôpÂdß£[|ýì©ú´TÁ%©ËhÀäyàG UÐ¡óÊõ»1Î°xF;Õ¥@D°î\\ +­Çº­3CÊOûnñ~{¼qo ãÍhÛ_\"ro?ÇF\bHÿÍ~.Ääëµ7qÈØL1Ý¿·ÒÃ²¸¨j#p²ªîÒ'ÍàÛÕrËz/[}y¸¾¨Û]'Ô+NLGXHokíÎ÷¢Ñiê(2W<ÓÝë0\\«@¼xg°YÇ.µËW0¶d; ñÎjöÐ]bé°©l\"#½¢D>\t¡îÈþPêd\\þ^ö'CÍz'IlÛN\bàÖ&Zb¦#ÕòÙ0t¶qNÓ]-ÕÏeþ~¥Ò^qff¼r9{êê&(´,z,B[ØÍåh9LóâáÏ¤w°ß\f0ðÆjÙQ[\\ºõÖdÞQQ¾ÛöÀë\"F\f+L#H£n³4h\bgËÙtòs^pºôôß¿@IÏ~¬ÿÃ®Ø9EØQhÄk-áC\bÉ6ÜÆ¯Ø¼ÿåE¹>ûû¿Çwg6Hw©Ý>5çÏVù\b£meÇÓÿHHGÜ¯@¯bR°ýd[{xäÍìUWQôJiü#XÕzÎa©gWgíî*âÓ4}¨B«Ö0´´·¤lw-AÚx>l¿F\\X@f7¶íªÜ/I×tvÇ}î_ßÂ5ÿÒ6b®¬Cóð»@MôH~ã=vnXe¨ß{²QâNK\\j,ªÎ{cËöêK3±õÐý¡µ5GSSpü\fSUÖ­îª7fJ¿e-¿M¡1¥÷R¨¸¡ñQ¢j½õ)óºÆ=m{¨{ÞØð6Üm#¢÷:/8Kèª\b¶Ö^\\è.;Ûg,LþÆ¯gý¬t*Ý;EXC­ËPAË_èÇ37³;ÇfzëÜ¾»!D¢#e.Ñà8p¥Pµu/*¶LM¨Zù¨ÔGyº¬®?º6GÞ?ÑVðÍ´öDié#`V-R¼sÏU¯ü¡¦6Øj(ö_1ïAVÈvgu°G\"ZÝ$Ù²Ð7\"Àµ×&kxhn¶¼³¤ÝZ ¡°¼ñZEî8³êÂJê)J§\t¤!`§a¹Å¦YºwFÍ©påwv/o)ê$æv7æ®*&3F}+ BhÜVÀÆä|©ê³¤^p[ªºUk¹ñ~©´Ó´<½e}Eçcb°@4£-dô³\fØKN?äÎ·%ø(ËF(O-!}©ËÜÃ?ót×ùEMÌ#W©sµüá~sjPÄk\\¹Ð ¤¡.¯|»åW×SjGñ«K.ÙÕôo¹7U¦sÙ¸ D àsÛ*+£ »JÿÒÜØbV-c#C2JÅ?Dz»~ÖYç¾­³èé1!Fº[óRç/¿K½@WHh'>¿j­uØ:$|è¦BPgö×{Á!(¸\"ófZ¶ëtGµâ|\"oÿ®6ÿÓã#lf@P¼4®F4nbs8tMùzTzPþ½KOäïÓØjç`TÙ\\",
    projectAsymPublicKey : "{\"alg\":\"RSA-OAEP-256\",\"e\":\"AQAB\",\"ext\":true,\"key_ops\":[\"encrypt\"],\"kty\":\"RSA\",\"n\":\"rHQ12I63qXLej8mx5pPzVwu13Px3iQv5R56xPQWPxeDyeQbbRpy_WmyFksruhcmulSBCTLfX5_aqdhJ6RmrUplKy9ft1ptRSgsjSKGi1pX3a1WwwC0EopMroj25RFN4cHfBX5ClB_sJ5vWM6hnKlcOQe0_iIq9FA9au8XnoUA6uEJE_l-uhJp81PsAfEj51pFm9klneyj1eox9kOgfeYdFaPPxaG_pvy0tFyTU4Y9euMnI18tqMZRO1luQVBPg8YxByiyBcxmMDswD3iIFmn2h2ubNnarDGLNXDsixmh3aN7idBkrD4PHEdLMkc0f8CALgM_bKlNN5Z-XcuQSGGUBQ\"}",
    projectEncryptedAsymPrivateKey : "i½jû-S/\"Ò\f,\\)þÌÈeÇ=Lÿylq³dsÓ¥üDeÇå4¢~Ü)/¯UKÐø¾4Ç³Ä¹n¸|òsF´ïÕ¯½=bé;ßP§vÃjåñëzsqìgïmLÖýn¬ZOKhVíA§àqûtk»N8ÍvJìê³úÌÐÈ}©¡`8ûëÿlZaE/-|Dº#Òvxéÿ¬ßs\\%Ðmh±ÏKI7ÂaxÊ­Ü´uÙnuLu\"µsVCO·_Ó^ZÝ7rJì=Ú;1(N'vÀï1;6JãTê¬¨-Ë[`Ú©nç±¶}\\yhßó6ZT©ímç»®®ÀFæUË_o»íÏÖÎIWLÞO9ÐÖ;ôYÙlçðÃoÂ5ðñ4vLâ«WRwz\\Ó]bµ×mhÖÞ14éí BäQF¾¹2ª»3©ÐKMÇõ´¤ÉëÔ2-§hoíßÐJaÒ\bYÊÑåxùÀ(ÍKÃyÛ\fW8èØ\"qìÄ²f1_9{ËP÷Åêr\f¾(i¸äüüÜ3­wQ:2}¯ÀÕE§T`kâ¿úæØWÌñ.ùFø>\ba{v#®ºÓ®½1%QÜ22Éxé¸M\\¶_´Ï(Ú5ïbÞÄöâîÀ0î_G{²'GG#Ð,#OZG»ZÿQ°Üà1î7íT$Þ¿ÕyÔp è°ÚI|æà\"ÍIÅÉØ[óÕß\\Ê¥ÑA\fêHôHTÏ('wÆ¬NÇSc3¸ýN²£Ýé¨\\²rLçvIà7$ ïî=Rì_@Ê&óévØÕO¯ª¶k'*ÀÙËûK².I±ë»´xÀ¥hâ>ÚéÒ^Âá1_!Ã=ëW~¯$TÙS_¥[Ü\\±Iê»çµ¨á³}ÚºÓ]¬êUÓªoª¾¸¢ÃQþÔæ7é[SÃF¾ôïîf-)rÏÈÞÏZl¯@ªÖéè4¹Ñ1Í0bV?þwFezð~ø«ÈØáÉraÆ«b³zf#åÇW³¼íÍ)ÕXò©ùV=7~T<iÄâö_Ø»âP-r!YÖQº»¿wL¬ýlÂ¥%@}æz;OËT¶â±ËË¢ä~ ZìuÛ2J-é¦VXÇï¹<,åÒ*k7±ð*=¡º#ï2¹êê$Kõ\\ÐúÐ×îS%:JäìsÖð%3/ým&äápÂVUõß'ì×zYàI,¾ô¬ÔC'ØeÏÉ`Å¶ó(7º«?<ÜÀÅlí`++:[ÌÕf?95Ãúë³iÏ÷%còÿ¿#ÎI+[ò}®Óú2fê<A½ÅÞÝ(µËõÔå=#¿\fÿ4Þ:2²#óÅ¿à]¥kOkÕóçÊ£^svVfVÎ\t²W®z s9I`G¼:½Ó+Ä¬\"\"¬Z\bædUô28ï¤Óý/PWÚ4.Zq%l4¨!au-}ætFêqD'Åçv!ôVaoUWR®v1Ú@÷=ú¬kÓ?Á'A´¹c`·exàªÁÊzOÑ§}Ä''æYÖGCÈ.úÕAßdÉ§ù¸Ï/bõ°´³NX\"l`=+ .ÚAÄÎÆ>¥Û\b/ðuAÚìYÖ9ó½Itæi9M±Rôª\"ÎvaL*0%qo\b^Ë¢¹+#¿­\"¸@ÝöÎë4wR|¤ÇÄZwÙ,ËÝ#_®{Xt÷ú\bALö^©ye0%p°õ9(q+_³aoûf.rJæ2Ü¹g*59g¼ºÐv/ûNgèºÀÒR§ ¹ÈÇyu=l2+ºUfAT÷}ÔÏð¥?Ø¾ò²Ôh¨WþüEÁã.ú³s=æZSóÄí(D>\"®%R=mvÎQg`ñýÝ»ã?ïJ«¬·ÏÏZ¿å~ªk´-.¢R.½|\\äþp¬ÖÄ{l+MòDíÇm\"\fmÜ",
    encryptedProjectKey : "zØ®úÚ´JFRWU]Ä3ôÕlêB(Ï7Û0UQ¦¼°VW4þo\fD\"¡X:£QíÁª+ú-äÈÅäÚCq­¸ëÆÙ æËcõS\t´.qÿß­Asc+ûfm2Ó_+;7Ùã^®ÒÉI~¹DgÎ¥¿;>HrÚEønYæÃbÜü;¶øîêÿf¡0Ï³ëë}âD½ç®IncQI¿((ç8/ÊZHx{Hlc%ËÉëiRBX÷ïJ\"3äúS a¹1Ä4¤ãZ"


};

export default Fixtures