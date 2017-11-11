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
    lorems: ["Dans la production sociale de leur existence, les hommes nouent des rapports déterminés, nécessaires, indépendants de leur volonté ; ces rapports de production correspondent à un degré donné du développement de leurs forces productives matérielles. L’ensemble de ces rapports forme la structure économique de la société, la fondation réelle sur laquelle s’élève un édifice juridique et politique, et à quoi répondent des formes déterminées de la conscience sociale. Le mode de production de la vie matérielle domine en général le développement de la vie sociale, politique et intellectuelle. Ce n’est pas la conscience des hommes qui détermine leur existence, c’est au contraire leur existence sociale qui détermine leur conscience.",
        " A un certain degré de leur développement, les forces productives matérielles de la société entrent en collision avec les rapports de production existants, ou avec les rapports de propriété au sein desquels elles s’étaient mues jusqu’alors, et qui n’en sont que l’expression juridique.",
        " Hier encore formes de développement des forces productives, ces conditions se changent en de lourdes entraves. Alors commence un ère de révolution sociale. Le changement dans les fondations économiques s’accompagne d’un bouleversement plus ou moins rapide dans tout cet énorme édifice. Quand on considère ces bouleversements, il faut toujours distinguer deux ordres de choses. Il y a le bouleversement matériel des conditions de production économique. On doit le constater dans l’esprit de rigueur des sciences naturelles. Mais il y a aussi les formes juridiques, politiques, religieuses, artistiques, philosophiques, bref les formes idéologiques, dans lesquelles les hommes prennent conscience de ce conflit et le poussent jusqu’au bout.",
        " On ne juge pas un individu sur l’idée qu’il a de lui-même. On ne juge pas une époque de révolution d’après la conscience qu’elle a d’elle-même. Cette conscience s’expliquera plutôt par les contrariétés de la vie matérielle, par le conflit qui oppose les forces productives sociales et les rapports de production. ",
        "Jamais une société n’expire, avant que soient développées toutes les forces productives qu’elle est assez large pour contenir ; jamais des rapports supérieurs de production ne se mettent en place, avant que les conditions matérielles de leur existence soient écloses dans le sein même de la vieille société. C’est pourquoi l’humanité ne se propose jamais que les tâches qu’elle peut remplir : à mieux considérer les choses, on verra toujours que la tâche surgit là où les conditions matérielles de sa réalisation sont déjà formées, ou sont en voie de se créer.",
        "Réduits à leurs grandes lignes, les modes de production asiatique, antique, féodal et bourgeois moderne apparaissent comme des époques progressives de la formation économique de la société. Les rapports de production bourgeois sont la dernière forme antagoniste du procès social de la production. Il n’est pas question ici d’un antagonisme individuel ; nous l’entendons bien plutôt comme le produit des conditions sociales de l’existence des individus ; mais les forces productives qui se développent au sein de la société bourgeoise créent dans le même temps les conditions matérielles propres à résoudre cet antagonisme. Avec ce système social c’est donc la préhistoire de la société humaine qui se clôt.",
        ""
    ],
    postLorems:["Même dans ses tout derniers efforts, la critique allemande n'a pas quitté le terrain de la philosophie. Bien loin d'examiner ses bases philosophiques générales, toutes les questions sans exception qu'elle s'est posées ont jailli au contraire du sol d'un système philosophique déterminé, le système hégélien. Ce n'est pas seulement dans leurs réponses, mais bien déjà dans les questions elles-mêmes qu'il y avait une mystification. Cette dépendance de Hegel est la raison pour laquelle vous ne trouverez pas un seul de ces modernes critiques qui ait seulement tenté de faire une critique d'ensemble du système hégélien, bien que chacun jure avec force qu'il a dépassé Hegel. La polémique qu'ils mènent contre Hegel et entre eux se borne à ceci : chacun isole un aspect du système hégélien et le tourne à la fois contre le système tout entier et contre les aspects isolés par les autres. On commença par choisir des catégories hégéliennes pures, non falsifiées, telles que la substance, la Conscience de soi, plus tard on profana ces catégories par des termes plus temporels tels que le Genre, l'Unique, l'Homme, etc.",
        "On peut distinguer les hommes des animaux par la conscience, par la religion et par tout ce que l'on voudra. Eux-mêmes commencent à se distinguer des animaux dès qu'ils commencent à produire leurs moyens d'existence, pas en avant qui est la conséquence même de leur organisation corporelle. En produisant leurs moyens d'existence, les hommes produisent indirectement leur vie matérielle elle-même.",
        "On peut distinguer les hommes des animaux par la conscience, par la religion et par tout ce que l'on voudra. Eux-mêmes commencent à se distinguer des animaux dès qu'ils commencent à produire leurs moyens d'existence, pas en avant qui est la conséquence même de leur organisation corporelle. En produisant leurs moyens d'existence, les hommes produisent indirectement leur vie matérielle elle-même.",
        "La façon dont les hommes produisent leurs moyens d'existence, dépend d'abord de la nature des moyens d'existence déjà donnés et qu'il leur faut reproduire. Il ne faut pas considérer ce mode de production de ce seul point de vue, à savoir qu'il est la reproduction de l'existence physique des individus. Il représente au contraire déjà un mode déterminé de l'activité de ces individus, une façon déterminée de manifester leur vie, un mode de vie déterminé. La façon dont les individus manifestent leur vie reflète très exactement ce qu'ils sont. Ce qu'ils sont coïncide donc avec leur production, aussi bien avec ce qu'ils produisent qu'avec la façon dont ils le produisent. Ce que sont les individus dépend donc des conditions matérielles de leur production.",
        "A l'encontre de la philosophie allemande qui descend du ciel sur la terre, c'est de la terre au ciel que l'on monte ici. Autrement dit, on ne part pas de ce que les hommes disent, s'imaginent, se représentent, ni non plus de ce qu'ils sont dans les paroles, la pensée, l'imagination et la représentation d'autrui, pour aboutir ensuite aux hommes en chair et en os; non, on part des hommes dans leur activité réelle, c'est à partir de leur processus de vie réel que l'on représente aussi le développement des reflets et des échos idéologiques de ce processus vital. Et même les fantasmagories dans le cerveau humain sont des sublimations résultant nécessairement du processus de leur vie matérielle que l'on peut constater empiriquement et qui repose sur des bases matérielles. De ce fait, la morale, la religion, la métaphysique et tout le reste de l'idéologie, ainsi que les formes de conscience qui leur correspondent, perdent aussitôt toute apparence d'autonomie. Elles n'ont pas d'histoire, elles n'ont pas de développement; ce sont au contraire les hommes qui, en développant leur production matérielle et leurs rapports matériels, transforment, avec cette réalité qui leur est propre, et leur pensée et les produits de leur pensée. Ce n'est pas la conscience qui détermine la vie, mais la vie qui détermine la conscience. Dans la première façon de considérer les choses, on part de la conscience comme étant l'individu vivant, dans la seconde façon, qui correspond à la vie réelle, on part des individus réels et vivants eux-mêmes et l'on considère la conscience uniquement comme leur conscience.",
        "Cette façon de considérer les choses n'est pas dépourvue de présuppositions. Elle part des prémisses réelles et ne les abandonne pas un seul instant. Ces prémisses, ce sont les hommes, non pas isolés et figés, de quelque manière imaginaire, mais saisis dans leur processus de développement réel dans des conditions déterminées, développement visible empiriquement. Dès que l'on représente ce processus d'activité vitale, l'histoire cesse d'être une collection de faits sans vie, comme chez les empiristes, qui sont eux-mêmes encore abstraits, ou l'action imaginaire de sujets imaginaires, comme chez les idéalistes."

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
    usernames: [
        "robin", "noemie", "audric", "jeremy", "batman", "lenka", "patrick", "marco", "blandine", "karl marx"
    ],
    password: "123456"
};

export default Fixtures