/******************************
 * Fonction permettant de trier et formatter les compétences pour l'affichage sous la forme d'un tableau avec le
 * @param language
 * @param competences
 * @param categories
 * @param subCategories
 * @returns {Array}
 */
sortCompetences = function (language, competences, categories, subCategories) {
    let name
    //on récupere le bon nom suivant la langue de l'utilisateur
    if (language === "french") {
        name = "frenchName"
    }
    //on initialise le tableau de résultats
    let sortedCompetences = []
    //pour chacunes des compétences de l'utilisateur
    competences.forEach((competence) => {

        //on initialise les données qu'on rensignera
        let competenceName = competence[name]
        let categoryName = ""
        let subCategoryName = ""
        //on récupere le nom correspondant au code de la catégorie
        categories.forEach((category) => {
            if (category.index === competence.category) {
                categoryName = category[name].toUpperCase()
            }
        })
        //on récupere le nom correspondant au code de la sousCategorie
        subCategories.forEach((subCategory) => {
            if (subCategory.index === competence.subCategory) {
                subCategoryName = subCategory[name]
            }
        })
        //on formate notre objet compétences qu'on,inesera dams nos categories
        let formatedCompetence = {
            competenceName: competenceName,
            subCategoryName: subCategoryName
        }
        //si c'est la première fois qu'on boucle dans le tableau
        if (sortedCompetences.length === 0) {
            //on ajoute la compétence formatée
            sortedCompetences.push({
                categoryName: categoryName,
                competences: [formatedCompetence]
            })
        } else {//sinon
            //on crée un drapeau a false
            let alreadyFoundCategory = false
            //puis on boucle sur notre tableau contenant les compétences déja tries
            sortedCompetences.forEach((category, i) => {
                //si la catégorie est la meme
                if (category.categoryName === categoryName) {
                    //on push la compétence dedans la catégorie trouvé
                    sortedCompetences[i].competences.push(formatedCompetence)
                    //et on rensigne le drapeau que ca a été fait
                    alreadyFoundCategory = true
                }
            })
            //si aucune catégorie n'a matché
            if (!alreadyFoundCategory) {
                //on la crée et on rentre notre compétence dedans
                sortedCompetences.push({
                    categoryName: categoryName,
                    competences: [formatedCompetence]
                })
            }
        }
    })
    //on renvoie les compétences triées
    return sortedCompetences
}