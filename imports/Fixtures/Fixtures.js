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
    asymPublicKey : '{"alg":"RSA-OAEP-256","e":"AQAB","ext":true,"key_ops":["encrypt"],"kty":"RSA","n":"x8r0fEIKX3JzlaT537eVqhlWTOcFDxYnYPBoxSJ-h81tPrUJF8mwucmEW5MJYlSLPBjWt3Ovb7XPjc0aweOX2jXRe68INjXFMStRVorSJDMYOw6k8SQvkkQrDRWZnWgOK7cvQDckKTcqkhoj5SEqKL-xYNjUgBeUaCTfv93XauoYBmcg7s4t7j0QLvyYw5Us37dZHd3MaMjRVi36avBspl9ywTq4Dww37F0mfdYgam8gB1pslf4K8xTEt1ewtHBH4ujUDHjDk3steANeU6o1d6dKWLaRYE72NLVsD86ndSOhgvmTjzD3hkWnr_0BWC7ZmfMQFo-2DtBem_dU9JRVTQ"}',
    encryptedAsymPrivateKey : "[148,80,101,51,135,51,101,238,125,33,62,4,194,166,245,74,244,134,41,209,224,106,10,72,89,31,155,102,100,59,120,124,204,73,227,129,251,78,92,102,213,113,194,67,229,88,157,67,200,221,72,40,56,66,179,70,85,158,17,4,155,74,138,46,7,183,175,247,250,119,170,15,130,151,139,135,169,12,221,248,200,8,123,65,48,163,133,180,32,112,120,224,87,166,30,119,207,243,99,6,197,191,81,196,54,58,133,146,85,154,158,172,144,245,189,92,46,147,223,114,230,219,245,253,199,92,128,159,17,227,187,77,219,159,227,197,109,67,152,119,1,2,5,70,19,126,87,146,46,103,97,106,12,8,212,72,10,206,181,97,252,148,59,64,21,83,25,119,89,105,17,63,55,163,56,88,59,197,133,109,37,130,67,210,158,149,17,126,79,182,221,226,14,203,37,69,239,55,29,249,103,201,94,166,254,164,92,178,186,252,240,8,149,90,251,13,27,152,200,220,181,11,81,63,176,14,108,160,137,100,224,114,9,231,123,122,230,207,225,188,11,31,154,70,58,188,116,89,118,59,232,110,128,92,59,69,96,116,203,60,34,38,36,65,115,156,118,140,159,152,70,166,156,160,207,245,157,115,32,91,66,98,4,24,29,46,168,116,82,31,168,97,175,97,206,191,190,111,245,186,65,84,203,146,223,19,233,101,58,144,200,169,210,119,139,139,142,150,183,162,224,170,34,53,158,242,223,138,98,83,10,4,239,64,93,21,72,88,221,247,75,190,177,22,226,170,46,116,152,57,176,238,62,156,183,128,190,20,5,119,25,164,66,159,210,238,146,102,10,9,122,128,165,22,224,101,204,27,149,173,1,221,244,125,178,85,247,139,156,90,145,159,197,131,107,228,241,89,79,201,180,190,147,38,56,99,164,23,143,231,223,85,115,142,147,79,93,26,60,78,30,30,147,19,234,206,189,81,250,244,141,38,51,213,84,78,186,139,21,99,1,133,236,229,65,9,169,50,176,166,116,144,94,120,175,3,66,229,242,184,247,75,230,22,127,204,120,152,47,30,239,139,189,76,199,185,201,31,229,191,145,65,83,44,23,146,175,4,216,215,120,51,147,109,10,6,77,173,251,186,133,97,148,154,34,174,205,118,12,92,248,3,167,144,240,239,11,225,82,2,11,235,197,168,228,60,16,186,145,217,54,148,42,105,11,250,39,56,42,99,183,21,48,132,34,192,125,217,21,129,205,73,12,184,195,175,210,48,40,32,201,121,204,242,102,51,201,71,111,17,169,54,28,245,157,25,185,229,138,142,79,251,67,58,127,49,153,46,251,170,185,93,202,115,82,58,58,225,35,104,113,124,15,90,239,134,2,7,220,44,250,36,240,137,104,19,229,50,53,22,229,250,98,189,17,240,6,215,107,74,66,8,97,195,121,107,107,82,67,173,24,201,88,19,209,221,233,223,122,7,183,193,117,185,0,214,108,66,61,40,151,18,0,246,30,118,207,200,180,127,168,155,72,12,137,7,47,151,185,163,164,236,3,46,235,224,36,90,248,194,107,61,113,76,126,241,84,78,145,217,2,27,214,109,78,116,122,103,107,65,131,5,124,180,217,118,48,162,60,25,182,31,21,55,57,37,37,123,27,53,137,218,161,127,106,50,107,169,211,61,135,160,77,162,1,182,73,185,177,211,159,33,38,83,162,231,171,156,200,2,65,219,218,66,74,43,160,254,207,92,56,169,189,194,132,253,88,111,93,112,131,4,221,100,244,111,21,41,246,35,161,28,4,99,179,54,15,162,44,104,23,29,227,148,133,129,0,40,98,127,208,127,193,99,81,123,196,23,52,177,101,188,234,213,132,218,108,7,163,25,116,64,149,131,108,1,127,13,49,73,195,114,98,161,12,166,131,141,96,188,133,149,111,94,153,194,53,243,97,37,66,110,177,50,73,0,131,252,196,93,6,151,40,132,233,103,9,225,148,45,5,167,97,171,12,172,46,137,226,244,147,69,182,88,228,53,158,231,44,154,12,41,188,69,102,63,222,173,102,26,65,41,151,163,33,9,232,249,165,62,131,15,93,67,5,60,13,15,143,214,22,209,0,38,87,42,46,120,25,197,109,1,232,79,215,179,13,67,0,227,110,100,130,124,86,2,57,252,119,48,170,84,66,156,30,38,115,78,142,59,161,60,119,187,30,46,177,0,149,243,85,132,91,17,167,130,5,195,221,69,73,108,47,41,127,131,254,242,11,251,71,31,249,23,18,176,214,56,214,60,203,47,161,116,30,66,49,186,140,202,254,189,39,227,205,157,245,135,69,11,120,24,125,2,99,125,188,26,143,185,117,248,252,188,12,4,173,252,22,129,246,253,141,3,36,172,60,170,0,128,55,250,187,213,92,239,189,220,134,63,17,173,232,104,206,129,4,30,47,107,177,84,88,233,243,73,85,212,246,186,202,88,204,55,205,86,124,181,122,70,237,124,95,107,33,218,207,25,149,246,225,121,17,0,175,72,157,239,43,46,101,196,24,33,136,45,218,100,11,183,22,130,125,210,32,108,66,187,222,222,225,84,98,16,154,17,113,175,122,11,6,96,41,217,233,150,8,107,107,157,126,246,23,204,86,162,86,249,91,253,173,120,52,67,72,115,9,133,114,242,80,46,224,66,97,99,253,47,184,180,182,224,6,37,254,225,105,78,189,213,25,80,46,107,41,178,161,36,150,36,14,1,59,41,181,239,78,215,43,174,156,203,113,235,17,167,65,100,161,244,57,110,70,153,201,203,0,235,189,46,57,180,99,122,235,200,107,72,189,117,180,141,177,197,2,63,101,200,158,11,25,172,122,200,75,169,242,49,238,75,136,114,204,215,237,10,208,227,29,0,193,199,15,5,8,174,185,83,81,208,57,209,32,154,46,201,158,111,94,7,189,63,210,109,20,155,128,166,217,1,94,111,220,245,35,247,93,117,228,155,191,149,37,26,227,106,137,27,153,219,80,190,153,117,42,247,196,156,198,36,179,2,82,38,125,35,193,8,10,10,12,138,69,88,92,134,235,173,238,180,245,131,29,27,21,210,1,244,72,141,53,111,209,225,135,48,189,168,31,3,112,237,107,195,237,125,177,58,213,246,245,96,184,67,2,236,146,97,213,134,240,40,118,98,52,65,218,133,227,106,158,0,141,190,10,35,187,159,169,226,220,20,26,158,223,12,56,154,51,112,82,253,44,29,156,15,245,204,65,241,94,73,81,212,101,89,59,29,136,157,156,85,152,210,180,17,201,66,134,88,59,134,81,165,22,109,246,234,49,115,149,36,108,153,82,167,204,93,252,58,61,6,136,165,146,38,204,102,99,218,142,23,86,107,9,60,141,83,28,53,56,185,242,83,94,137,175,252,37,34,68,176,127,136,223,35,83,135,252,120,28,74,63,142,196,24,201,182,248,217,48,240,145,77,181,252,103,149,26,251,134,84,170,179,109,76,37,76,16,55,174,43,236,78,60,85,105,3,251,114,242,146,104,131,92,240,148,206,106,185,112,35,242,196,0,202,200,53,152,12,123,136,100,93,251,101,183,41,149,3,88,11,218,227,119,199,46,125,104,7,213,64,196,81,171,82,240,244,157,156,255,150,165,39,107,214,184,202,60,63,254,165,198,253,113,138,130,219,106,163,238,170,228,170,107,95,52,169,85,78,113,103,181,130,115,9,184,232,171,0,97,196,21,151,12,65,133,237,32,202,128,66,65,232,246,202,155,209,254,45,74,236,0,117,232,152,228,77,88,202]"
};

export default Fixtures