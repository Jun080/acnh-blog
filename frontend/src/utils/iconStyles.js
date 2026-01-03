export function getIconStyle(categorie) {
    switch (categorie) {
        case "Villageois":
            return "bg-acnhOrange-600 border-acnhOrange-800 text-acnhOrange-50";
        case "Décoration":
            return "bg-acnhOrange-100 border-acnhOrange-200 text-acnhOrange-900";
        case "Faune":
            return "bg-acnhBlue-50 border-acnhBlue-300 text-acnhBlue-600";
        case "Actualités du jeu":
            return "bg-acnhGreen-200 border-acnhGreen-300 text-acnhGreen-800";
        default:
            return "bg-acnhNeutre-100 border-acnhNeutre-200 text-acnhNeutre-900";
    }
}
